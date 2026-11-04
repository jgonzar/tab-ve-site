// Total blocking time as the metric defines it, from the tasks the browser
// actually ran: the part of each long task (over 50 ms) that falls after the
// first contentful paint. Lighthouse's own TBT runs on a simulated phone, and
// on a host with a fast network (a Vercel preview) its estimated paint lands
// at about 800 ms while the real one comes at about 190 ms, so the page's own
// first render (parse, style and layout, about 100 ms on a CI runner) is
// scheduled after it and counted as blocking: a miss that comes and goes with
// whether that render splits into one task or two. Work before the first
// paint is what produces it; it cannot block a paint that has not happened.

const LONG_TASK_MS = 50;

/**
 * @param {{ startTime: number, duration: number }[]} tasks main-thread tasks, in ms from navigation start
 * @param {number} firstPaintMs observed first contentful paint, same clock
 * @param {number} slowdown the phone's CPU slowdown, as Lighthouse's mobile preset applies it
 * @returns {number} blocking time in ms
 */
export function blockingTimeAfterPaint(tasks, firstPaintMs, slowdown = 4) {
  let total = 0;
  for (const { startTime, duration } of tasks) {
    const after = startTime + duration - Math.max(startTime, firstPaintMs);
    if (after <= 0) continue;
    total += Math.max(0, after * slowdown - LONG_TASK_MS);
  }
  return total;
}
