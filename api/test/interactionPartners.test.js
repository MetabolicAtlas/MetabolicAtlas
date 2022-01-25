import fetch from 'node-fetch';

describe('interaction partners', () => {
  test('the interaction partners should include a list of reactions', async () => {
    const res = await fetch(
      `${API_BASE}/interaction-partners/ENSG00000120697?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const { reactions } = await res.json();
    expect(reactions.length).toBeGreaterThan(0);
  });
});
