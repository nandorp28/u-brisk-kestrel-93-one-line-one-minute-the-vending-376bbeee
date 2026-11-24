// Vending Machine Pickup Line — make.fun entry
// Writes the pickup line to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// The line must be a single line, 1-200 characters, no leading/trailing
// whitespace, no newline — the sealed scorer rejects anything else.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I only dispense snacks, but for you I'll make an exception — press D4 and I'll dispense myself.";

function codePoints(text: string): number {
  return [...text].length;
}

function validate(line: string): string[] {
  const problems: string[] = [];
  if (codePoints(line) < 1 || codePoints(line) > 200) {
    problems.push(`length ${codePoints(line)} is outside 1-200 characters`);
  }
  if (line.trim() !== line) {
    problems.push("leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    problems.push("contains a newline");
  }
  if (line.trim().length === 0) {
    problems.push("only whitespace");
  }
  return problems;
}

const problems = validate(LINE);
if (problems.length > 0) {
  for (const p of problems) console.error(`invalid entry: ${p}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
// Read-back round trip: what the scorer reads must be exactly the line.
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) {
  console.error("round-trip mismatch: file content differs from entry");
  process.exit(1);
}
console.log(`wrote ${codePoints(LINE)}-char entry to ${outPath}`);
