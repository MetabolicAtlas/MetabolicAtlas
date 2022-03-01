import driver from 'neo4j/driver';
import { search } from 'neo4j/queries/search';

describe('search', () => {
  afterAll(async () => {
    await driver.close();
  });

  test('model search should have max 50 results per component type', async () => {
    const data = await search({
      searchTerm: 'H2O',
      model: 'HumanGem',
      version: HUMAN_GEM_VERSION,
    });

    expect(Object.keys(data)).toContain('Human-GEM');

    const { metabolite } = data['Human-GEM'];
    expect(metabolite.length).toBeGreaterThan(0);
    expect(metabolite.length).toBeLessThan(50);
  });

  test('model search should receive sensible ranking scores', async () => {
    const [data1, data2] = await Promise.all([
      search({
        searchTerm: 'POLR3F',
        model: 'HumanGem',
        version: HUMAN_GEM_VERSION,
      }),
      search({
        searchTerm: 'Asparaginyl-Cysteinyl',
        model: 'HumanGem',
        version: HUMAN_GEM_VERSION,
      }),
    ]);

    const { gene } = data1['Human-GEM'];

    const { metabolite } = data2['Human-GEM'];

    const [firstGene] = gene.sort((a, b) => b.score - a.score);
    const [firstMetabolite] = metabolite.sort((a, b) => b.score - a.score);

    expect(firstGene.name).toBe('POLR3F');
    expect(firstMetabolite.name).toMatch(/Asparaginyl-Cysteinyl/);
  });

  test('model search with special characters should not fail', async () => {
    const [data1, data2] = await Promise.all([
      search({
        searchTerm: 'rna/dna: (met)',
        model: 'HumanGem',
        version: HUMAN_GEM_VERSION,
      }),
      search({
        searchTerm: 'cy\\|+ {zinc}! glyco/mg',
        model: 'HumanGem',
        version: HUMAN_GEM_VERSION,
      }),
    ]);
    for (const data of [data1, data2]) {
      const { name } = data['Human-GEM'];
      expect(name).toEqual('Human-GEM');
    }
  });

  test('global search should return results for multiple models', async () => {
    const data = await search({
      searchTerm: 'POLR3F',
    });

    expect(data['Human-GEM'].gene.length).toBeGreaterThan(0);
    expect(data['Mouse-GEM'].gene.length).toBeGreaterThan(0);
    expect(data['Rat-GEM'].gene.length).toBeGreaterThan(0);
    expect(data['Fruitfly-GEM'].gene.length).toBeGreaterThan(0);
    expect(data['Zebrafish-GEM'].gene.length).toBeGreaterThan(0);
  });
});
