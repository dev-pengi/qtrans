import { extractPlaceholderOccurrences } from "../utils/placeholder.util";



export const validatePlaceholders = (
  source: string,
  translated: string
): boolean => {
  const expected = extractPlaceholderOccurrences(source);
  const actual = extractPlaceholderOccurrences(translated);

  if (expected.length !== actual.length) {
    return false;
  }

  const expectedCounts = new Map<string, number>();
  const actualCounts = new Map<string, number>();

  for (const placeholder of expected) {
    expectedCounts.set(
      placeholder,
      (expectedCounts.get(placeholder) ?? 0) + 1
    );
  }

  for (const placeholder of actual) {
    actualCounts.set(
      placeholder,
      (actualCounts.get(placeholder) ?? 0) + 1
    );
  }

  if (expectedCounts.size !== actualCounts.size) {
    return false;
  }

  for (const [placeholder, count] of expectedCounts) {
    if (actualCounts.get(placeholder) !== count) {
      return false;
    }
  }

  return true;
};