import fetch from 'node-fetch';

// This constant should be updated whenever new data (new versions
// of existing models, or new models) is added to the project.
const CORRECT_DATA = {
  'Human-GEM': {
    version: '1.11.0',
    gene_count: 3067,
    reaction_count: 13069,
    metabolite_count: 8366,
  },
  'Yeast-GEM': {
    version: '8.4.2',
    gene_count: 1150,
    reaction_count: 4058,
    metabolite_count: 2742,
  },
  'Mouse-GEM': {
    version: '1.3.0',
    gene_count: 2959,
    reaction_count: 13063,
    metabolite_count: 8370,
  },
  'Rat-GEM': {
    version: '1.3.0',
    gene_count: 2953,
    reaction_count: 13071,
    metabolite_count: 8374,
  },
  'Zebrafish-GEM': {
    version: '1.2.0',
    gene_count: 2714,
    reaction_count: 12909,
    metabolite_count: 8344,
  },
  'Fruitfly-GEM': {
    version: '1.2.0',
    gene_count: 1810,
    reaction_count: 12038,
    metabolite_count: 8117,
  },
  'Worm-GEM': {
    version: '1.3.0',
    gene_count: 1732,
    reaction_count: 12174,
    metabolite_count: 8138,
  },
};

describe('integrated models', () => {
  test('there should be a list of integrated models, with the correct version numbers and componenté counts', async () => {
    const res = await fetch(`${API_BASE}/repository/integrated_models`);

    const data = await res.json();

    expect(data.length).toBe(Object.keys(CORRECT_DATA).length);

    for (let {
      short_name,
      version,
      gene_count,
      reaction_count,
      metabolite_count,
    } of data) {
      expect(version).toBe(CORRECT_DATA[short_name].version);
      expect(gene_count).toBe(CORRECT_DATA[short_name].gene_count);
      expect(reaction_count).toBe(CORRECT_DATA[short_name].reaction_count);
      expect(metabolite_count).toBe(CORRECT_DATA[short_name].metabolite_count);
    }
  });

  test('the Human-GEM should exist', async () => {
    const res = await fetch(
      `${API_BASE}/repository/integrated_models/Human-GEM`
    );

    const { short_name, condition } = await res.json();
    expect(short_name).toBe('Human-GEM');
    expect(condition).toBe('Generic metabolism');
  });
});
