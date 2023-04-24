import fetch from 'node-fetch';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';
import {
  expectBadReqeustMaliciousCharacter,
  maliciousCharactersExcetPathSeparators,
} from './util';

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

  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if model contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/interaction-partners/ENSG00000120697?model=${character}`
      );
      await expectBadReqeustMaliciousCharacter(res);
    }
  );

  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if version contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/interaction-partners/ENSG00000120697?model=HumanGem&version=${character}`
      );
      await expectBadReqeustMaliciousCharacter(res);
    }
  );

  // eslint-disable-next-line jest/expect-expect
  test.each(maliciousCharactersExcetPathSeparators())(
    'should return 400 if id contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/interaction-partners/${character}?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      await expectBadReqeustMaliciousCharacter(res);
    }
  );
});
