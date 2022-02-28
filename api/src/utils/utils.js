const sanitizeSearchString = (term, isAddBackSlash = true) => {
  let newTerm = term
    .replace(/\s\s+/g, ' ')
    .replace(/^\s|\s$/g, '')
    .replace(/["\\]/g, '');
  if (isAddBackSlash === true) {
    newTerm = newTerm.replace(/[~^!\-:/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  return newTerm;
};
const intersect = (a, b) => [...new Set(a)].filter(x => new Set(b).has(x));

export { sanitizeSearchString, intersect };
