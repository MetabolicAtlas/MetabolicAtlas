const DEFAULT_GENE_COLOR = '#feb';
const DEFAULT_METABOLITE_COLOR = '#9df';

const DATA_TYPES_COMPONENTS = {
  transcriptomics: {
    componentType: 'gene',
    className: 'enz',
    defaultColor: DEFAULT_GENE_COLOR,
  },
  metabolomics: {
    componentType: 'metabolite',
    className: 'met',
    defaultColor: DEFAULT_METABOLITE_COLOR,
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
  let dataSets = [];
  const levels = { 'n/a': 'n/a' };

  const text = await file.text();

  const lines = text.split(/\r?\n/);
  let indexLine = 1;
  // fetch data set
  if (lines[0].split('\t').length !== 1) {
    const arrLine = lines[0].split('\t');
    const v = Number(arrLine[1]);
    if (Number.isNaN(v)) {
      dataSets = lines[0].split('\t');
      dataSets.shift();
      lines.shift();
    } else {
      dataSets = [];
      for (let i = 1; i < arrLine.length; i += 1) {
        dataSets.push(`serie${i}`);
      }
    }
  } else {
    throw new Error('Invalid TSV format, expect at least two columns.');
  }

  // parse lines
  // make dataSets key;
  for (let i = 0; i < dataSets.length; i += 1) {
    const dataSet = dataSets[i];
    if (dataSet in levels) {
      throw new Error(`Error: duplicated column '${dataSet}'.`);
    }
    levels[dataSet] = {};
  }

  let entriesCount = 0;
  for (let k = 0; k < lines.length; k += 1) {
    const line = lines[k];
    if (line) {
      const arrLine = line.split('\t');
      if (arrLine.length !== dataSets.length + 1) {
        throw new Error(`Error: invalid number of values line ${indexLine}.`);
      }
      for (let i = 1; i < arrLine.length; i += 1) {
        if (arrLine[i]) {
          const v = Number(arrLine[i]);
          if (Number.isNaN(v)) {
            throw new Error(`Error: invalid value line ${indexLine}.`);
          }
          levels[dataSets[i - 1]][arrLine[0]] = v;
        }
      }
      entriesCount += 1;
    }
    indexLine += 1;
  }

  return {
    levels,
    dataSets,
    entriesCount,
  };
};

export {
  DEFAULT_GENE_COLOR,
  DEFAULT_METABOLITE_COLOR,
  DATA_TYPES_COMPONENTS,
  parseFile,
};
