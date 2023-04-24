/* The referenceComponent should be an object with keys that
 * are either:
 * - the same as the ones in component, or
 * - appended with 'Count', e.g. 'genes' in component and
 *   'genesCount' in referenceComponent
 */

import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';

export const validateComponent = (component, referenceComponent) => {
  for (let [k, v] of Object.entries(referenceComponent)) {
    if (k.endsWith('Count') && !Object.keys(component).includes(k)) {
      const key = k.replace('Count', '');
      expect(Object.keys(component[key]).length).toBe(v);
    } else {
      expect(component[k]).toBe(v);
    }
  }
};

export async function expectSuccessfulResponse(res, expectedData) {
  expect(res.status).toBe(200);
  const data = await res.json();
  if (expectedData) {
    expect(data).toEqual(expectedData);
  }
}

export async function expectEmptyResponse(res) {
  return expectSuccessfulResponse(res, []);
}

export async function expectBadReqeustMaliciousCharacter(res) {
  const data = await res.text();
  expect(res.status).toBe(400);
  expect(data).toBe('Malicious char detected');
}

const PATH_SEPARATORS = ['/', '\\'];

export function maliciousCharactersExcetPathSeparators() {
  return MALICIOUS_CHARACTERS.filter(c => !PATH_SEPARATORS.includes(c));
}
