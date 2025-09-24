// app/run.js
import fs from "fs";
import path from "path";
import minimist from "minimist";
import { handler } from "./handler.js";
import getLogger from "./utils/logger.js";
import { getContext } from "./utils/context.js";

async function main() {
  const args = minimist(process.argv.slice(2));
  const inputFile = args.input;
  const mode = args.mode;

  if (!inputFile || !mode) {
    getLogger().error("Usage: node app/run.js --input <file> --mode <classify|summarize>");
    process.exit(1);
  }

  // Resolve relative to the directory where the command is run
  const inputPath = path.resolve(process.cwd(), inputFile);
  const emails = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  // This simulates Lambda's event object
  const event = {
    mode,
    items: emails,
  };

  try {
    await handler(event, getContext(), () => {});
  } catch (err) {
    getLogger().error(`Handler failed: ${err.message}`);
    process.exit(1);
  }
}

main();
