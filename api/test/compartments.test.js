import fetch from 'node-fetch';
import {
  expectBadReqeustMaliciousCharacter,
  expectEmptyResponse,
  maliciousCharactersExceptPathSeparators,
  validateComponent,
} from './util';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';

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
  describe('get by id', () => {
    test('a compartment should have correct data', async () => {
      const res = await fetch(
        `${API_BASE}/compartments/nucleus?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      const { info, subsystems } = await res.json();
      validateComponent(info, NUCLEUS_INFO);
      expect(info.subsystemCount).toBe(subsystems.length);
    });

    test('returns 404 if no compartment with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/compartments/nonexisting?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      expect(res.status).toBe(404);
    });

    test('returns 404 if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/compartments/nucleus?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      expect(res.status).toBe(404);
    });

    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/compartments/golgi_apparatus?model=${character}&full=true`
        );
        await expectBadReqeustMaliciousCharacter(res);
      }
    );

    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if version contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/compartments/golgi_apparatus?model=HumanGem&version=${character}`
        );
        await expectBadReqeustMaliciousCharacter(res);
      }
    );

    // eslint-disable-next-line jest/expect-expect
    test.each(maliciousCharactersExceptPathSeparators())(
      'should return 400 if id contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/compartments/${character}?model=HumanGem&version=${HUMAN_GEM_VERSION}`
        );
        await expectBadReqeustMaliciousCharacter(res);
      }
    );
  });

  describe('get related reactions', () => {
    test('a compartment should have related reactions', async () => {
      const res = await fetch(
        `${API_BASE}/compartments/nucleus/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );

      const data = await res.json();
      expect(data.length).toBe(NUCLEUS_INFO.reactionsCount);
    });

    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if no compartment with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/compartments/nonexisting/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });

    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/compartments/nucleus/related-reactions?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });
  });

  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if model contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/compartments/golgi_apparatus/related-reactions?model=${character}&full=true`
      );
      await expectBadReqeustMaliciousCharacter(res);
    }
  );

  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if version contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/compartments/golgi_apparatus/related-reactions?model=HumanGem&version=${character}`
      );
      await expectBadReqeustMaliciousCharacter(res);
    }
  );

  // eslint-disable-next-line jest/expect-expect
  test.each(maliciousCharactersExceptPathSeparators())(
    'should return 400 if id contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/compartments/${character}/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      await expectBadReqeustMaliciousCharacter(res);
    }
  );
});
