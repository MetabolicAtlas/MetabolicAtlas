import fetch from 'node-fetch';

describe('repository', () => {
  describe('GET all integrated models', () => {
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

  describe('GET integrated model by name', () => {
    test('should return 200 and model if exists', async () => {
      const res = await fetch(
        `${API_BASE}/repository/integrated_models/Human-GEM`
      );
      expect(res.status).toBe(200);
      const model = await res.json();
      expect(model).not.toBeNull();
    });

    test('should return 404 if name does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/repository/integrated_models/non-existing`
      );
      expect(res.status).toBe(404);
    });
  });
});
