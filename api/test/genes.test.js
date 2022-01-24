import fetch from 'node-fetch';
import { validateComponent } from './util';

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
  test('a gene should have correct data', async () => {
    const res = await fetch(
      `${API_BASE}/genes/ENSG00000109576?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    validateComponent(data, AADAT);
  });

  test('a gene should have related reactions', async () => {
    const res = await fetch(
      `${API_BASE}/genes/ENSG00000109576/related-reactions?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    expect(data.length).toBe(9);
  });
});
