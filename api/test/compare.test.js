import fetch from 'node-fetch';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';
import { expectBadReqeustMaliciousCharacter } from './util';

describe('compare', () => {
  test('happy path', async () => {
    const res = await fetch(
      `${API_BASE}/compare?models=[{%22model%22:%22FruitflyGem%22,%22version%22:%221_2_0%22},{%22model%22:%22YeastGem%22,%22version%22:%228_6_2%22}]`
    );
    expect(res.status).toBe(200);
  });

  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if model contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/compare?models=[{%22model%22:%22${character}%22,%22version%22:%221_2_0%22},{%22model%22:%22YeastGem%22,%22version%22:%228_6_2%22}]`
      );
      expect(res.status).toBe(400);
      const data = await res.text();
      const notAllowedCharactedInValue = data.startsWith(
        'Malicious char detected'
      );
      const jsonParseError = data.startsWith('Unexpected');
      expect(notAllowedCharactedInValue || jsonParseError).toBeTruthy();
    }
  );
  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if version contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/compare?models=[{%22model%22:%22${character}%22,%22version%22:%221_2_0%22},{%22model%22:%22YeastGem%22,%22version%22:%22${character}%22}]`
      );
      expect(res.status).toBe(400);
      const data = await res.text();
      const notAllowedCharactedInValue = data.startsWith(
        'Malicious char detected'
      );
      const jsonParseError = data.startsWith('Unexpected');
      expect(notAllowedCharactedInValue || jsonParseError).toBeTruthy();
    }
  );
});
