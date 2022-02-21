export function sanitizeSearchString(term, isAddBackSlash = true) {
  let newTerm = term
    .replace(/\s\s+/g, ' ')
    .replace(/^\s|\s$/g, '')
    .replace(/["]/g, '');
  if (isAddBackSlash === true) {
    newTerm = newTerm.replace(/[~^!-:/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  return newTerm;
}
