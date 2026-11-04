import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

// The first-visit flag (src/scripts/intro.js), run against stand-ins for the
// two globals it touches, the way the browser runs it: once, in <head>.
const code = readFileSync(new URL("../../src/scripts/intro.js", import.meta.url), "utf8");

function visit(store: Map<string, string>, blocked = false) {
  const attrs = new Map<string, string>();
  const sessionStorage = {
    getItem: (k: string) => {
      if (blocked) throw new Error("blocked");
      return store.get(k) ?? null;
    },
    setItem: (k: string, v: string) => {
      if (blocked) throw new Error("blocked");
      store.set(k, v);
    },
  };
  const document = {
    documentElement: { setAttribute: (k: string, v: string) => attrs.set(k, v) },
  };
  runInNewContext(code, { sessionStorage, document });
  return attrs;
}

describe("intro.js", () => {
  it("flags <html> on the first visit of a session and remembers it", () => {
    const store = new Map<string, string>();
    expect(visit(store).get("data-intro")).toBe("");
    expect(store.get("tab-intro")).toBe("1");
  });

  it("flags nothing on a later visit in the same session", () => {
    const store = new Map<string, string>();
    visit(store);
    expect(visit(store).size).toBe(0);
  });

  it("does not throw, and flags nothing, when storage is blocked", () => {
    expect(visit(new Map(), true).size).toBe(0);
  });

  it("stays small: it blocks the first paint", () => {
    expect(code.length).toBeLessThan(300);
  });
});
