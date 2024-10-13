import fetch from 'node-fetch';
import { expectBadReqeustMaliciousCharacter } from './util';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';

describe('maps', () => {
  describe('listing', () => {
    test('a maps listing should include lists of compartments and subsystems', async () => {
      const res = await fetch(
        `${API_BASE}/maps/listing?model=HumanGem&version=${HUMAN_GEM_VERSION}`,
      );

      const { compartments, subsystems } = await res.json();
      expect(compartments.length).toBeGreaterThan(0);
      expect(subsystems.length).toBeGreaterThan(0);
    });

    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty response if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/maps/listing?model=nonexisting&version=${HUMAN_GEM_VERSION}`,
      );
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ compartments: [], customs: [], subsystems: [] });
    });

    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(`${API_BASE}/maps/listing?model=${character}`);
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
  });

  describe('search', () => {
    test('happy path', async () => {
      const res = await fetch(
        `${API_BASE}/maps/search?model=HumanGem&version=${HUMAN_GEM_VERSION}&searchTerm=HLA&limit=10`,
      );
      expect(res.status).toBe(200);
    });

    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/maps/search?model=${character}&version=${HUMAN_GEM_VERSION}&searchTerm=HLA&limit=10`,
        );
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if version contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/maps/search?model=HumanGem&version=${character}&searchTerm=HLA&limit=10`,
        );
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
    // eslint-disable-next-line jest/expect-expect
    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if searchTerm contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/maps/search?model=HumanGem&version=${HUMAN_GEM_VERSION}&searchTerm=${character}&limit=10`,
        );
        await expectBadReqeustMaliciousCharacter(res);
      },
    );
  });
});
