import fetch from 'node-fetch';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';
import { expectBadReqeustMaliciousCharacter } from './util';

describe('search API', () => {
  describe('model search', () => {
    test('happy path', async () => {
      const res = await fetch(
        `${API_BASE}/search?model=HumanGem&version=${HUMAN_GEM_VERSION}&searchTerm=HLA&limit=10`,
      );
      expect(res.status).toBe(200);
    });

    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/search?model=${character}&version=${HUMAN_GEM_VERSION}&searchTerm=HLA&limit=10`,
        );
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if version contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/search?model=HumanGem&version=${character}&searchTerm=HLA&limit=10`,
        );
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if searchTerm contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/search?model=HumanGem&version=${HUMAN_GEM_VERSION}&searchTerm=${character}&limit=10`,
        );
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if id limit %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/search?model=HumanGem&version=${HUMAN_GEM_VERSION}&searchTerm=HLA&limit=${character}`,
        );
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
  });
  describe('global search', () => {
    test('happy path', async () => {
      const res = await fetch(
        `${API_BASE}/search?version=${HUMAN_GEM_VERSION}&searchTerm=HLA&limit=10`,
      );
      expect(res.status).toBe(200);
    });

    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if version contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/search?version=${character}&searchTerm=HLA&limit=10`,
        );
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if searchTerm contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/search?&version=${HUMAN_GEM_VERSION}&searchTerm=${character}&limit=10`,
        );
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if id limit %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/search?version=${HUMAN_GEM_VERSION}&searchTerm=HLA&limit=${character}`,
        );
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
  });
});
