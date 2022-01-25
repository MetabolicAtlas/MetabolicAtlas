import fetch from 'node-fetch';
import fs from 'fs';

describe('SVG thumbnail', () => {
  test('specifying a dimension greater than 100(px) and less than 600 (px) should work', async () => {
    const { status } = await fetch(
      `${API_BASE}/svg-thumbnail/acylglycerides_metabolism?model=Human-GEM&width=200&height=200`
    );

    expect(status).toBe(200);
  });

  test('specifying a dimension less than 100(px) should fail', async () => {
    const { status } = await fetch(
      `${API_BASE}/svg-thumbnail/acylglycerides_metabolism?model=Human-GEM&width=50&height=200`
    );

    expect(status).toBe(400);
  });

  test('specifying a dimension greater than 600(px) should fail', async () => {
    const { status } = await fetch(
      `${API_BASE}/svg-thumbnail/acylglycerides_metabolism?model=Human-GEM&width=200&height=700`
    );

    expect(status).toBe(400);
  });

  test('looking for an SVG that does not exist should fail', async () => {
    const { status } = await fetch(
      `${API_BASE}/svg-thumbnail/typo_acylglycerides_metabolism?model=Human-GEM&width=200&height=200`
    );

    expect(status).toBe(400);
  });
});
