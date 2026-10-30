// PostToolUse hook: after Claude edits a .ts/.tsx file, lint that file and typecheck the project.
// On failure it exits with code 2, so Claude Code shows the errors to Claude and it fixes them right away.
import { execSync } from "node:child_process";

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let file = "";
  try {
    file = JSON.parse(input)?.tool_input?.file_path ?? "";
  } catch {
    process.exit(0);
  }
  if (!/\.(ts|tsx)$/.test(file)) process.exit(0);

  const run = (cmd) => {
    try {
      execSync(cmd, { stdio: "pipe", encoding: "utf8" });
      return null;
    } catch (err) {
      return `${cmd}\n${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
    }
  };

  const errors = [run(`npx eslint "${file}"`), run("npx tsc --noEmit")].filter(Boolean);
  if (errors.length) {
    console.error(`Checks failed after editing ${file}. Fix these before continuing:\n\n${errors.join("\n\n")}`);
    process.exit(2);
  }
  process.exit(0);
});
