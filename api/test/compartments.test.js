import fetch from 'node-fetch';
import { validateComponent } from './util';

const NUCLEUS_INFO = {
  id: 'nucleus',
  letterCode: 'n',
  name: 'Nucleus',
  genesCount: 400,
  metabolitesCount: 184,
  reactionsCount: 243,
  subsystemCount: 26,
};

describe('compartments', () => {
  test('a compartment should have correct data', async () => {
    const res = await fetch(
      `${API_BASE}/compartments/nucleus?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const { info, subsystems } = await res.json();
    validateComponent(info, NUCLEUS_INFO);
    expect(info.subsystemCount).toBe(subsystems.length);
  });

  test('a compartment should have related reactions', async () => {
    const res = await fetch(
      `${API_BASE}/compartments/nucleus/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    expect(data.length).toBe(NUCLEUS_INFO.reactionsCount);
  });
});
