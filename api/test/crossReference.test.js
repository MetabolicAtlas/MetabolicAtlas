import fetch from 'node-fetch';

describe('cross reference', () => {
  test('should return more than one component', async () => {
    const res = await fetch(`${API_BASE}/external-db/HMR%202.0/HMR_1157`);

    const { components } = await res.json();
    expect(components.length).toBeGreaterThan(1);
  });

  test('should contain an URL for an external reference', async () => {
    const res = await fetch(`${API_BASE}/external-db/Recon3D/RE3335C`);

    const {
      externalDb: { url },
    } = await res.json();
    expect(url.length).toBeGreaterThan(1);
  });
});