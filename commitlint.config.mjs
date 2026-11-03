// Conventional Commits, plus the project rule: no em or en dashes in a commit
// message either. CI runs this on every commit of a PR.
const DASH = /[\u2013\u2014]/;

export default {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "no-dashes": ({ raw }) => [
          !DASH.test(raw ?? ""),
          "no em or en dashes (use a period, comma, colon or parentheses)",
        ],
      },
    },
  ],
  rules: {
    "no-dashes": [2, "always"],
  },
};
