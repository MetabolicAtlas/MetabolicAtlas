import fetch from 'node-fetch';
import { expectEmptyResponse } from './util';

describe('maps', () => {
  test('a maps listing should include lists of compartments and subsystems', async () => {
    const res = await fetch(
      `${API_BASE}/maps/listing?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const { compartments, subsystems } = await res.json();
    expect(compartments.length).toBeGreaterThan(0);
    expect(subsystems.length).toBeGreaterThan(0);
  });

  // eslint-disable-next-line jest/expect-expect
  test('returns 200 and empty response if model does not exist', async () => {
    const res = await fetch(
      `${API_BASE}/maps/listing?model=nonexisting&version=${HUMAN_GEM_VERSION}`
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ compartments: [], customs: [], subsystems: [] });
  });
});
