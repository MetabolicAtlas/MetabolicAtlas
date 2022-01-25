import fetch from 'node-fetch';

// This constant should be updated whenever new data (new versions
// of existing models, or new models) is added to the project.
const CORRECT_DATA = {
  'Human-GEM': {
    version: '1.10.0',
    gene_count: 3625,
    reaction_count: 13078,
    metabolite_count: 8370,
  },
  'Yeast-GEM': {
    version: '8.4.2',
    gene_count: 1150,
    reaction_count: 4058,
    metabolite_count: 2742,
  },
  'Mouse-GEM': {
    version: '1.2.0',
    gene_count: 3513,
    reaction_count: 13078,
    metabolite_count: 8382,
  },
  'Rat-GEM': {
    version: '1.2.0',
    gene_count: 3502,
    reaction_count: 13086,
    metabolite_count: 8386,
  },
  'Zebrafish-GEM': {
    version: '1.1.0',
    gene_count: 3232,
    reaction_count: 12940,
    metabolite_count: 8362,
  },
  'Fruitfly-GEM': {
    version: '1.1.0',
    gene_count: 2050,
    reaction_count: 12056,
    metabolite_count: 8132,
  },
  'Worm-GEM': {
    version: '1.1.0',
    gene_count: 1952,
    reaction_count: 12187,
    metabolite_count: 8150,
  },
};

describe('integrated models', () => {
  test('there should be a list of integrated models, with the correct version numbers and componen counts', async () => {
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
