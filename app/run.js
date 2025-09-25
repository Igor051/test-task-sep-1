// app/run.js
import minimist from "minimist";
import { handler } from "./handler.js";
import getLogger from "./utils/logger.js";
import { getContext } from "./utils/context.js";
import getEmails from "./utils/getEmails.js";

async function main() {
  try {
  const {input: inputFile, mode} = minimist(process.argv.slice(2));

  if (!inputFile || !mode) {
    getLogger().error("Usage: node app/run.js --input <file> --mode <classify|summarize>");
    process.exit(1);
  }

  const emails = getEmails(inputFile)

  // Lambda's event object
  const event = {
    mode,
    items: emails,
  };

  // Invoking Lambda function
  const result = await handler(event, getContext());

  getLogger().info({response: result}, "Lambda response");

  getLogger().info({result: JSON.parse(result.body)}, "Result body");

  } catch (err) {
    getLogger().error(`Execution failed: ${err.message}`);
    process.exit(1);
  }
}

main();
