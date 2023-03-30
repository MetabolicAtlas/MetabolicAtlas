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
});
