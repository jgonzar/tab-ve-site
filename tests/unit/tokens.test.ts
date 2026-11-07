import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// tokens.css holds the ink twice: as a hex for colours, and as channels for
// see-through ink (the dot field and the shadows). Nothing else ties the two
// together, so a recoloured --ink would leave the shadows on the old navy
const css = readFileSync(new URL("../../src/styles/tokens.css", import.meta.url), "utf8");
const token = (name: string) => new RegExp(`--${name}:\\s*([^;]+);`).exec(css)?.[1].trim();

describe("tokens.css", () => {
  it("keeps --ink-rgb in step with --ink", () => {
    const hex = token("ink");
    expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
    const channels = [1, 3, 5].map((i) => parseInt(String(hex).slice(i, i + 2), 16)).join(" ");
    expect(token("ink-rgb")).toBe(channels);
  });
});
