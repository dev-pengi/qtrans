
// function to extract placeholders from a text 
export const extractPlaceholders = (str: string): string[] => {
	const matches = str.matchAll(/\{([\w.]+)\}/g);
	return [...new Set([...matches].map((m) => m[1]))];
};


// function converts an array of placeholder names into a ts string representation.
/*export const placeholdersToTypeString = (names: string[]): string => {
  if (names.length === 0) return "Record<string, never>";
  return `{ ${names.map((n) => `"${n}": string | number`).join("; ")} }`;
};*/




// Converts placeholder names into a tuple type.
// ["user.name", "user.age"] ->
// [userName: string | number, userAge: string | number]

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


