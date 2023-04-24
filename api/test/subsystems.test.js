import fetch from 'node-fetch';
import { expectEmptyResponse, validateComponent } from './util';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';

const LYSINE_METABOLISM = {
  id: 'lysine_metabolism',
  name: 'Lysine metabolism',
  externalDbsCount: 0,
  compartmentsCount: 5,
  genesCount: 52,
  metabolitesCount: 95,
  subsystemSVGsCount: 1,
};

describe('subsystems', () => {
  describe('get by id', () => {
    test('a subsystem should have correct data', async () => {
      const res = await fetch(
        `${API_BASE}/subsystems/lysine_metabolism?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );

      const data = await res.json();
      validateComponent(data, LYSINE_METABOLISM);
    });

    test('returns 404 if no subsystem with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/subsystems/nonexisting?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      expect(res.status).toBe(404);
    });

    test('returns 404 if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/subsystems/lysine_metabolism?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      expect(res.status).toBe(404);
    });

    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/subsystems/lysine_metabolism?model=${character}&full=true`
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
          `${API_BASE}/subsystems/lysine_metabolism?model=HumanGem&version=${character}`
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
          `${API_BASE}/subsystems/${character}?model=HumanGem&version=${HUMAN_GEM_VERSION}`
        );
        // Slash or back-slash in path param provoke 404 instead of 400
        expect([400, 404].includes(res.status)).toBeTruthy();
      }
    );
  });

  describe('get related reactions', () => {
    test('a subsystem should have related reactions', async () => {
      const res = await fetch(
        `${API_BASE}/subsystems/lysine_metabolism/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );

      const data = await res.json();
      expect(data.length).toBe(42);
    });

    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if no subsystem with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/subsystems/nonexisting/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });

    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/subsystems/lysine_metabolism/related-reactions?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });

    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/subsystems/lysine_metabolism/related-reactions?model=${character}&full=true`
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
          `${API_BASE}/subsystems/lysine_metabolism/related-reactions?model=HumanGem&version=${character}`
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
          `${API_BASE}/subsystems/${character}/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
        );
        // Slash or back-slash in path param provoke 404 instead of 400
        expect([400, 404].includes(res.status)).toBeTruthy();
      }
    );
  });
});
