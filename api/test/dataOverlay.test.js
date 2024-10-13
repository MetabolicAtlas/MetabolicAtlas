import fetch from 'node-fetch';

describe('data overlay', () => {
  test('should return at least one data type, that includes at least one data source', async () => {
    const res = await fetch(`${API_BASE}/data-overlay/Human-GEM`);

    const data = await res.json();
    expect(Object.values(data).length).toBeGreaterThan(0);
    expect(Object.values(data)[0].length).toBeGreaterThan(0);
  });

  test('should return an ordered list of data set names', async () => {
    const res = await fetch(
      `${API_BASE}/data-overlay/Human-GEM/reaction/HPA_single-cell_reactions.tsv/data-sets`,
    );

    const data = await res.json();
    const sortedData = [...data].sort((a, b) => a.localeCompare(b));
    expect(data).toEqual(sortedData);
  });
});
