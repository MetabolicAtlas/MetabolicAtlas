import fetch from 'node-fetch';
import { validateComponent } from './util';

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
  test('a reaction should have correct data', async () => {
    const res = await fetch(
      `${API_BASE}/reactions/MAR01166?model=HumanGem&version=${HUMAN_GEM_VERSION}`
    );

    const data = await res.json();
    validateComponent(data, MAR01166);
  });
});
