import driver from 'neo4j/driver';
import { search } from 'neo4j/queries/search';

describe('search', () => {
  afterAll(async () => {
    await driver.close();
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

  test('search for yeast reaction id should give highest score to yeast', async () => {
    const data = await search({
      searchTerm: 'r_2025',
    });
    let topscore = 0;

    for (const model of [
      'Human-GEM',
      'Mouse-GEM',
      'Rat-GEM',
      'Fruitfly-GEM',
      'Zebrafish-GEM',
    ]) {
      const scores = COMPONENTS.map(c =>
        data[model][c][0] ? data[model][c][0].score : 0
      );
      topscore =
        Math.max(...scores) > topscore ? Math.max(...scores) : topscore;
    }

    const yeastScore = data['Yeast-GEM']['reaction'][0].score;
    expect(yeastScore).toBeGreaterThan(topscore);
  });
});
