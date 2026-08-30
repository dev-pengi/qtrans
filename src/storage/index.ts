import * as fs from "fs";
import { TranslationSchema } from "../config";
import {  TranslationsFileMode} from "../types";
import { partitionSingle, partitionSeparate } from "./partition";
import { mergeSingle, mergeSeparate } from "./merge";
import { writePartition } from "./io";

export const saveTranslations = (
  dirPath: string,
  schema: TranslationSchema,
  mode: TranslationsFileMode
): void => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  let files;
  switch (mode) {
    case "separate":
      files = partitionSeparate(schema);
      break;
    case "single":
    default:
      files = partitionSingle(schema);
      break;
  }

  writePartition(dirPath, files);
};

export const loadTranslations = (
  dirPath: string,
  mode: TranslationsFileMode
): TranslationSchema => {
  switch (mode) {
    case "separate":
      return mergeSeparate(dirPath);
    case "single":
    default:
      return mergeSingle(dirPath);
  }
};