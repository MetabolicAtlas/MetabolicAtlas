import driver from 'neo4j/driver';
import { search } from 'neo4j/queries/search';

describe('search', () => {
  afterAll(async () => {
    await driver.close();
  });

  test('model search to have 50 results per component type if it exceeds the limit 50', async () => {
    const data = await search({
      searchTerm: 'H2O',
      model: 'HumanGem',
      version: HUMAN_GEM_VERSION,
    });

    expect(Object.keys(data)).toContain('Human-GEM');

    const { metabolite } = data['Human-GEM'];
    expect(metabolite.length).toBe(50);
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
});
