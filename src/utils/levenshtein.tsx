export const fuzzyMatch = (str: string, query: string): boolean => {
  if (!query) return true;
  let qi = 0;
  for (let i = 0; i < str.length && qi < query.length; i++) {
    if (str[i].toLowerCase() === query[qi].toLowerCase()) qi++;
  }
  return qi === query.length;
};