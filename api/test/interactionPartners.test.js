import fetch from 'node-fetch';

describe('interaction partners', () => {
  test('the interaction partners should include a list of reactions', async () => {
    const res = await fetch(
      `${API_BASE}/interaction-partners/ENSG00000120697?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const { result } = await res.json();
    expect(result.reactions.length).toBeGreaterThan(0);
  });

  test('returns 404 if no interaction partner with that id exists', async () => {
    const res = await fetch(
      `${API_BASE}/interaction-partners/nonexisting?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );
    expect(res.status).toBe(404);
  });

  test('returns 404 if model does not exist', async () => {
    const res = await fetch(
      `${API_BASE}/interaction-partners/ENSG00000120697?model=nonexisting&version=${HUMAN_GEM_VERSION}`
    );
    expect(res.status).toBe(404);
  });
});
