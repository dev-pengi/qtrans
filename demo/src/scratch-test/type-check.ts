import { TranslationVariables, TranslationKey } from "./langs/types/index";

declare function t<K extends TranslationKey>(
  key: K,
  ...args: TranslationVariables[K]
): string;

// should test here 