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

  // TODO: is this what we want? (is failing now, gives 200 and empty list)
  // TODO: make parameterized with different paths
  // TODO: update openAPI docs as well
  test('return 404 if no compartment with that id exists', async () => {
    const res = await fetch(
      `${API_BASE}/compartments/non-existing/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    expect(res.status).toBe(404);
  });

  test('return 200 and empty list if compartment exists but there are no reactions for model', async () => {
    const res = await fetch(
      `${API_BASE}/compartments/nucleus/related-reactions?model=non-existent&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    expect(res.status).toBe(200);
  });
});
