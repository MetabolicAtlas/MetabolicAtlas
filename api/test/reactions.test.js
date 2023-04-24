import fetch from 'node-fetch';
import {
  expectBadReqeustMaliciousCharacter,
  expectEmptyResponse,
  maliciousCharactersExceptPathSeparators,
  validateComponent,
} from './util';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';

const MAR01166 = {
  id: 'MAR01166',
  ec: '1.1.1.35;1.1.1.211',
  geneRule: 'ENSG00000060971 and ENSG00000113790 and ENSG00000133835',
  reversible: false,
  upperBound: 1000,
  lowerBound: 0,
  compartmentsCount: 1,
  genesCount: 3,
  metabolitesCount: 5,
  subsystemsCount: 1,
  externalDbsCount: 5,
  pubmedIdsCount: 1,
  compartmentSVGsCount: 1,
  subsystemSVGsCount: 1,
};

describe('reactions', () => {
  describe('get by id', () => {
    test('a reaction should have correct data', async () => {
      const res = await fetch(
        `${API_BASE}/reactions/MAR01166?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );

      const data = await res.json();
      validateComponent(data, MAR01166);
    });

    test('returns 404 if no reaction with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/reactions/nonexisting?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      expect(res.status).toBe(404);
    });

    test('returns 404 if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/reactions/MAR01166?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      expect(res.status).toBe(404);
    });

    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/reactions/MAR01166?model=${character}&full=true`
        );
        await expectBadReqeustMaliciousCharacter(res);
      }
    );

    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if version contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/reactions/MAR01166?model=HumanGem&version=${character}`
        );
        await expectBadReqeustMaliciousCharacter(res);
      }
    );

    // eslint-disable-next-line jest/expect-expect
    test.each(maliciousCharactersExceptPathSeparators())(
      'should return 400 if id contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/reactions/${character}?model=HumanGem&version=${HUMAN_GEM_VERSION}`
        );
        await expectBadReqeustMaliciousCharacter(res);
      }
    );
  });

  describe('get related reactions', () => {
    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if no reaction with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/reactions/nonexisting/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });

    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/reactions/MAR01166/related-reactions?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });

    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/reactions/MAR01166/related-reactions?model=${character}&full=true`
        );
        await expectBadReqeustMaliciousCharacter(res);
      }
    );

    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if version contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/reactions/MAR01166/related-reactions?model=HumanGem&version=${character}`
        );
        await expectBadReqeustMaliciousCharacter(res);
      }
    );

    // eslint-disable-next-line jest/expect-expect
    test.each(maliciousCharactersExceptPathSeparators())(
      'should return 400  if id contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/reactions/${character}/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
        );
        await expectBadReqeustMaliciousCharacter(res);
      }
    );
  });
});
