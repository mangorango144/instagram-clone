function generateSearchPrefixes(word: string): string[] {
  const prefixes: string[] = [];
  for (let i = 1; i <= word.length; i++) {
    prefixes.push(word.slice(0, i));
  }
  return prefixes;
}

export function generateSearchKeywords(
  fullName: string,
  username: string
): string[] {
  const nameParts = fullName.toLowerCase().split(" ").filter(Boolean);
  const usernamePart = username.toLowerCase();

  const keywords = nameParts.flatMap(generateSearchPrefixes); // prefixes from full name parts
  const usernameKeywords = generateSearchPrefixes(usernamePart);

  return Array.from(new Set([...keywords, ...usernameKeywords])); // remove duplicates
}
