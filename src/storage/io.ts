import * as fs from "fs";
import path from "path";
import { FilePartition } from "./types";

export const writePartition = (dirPath: string, files: FilePartition): void => {
  for (const [fileName, content] of Object.entries(files)) {
    fs.writeFileSync(
      path.join(dirPath, fileName),
      JSON.stringify(content, null, 2)
    );
  }
};

export const readJsonFile = <T>(filePath: string, fallback: T): T => {
  if (!fs.existsSync(filePath)) return fallback;
  const content = fs.readFileSync(filePath, "utf-8");
  if (!content.trim().length) return fallback;
  return JSON.parse(content); 
};