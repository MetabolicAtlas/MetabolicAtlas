import fetch from 'node-fetch';
import {
  expectBadReqeustMaliciousCharacter,
  expectSuccessfulResponse,
} from './util';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';

describe('random components', () => {
  // eslint-disable-next-line jest/expect-expect
  test('returns 200 and empty object if model does not exist', async () => {
    const res = await fetch(
      `${API_BASE}/random-components?model=HumanGem&componentTypes=%7B%0A%20%20%22gene%22%3A%20true%0A%7D`,
    );
    await expectSuccessfulResponse(res);
  });

  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if model contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/random-components?model=${character}&componentTypes=%7B%0A%20%20%22gene%22%3A%20true%0A%7D`,
      );
      await expectBadReqeustMaliciousCharacter(res);
    },
  );

  test('should return 400 if componentTypes is not a JSON-encoded string', async () => {
    const res = await fetch(
      `${API_BASE}/random-components?model=HumanGem&componentTypes=${encodeURIComponent('[object Object]')}`,
    );
    expect(res.status).toBe(400);
  });

  test('returns 200 when componentTypes is a JSON-stringified object', async () => {
    const componentTypes = JSON.stringify({
      gene: true,
      compartmentalizedMetabolite: true,
    });
    const res = await fetch(
      `${API_BASE}/random-components?model=HumanGem&version=${HUMAN_GEM_VERSION}&componentTypes=${encodeURIComponent(componentTypes)}`,
    );
    expect(res.status).toBe(200);
  });
});
