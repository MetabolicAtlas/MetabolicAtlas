import fetch from 'node-fetch';
import { expectSuccessfulResponse } from './util';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';

describe('random components', () => {
  // eslint-disable-next-line jest/expect-expect
  test('returns 200 and empty object if model does not exist', async () => {
    const res = await fetch(
      `${API_BASE}/random-components?model=HumanGem&componentTypes=%7B%0A%20%20%22gene%22%3A%20true%0A%7D`
    );
    await expectSuccessfulResponse(res);
  });

  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if model contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/random-components?model=${character}&componentTypes=%7B%0A%20%20%22gene%22%3A%20true%0A%7D`
      );
      expect(res.status).toBe(400);
      const data = await res.text();
      expect(data).toBe('Malicious char detected');
    }
  );
});
