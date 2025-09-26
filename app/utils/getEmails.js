import fs from "fs";
import path from "path";

const getEmails = (inputFile) => {
  // Resolve relative to the directory where the command is run
  const inputPath = path.resolve(process.cwd(), inputFile);
  return JSON.parse(fs.readFileSync(inputPath, "utf8"));
};

export default getEmails;
