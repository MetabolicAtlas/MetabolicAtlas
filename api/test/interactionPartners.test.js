import fetch from 'node-fetch';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';

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

  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if model contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/interaction-partners/ENSG00000120697?model=${character}&full=true`
      );
      expect(res.status).toBe(400);
      const data = await res.text();
      expect(data).toBe('Malicious char detected');
    }
  );

  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if version contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/interaction-partners/ENSG00000120697?model=HumanGem&version=${character}`
      );
      expect(res.status).toBe(400);
      const data = await res.text();
      expect(data).toBe('Malicious char detected');
    }
  );

  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 or 404 if id contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/interaction-partners/${character}?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      // Slash or back-slash in path param provoke 404 instead of 400
      expect([400, 404].includes(res.status)).toBeTruthy();
    }
  );
});
