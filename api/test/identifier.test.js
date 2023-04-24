import fetch from 'node-fetch';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';
import {
  expectBadReqeustMaliciousCharacter,
  maliciousCharactersExcetPathSeparators,
} from './util';

describe('identifier', () => {
  test('an external db should have components sorted by model name', async () => {
    const res = await fetch(`${API_BASE}/identifier/BiGG/PPNCL3`).then(r =>
      r.json()
    );
    const models = res.components.map(c => c.model);
    const sortedModels = [...models].sort((a, b) => a.localeCompare(b));

    expect(models).toEqual(sortedModels);
  });

  // eslint-disable-next-line jest/expect-expect
  test.each(maliciousCharactersExcetPathSeparators())(
    'should return 400 if external id contains %p',
    async character => {
      const res = await fetch(`${API_BASE}/identifier/BiGG/${character}`);
      await expectBadReqeustMaliciousCharacter(res);
    }
  );

  // eslint-disable-next-line jest/expect-expect
  test.each(maliciousCharactersExcetPathSeparators())(
    'should return 400 if database name contains %p',
    async character => {
      const res = await fetch(`${API_BASE}/identifier/${character}/PPNCL3`);
      await expectBadReqeustMaliciousCharacter(res);
    }
  );
});
