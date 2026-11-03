import { describe, expect, it } from "vitest";
import { loadConfig } from "../../scripts/lib/vercel-headers.mjs";

type Rule = { source: string; headers: { key: string; value: string }[] };
const rules = loadConfig().headers as Rule[];

describe("vercel.json headers", () => {
  it("gives /.well-known/ the same baseline as every other path", () => {
    // Vercel's `/(.*)` rule doesn't reach /.well-known/ on a deployment (seen on
    // the first preview), so it has its own rule, which must not drift
    const all = rules.find((r) => r.source === "/(.*)");
    const wellKnown = rules.find((r) => r.source === "/.well-known/(.*)");
    expect(wellKnown?.headers).toEqual(all?.headers);
  });
});
