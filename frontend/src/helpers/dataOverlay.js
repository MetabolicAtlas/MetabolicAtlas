const DATA_TYPES_COMPONENTS = {
  transcriptomics: {
    componentType: 'gene',
    className: 'enz',
    defaultColor: '#feb',
  },
  metabolomics: {
    componentType: 'metabolite',
    className: 'met',
    defaultColor: '#9df',
  },
};

/*
 * @param { Blob } file
 *
 * @example
 * try {
 *   const data = await parseCustomFile(file);
 * } catch (e) {
 *   console.error(e)
 * }
 */
const parseFile = async (file) => {
  let tissues = [];
  const levels = { 'n/a': 'n/a' };

  const text = await file.text();

  const lines = text.split(/\r?\n/);
  let indexLine = 1;
  // fetch Tissue
  if (lines[0].split('\t').length !== 1) {
    const arrLine = lines[0].split('\t');
    const v = Number(arrLine[1]);
    if (Number.isNaN(v)) {
      tissues = lines[0].split('\t');
      tissues.shift();
      lines.shift();
    } else {
      tissues = [];
      for (let i = 1; i < arrLine.length; i += 1) {
        tissues.push(`serie${i}`);
      }
    }
  } else {
    throw new Error('Invalid TSV format, expect at least two columns.');
  }

  // parse lines
  // make tissues key;
  for (let i = 0; i < tissues.length; i += 1) {
    const tissue = tissues[i];
    if (tissue in levels) {
      throw new Error(`Error: duplicated column '${tissue}'.`);
    }
    levels[tissue] = {};
  }

  let entriesCount = 0;
  for (let k = 0; k < lines.length; k += 1) {
    const line = lines[k];
    if (line) {
      const arrLine = line.split('\t');
      if (arrLine.length !== tissues.length + 1) {
        throw new Error(`Error: invalid number of values line ${indexLine}.`);
      }
      for (let i = 1; i < arrLine.length; i += 1) {
        if (arrLine[i]) {
          const v = Number(arrLine[i]);
          if (Number.isNaN(v)) {
            throw new Error(`Error: invalid value line ${indexLine}.`);
          }
          levels[tissues[i - 1]][arrLine[0]] = v;
        }
      }
      entriesCount += 1;
    }
    indexLine += 1;
  }

  return {
    levels,
    tissues,
    entriesCount,
  };
};

export { DATA_TYPES_COMPONENTS, parseFile };
