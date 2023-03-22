import fetch from 'node-fetch';
import { expectEmptyResponse, validateComponent } from './util';

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
  });
});
