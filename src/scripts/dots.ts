// Feeds the pointer into the dot fields (.dots, styled in global.css) so the
// dots near it clear and brand coloured ones take their place. It only sets
// three custom properties, --mx, --my and --r, on the field under the pointer;
// the look is all CSS. A fine pointer that can hover, and no request for
// reduced motion, are the only cases it runs in, so on a phone and for anyone
// who asked for calm the dots simply stay still. External file, so the CSP
// (script-src 'self') is untouched.

const RADIUS = 150;
const FOLLOW = 0.18;
const GROW = 0.12;

interface Field {
  el: HTMLElement;
  x: number;
  y: number;
  tx: number;
  ty: number;
  r: number;
  tr: number;
}

const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
const wantsCalm = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canHover && !wantsCalm) {
  const fields = new Map<HTMLElement, Field>();
  let frame = 0;

  const paint = (f: Field) => {
    f.el.style.setProperty("--mx", `${f.x}px`);
    f.el.style.setProperty("--my", `${f.y}px`);
    f.el.style.setProperty("--r", `${f.r}px`);
  };

  const step = () => {
    frame = 0;
    let moving = false;
    for (const f of fields.values()) {
      f.x += (f.tx - f.x) * FOLLOW;
      f.y += (f.ty - f.y) * FOLLOW;
      f.r += (f.tr - f.r) * GROW;
      const settled =
        Math.abs(f.tx - f.x) < 0.4 && Math.abs(f.ty - f.y) < 0.4 && Math.abs(f.tr - f.r) < 0.4;
      if (settled && f.tr === 0) {
        // Gone: back to still dots
        for (const name of ["--mx", "--my", "--r"]) f.el.style.removeProperty(name);
        fields.delete(f.el);
        continue;
      }
      paint(f);
      if (!settled) moving = true;
    }
    if (moving) frame = requestAnimationFrame(step);
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(step);
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>(".dots") ?? null;
      for (const f of fields.values()) if (f.el !== el) f.tr = 0;
      if (el) {
        const box = el.getBoundingClientRect();
        const x = event.clientX - box.left;
        const y = event.clientY - box.top;
        const f = fields.get(el);
        if (f) {
          f.tx = x;
          f.ty = y;
          f.tr = RADIUS;
        } else {
          fields.set(el, { el, x, y, tx: x, ty: y, r: 0, tr: RADIUS });
        }
      }
      wake();
    },
    { passive: true },
  );

  // The pointer left the window
  document.documentElement.addEventListener("pointerleave", () => {
    for (const f of fields.values()) f.tr = 0;
    wake();
  });
}
