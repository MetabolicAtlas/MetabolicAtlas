import fetch from 'node-fetch';
import { expectEmptyResponse, validateComponent } from './util';

const AADAT = {
  id: 'ENSG00000109576',
  alternateName: 'aminoadipate aminotransferase',
  name: 'AADAT',
  synonyms: 'KAT2;KATII;KYAT2',
  subsystemSVGsCount: 4,
  compartmentSVGsCount: 2,
  compartmentsCount: 2,
  subsystemsCount: 4,
  externalDbsCount: 6,
};

describe('genes', () => {
  describe('get by id', () => {
    test('a gene should have correct data', async () => {
      const res = await fetch(
        `${API_BASE}/genes/ENSG00000109576?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );

      const data = await res.json();
      validateComponent(data, AADAT);
    });

    test('returns 404 if no gene with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/genes/nonexisting?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      expect(res.status).toBe(404);
    });

    test('returns 404 if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/genes/ENSG00000109576?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      expect(res.status).toBe(404);
    });
  });

  describe('get related reactions', () => {
    test('a gene should have related reactions', async () => {
      const res = await fetch(
        `${API_BASE}/genes/ENSG00000109576/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );

      const data = await res.json();
      expect(data.length).toBe(9);
    });

    // This is inconsistent
    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if no gene with that id exists', async () => {
      const res = await fetch(
        `${API_BASE}/genes/nonexisting/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });

    // This is inconsistent
    // eslint-disable-next-line jest/expect-expect
    test('returns 200 and empty list if model does not exist', async () => {
      const res = await fetch(
        `${API_BASE}/genes/ENSG00000109576/related-reactions?model=nonexisting&version=${HUMAN_GEM_VERSION}`
      );
      await expectEmptyResponse(res);
    });
  });
});
