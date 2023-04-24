import fetch from 'node-fetch';
import { expectEmptyResponse, validateComponent } from './util';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';

const MAM01199m = {
  id: 'MAM01199m',
  name: '8(R)-hydroxy-hexadeca-(2E,4E,6E,10Z)-tetraenoate',
  charge: -1,
  formula: 'C16H23O3',
  isCurrency: false,
  subsystemSVGsCount: 1,
  compartmentSVGsCount: 1,
  subsystemsCount: 1,
  externalDbsCount: 3,
  compartmentsCount: 1,
};

describe('metabolites', () => {
  describe('get by id', () => {
    test('a metabolite should have correct data', async () => {
      const res = await fetch(
        `${API_BASE}/metabolites/MAM01199m?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );

      const data = await res.json();
      validateComponent(data, MAM01199m);
    });

    test('returns 404 if no metabolite with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/metabolites/nonexisting?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      expect(res.status).toBe(404);
    });

    test('returns 404 if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/metabolites/MAM01199m?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      expect(res.status).toBe(404);
    });

    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/compartments/golgi_apparatus?model=${character}&full=true`
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
          `${API_BASE}/metabolites/MAM01199m?model=HumanGem&version=${character}`
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
          `${API_BASE}/metabolites/${character}?model=HumanGem&version=${HUMAN_GEM_VERSION}`
        );
        // Slash or back-slash in path param provoke 404 instead of 400
        expect([400, 404].includes(res.status)).toBeTruthy();
      }
    );
  });

  describe('get related reactions', () => {
    test('a metabolite should have related reactions', async () => {
      const res = await fetch(
        `${API_BASE}/metabolites/MAM01199m/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );

      const data = await res.json();
      expect(data.length).toBe(2);
    });

    test('a compartmentalized metabolite should have <= related reactions than the corresponding metabolite', async () => {
      const [compartmentalized, allCompartments] = await Promise.all([
        fetch(
          `${API_BASE}/metabolites/MAM02040c/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}&isForAllCompartments=false&limit=1000`
        ),
        fetch(
          `${API_BASE}/metabolites/MAM02040c/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}&isForAllCompartments=true&limit=1000`
        ),
      ]);

      const [compResult, allResult] = await Promise.all([
        compartmentalized.json(),
        allCompartments.json(),
      ]);
      expect(compResult.length).toBeLessThanOrEqual(allResult.length);
    });

    test('should return an ordered list of related metabolites', async () => {
      const res = await fetch(
        `${API_BASE}/metabolites/MAM02319e/related-metabolites?model=ZebrafishGem&version=${ZEBRAFISH_GEM_VERSION}`
      );

      const relatedMetabolites = (await res.json()).map(m => m.id);
      const orderedMetabolites = ['MAM02319c', 'MAM02319m'];
      expect(relatedMetabolites).toEqual(orderedMetabolites);
    });

    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if no metabolite with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/metabolites/nonexisting/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });

    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/metabolites/MAM02319e/related-reactions?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });

    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/metabolites/MAM02319e/related-reactions?model=${character}&full=true`
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
          `${API_BASE}/metabolites/MAM01199m/related-reactions?model=HumanGem&version=${character}`
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
          `${API_BASE}/metabolites/${character}/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
        );
        // Slash or back-slash in path param provoke 404 instead of 400
        expect([400, 404].includes(res.status)).toBeTruthy();
      }
    );
  });

  describe('get related metabolites', () => {
    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if no metabolite with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/metabolites/nonexisting/related-metabolites?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });

    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/metabolites/MAM02319e/related-metabolites?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });

    test.each(MALICIOUS_CHARACTERS)(
      'should return 400 if model contains %p',
      async character => {
        const res = await fetch(
          `${API_BASE}/metabolites/MAM02319e/related-metabolites?model=${character}&full=true`
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
          `${API_BASE}/metabolites/MAM01199m/related-metabolites?model=HumanGem&version=${character}`
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
          `${API_BASE}/metabolites/${character}/related-metabolites?model=HumanGem&version=${HUMAN_GEM_VERSION}`
        );
        // Slash or back-slash in path param provoke 404 instead of 400
        expect([400, 404].includes(res.status)).toBeTruthy();
      }
    );
  });

  test('should return an ordered list of related metabolites', async () => {
    const res = await fetch(
      `${API_BASE}/metabolites/MAM02319e/related-metabolites?model=ZebrafishGem&version=${ZEBRAFISH_GEM_VERSION}`
    );

    const relatedMetabolites = (await res.json()).map(m => m.id);
    const orderedMetabolites = ['MAM02319c', 'MAM02319m'];
    expect(relatedMetabolites).toEqual(orderedMetabolites);
  });
});
