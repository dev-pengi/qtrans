
// function to extract placeholders from a text 
export const extractPlaceholders = (str: string): string[] => {
	const matches = str.matchAll(/\{([\w.]+)\}/g);
	return [...new Set([...matches].map((m) => m[1]))];
};

// make generated tuples readble in typescript == testing purposes 
const placeholderToLabel = (path: string) => {
  return path
    .split(".")
    .map((part, index) =>
      index === 0
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join("");
};



// Converts placeholder names into a tuple type
// ["user.name", "user.age"] ->
// [userName: string | number, userAge: string | number]
export const placeholdersToTupleType = (names: string[]): string => {
  if (names.length === 0) return "[]";

  return `[
    ${names
      .map(
        (name) =>
          `${placeholderToLabel(name)}: string | number`
      )
      .join(",\n    ")}
  ]`;
};



// for validation purposes 
export const extractPlaceholderOccurrences = (
  str: string
): string[] => {
  const matches = str.matchAll(/\{([\w.]+)\}/g);
  return [...matches].map((m) => m[1]);
};


