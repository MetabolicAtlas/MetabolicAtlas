import fetch from 'node-fetch';

describe('repository', () => {
  test('should return an ordered list of integrated models', async () => {
    const res = await fetch(`${API_BASE}/repository/integrated_models`);

    const models = await res.json();
    const sortedModels = [...models].sort((a, b) =>
      a.short_name.toLowerCase() < b.short_name.toLowerCase() ? -1 : 1
    );
    expect(models).toEqual(sortedModels);
  });

  test('should return an ordered list of models', async () => {
    const res = await fetch(`${API_BASE}/repository/models`);

    const models = await res.json();
    const sortedModels = [...models].sort((a, b) => a.id - b.id);
    expect(models).toEqual(sortedModels);
  });
});
