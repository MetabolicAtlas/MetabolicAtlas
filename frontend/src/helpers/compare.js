export default (key, pattern, order = 'asc') =>
  (a, b) => {
    if (!Object.prototype.hasOwnProperty.call(a, key) || a[key] === null) {
      return 1;
    }

    if (!Object.prototype.hasOwnProperty.call(b, key) || b[key] === null) {
      return -1;
    }

    const aVal = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key];
    const bVal = typeof a[key] === 'string' ? b[key].toLowerCase() : b[key];

    let comparison = 0;
    if (pattern !== null) {
      if (aVal.search(pattern) !== -1) {
        comparison = 1;
      } else if (bVal.search(pattern) !== -1) {
        comparison = -1;
      } else if (aVal > bVal) {
        comparison = 1;
      } else if (aVal < bVal) {
        comparison = -1;
      }
    } else if (aVal > bVal) {
      comparison = 1;
    } else if (aVal < bVal) {
      comparison = -1;
    }

    return order === 'desc' ? comparison * -1 : comparison;
  };
