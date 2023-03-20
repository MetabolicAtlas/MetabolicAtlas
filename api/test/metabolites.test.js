import fetch from 'node-fetch';
import { expectEmptyResponse, validateComponent } from './util';

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
