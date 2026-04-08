export const fuzzyMatch = (str: string, query: string): boolean => {
  if (!query) return true;
  let qi = 0;
  for (let i = 0; i < str.length && qi < query.length; i++) {
    if (str[i].toLowerCase() === query[qi].toLowerCase()) qi++;
  }
  return qi === query.length;
};

export const levenshteinDistance = (a: string, b: string, bLen: number, aLen: number): number => {
  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  if (a[aLen - 1].toLowerCase() === b[bLen - 1].toLowerCase()) {
    return levenshteinDistance(a, b, bLen - 1, aLen - 1);
  }

  return 1 + Math.min(
    levenshteinDistance(a, b, bLen, aLen - 1),    // Deletion
    levenshteinDistance(a, b, bLen - 1, aLen),    // Insertion
    levenshteinDistance(a, b, bLen - 1, aLen - 1) // Substitution
  );
};
export const levenshtein = (str: string, query: string): boolean => {
  if (!query) return true;

  if (str.length < query.length) {
    str = str.slice(0, query.length);
  }

  const distance = levenshteinDistance(str, query, query.length, str.length);

  //this can be adjusted based on how lenient we want the matching to be
  return distance <= 2;
}