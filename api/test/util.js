/* The referenceComponent should be an object with keys that
 * are either:
 * - the same as the ones in component, or
 * - appended with 'Count', e.g. 'genes' in component and
 *   'genesCount' in referenceComponent
 */

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

export async function expectEmptyResponse(res) {
  expect(res.status).toBe(200);
  const data = await res.json();
  expect(data).toEqual([]);
}
