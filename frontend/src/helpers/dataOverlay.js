const DEFAULT_GENE_COLOR = '#feb';
const DEFAULT_METABOLITE_COLOR = '#9df';
const DEFAULT_REACTION_COLOR = '#fff';

const DATA_TYPES_COMPONENTS = {
  gene: {
    description: 'gene (e.g., transcriptomics, proteomics, etc.)',
    componentType: 'gene',
    className: 'enz',
    defaultColor: DEFAULT_GENE_COLOR,
  },
  metabolite: {
    description: 'metabolite (e.g., metabolomics, etc.)',
    componentType: 'metabolite',
    className: 'met',
    defaultColor: DEFAULT_METABOLITE_COLOR,
  },
  reaction: {
    description: 'reaction (e.g., reaction presence, fluxomics, kcat, etc.)',
    componentType: 'reaction',
    className: 'rea',
    defaultColor: DEFAULT_REACTION_COLOR,
  },
};

const parseFile = async file => {
  let dataSets = [];
  const levels = { 'n/a': 'n/a' };

  const text = await file.text();

  const lines = text.split(/\r?\n/);
  // fetch data set
  const header = lines[0].split('\t');
  const val = Number(header[1]);
  if (Number.isNaN(val)) {
    dataSets = lines[0].split('\t');
    dataSets.shift();
    lines.shift();
  } else {
    dataSets = [];
    for (let i = 1; i < header.length; i += 1) {
      dataSets.push(`series${i}`);
    }
  }

  // parse lines
  // make dataSets key;
  for (let i = 0; i < dataSets.length; i += 1) {
    const dataSet = dataSets[i];
    levels[dataSet] = {};
  }

  let entriesCount = 0;
  for (let k = 0; k < lines.length; k += 1) {
    const line = lines[k];
    if (line) {
      const arrLine = line.split('\t');
      for (let i = 1; i < arrLine.length; i += 1) {
        if (arrLine[i]) {
          const v = Number(arrLine[i]);
          levels[dataSets[i - 1]][arrLine[0]] = v;
        }
      }
      entriesCount += 1;
    }
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
  DEFAULT_REACTION_COLOR,
  DATA_TYPES_COMPONENTS,
  parseFile,
};
