import fetch from 'node-fetch';
import { validateComponent } from './util';

const LYSINE_METABOLISM = {
  id: 'lysine_metabolism',
  name: 'Lysine metabolism',
  externalDbsCount: 0,
  compartmentsCount: 5,
  genesCount: 52,
  metabolitesCount: 95,
  subsystemSVGsCount: 1,
};

describe('subsystems', () => {
  test('a subsystem should have correct data', async () => {
    const res = await fetch(
      `${API_BASE}/subsystems/lysine_metabolism?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    validateComponent(data, LYSINE_METABOLISM);
  });

  test('a subsystem should have related reactions', async () => {
    const res = await fetch(
      `${API_BASE}/subsystems/lysine_metabolism/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    expect(data.length).toBe(42);
  });
});
