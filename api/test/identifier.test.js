import fetch from 'node-fetch';

describe('identifier', () => {
  test('an external db should have components sorted by model name', async () => {
    const res = await fetch(`${API_BASE}/identifier/BiGG/PPNCL3`).then(r =>
      r.json()
    );
    const models = res.components.map(c => c.model);
    const sortedModels = [...models].sort((a, b) => a.localeCompare(b));

    expect(models).toEqual(sortedModels);
  });
  test('a response identifier must include id, dbName, externalId and url', async () => {
    const exampleItems = [
      'BiGG/PPNCL3',
      'MetabolicAtlas/MAR02279',
      'Protein%20Atlas/ENSG00000120915',
    ];
    const responses = await Promise.all(
      exampleItems.map(item =>
        fetch(`${API_BASE}/identifier/${item}`).then(r => r.json())
      )
    );
    for (const res of responses) {
      expect(res.identifier).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          dbName: expect.any(String),
          externalId: expect.any(String),
          url: expect.stringContaining('https://'),
        })
      );
    }
  });
});
