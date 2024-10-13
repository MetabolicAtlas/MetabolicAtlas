import fetch from 'node-fetch';
import { MALICIOUS_CHARACTERS } from '../src/malicious-characters';
import { expectBadReqeustMaliciousCharacter } from './util';

describe('3d-network API', () => {
  test('happy path', async () => {
    const res = await fetch(
      `${API_BASE}/3d-network?model=HumanGem&version=${HUMAN_GEM_VERSION}&type=compartment&id=nucleus`,
    );
    expect(res.status).toBe(200);
  });

  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if model contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/3d-network?model=${character}&version=${HUMAN_GEM_VERSION}&type=compartment&id=nucleus`,
      );
      await expectBadReqeustMaliciousCharacter(res);
    },
  );
  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if version contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/3d-network?model=HumanGem&version=${character}}&type=compartment&id=nucleus`,
      );
      await expectBadReqeustMaliciousCharacter(res);
    },
  );
  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if type contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/3d-network?model=HumanGem&version=${HUMAN_GEM_VERSION}&type=${character}&id=nucleus`,
      );
      await expectBadReqeustMaliciousCharacter(res);
    },
  );
  // eslint-disable-next-line jest/expect-expect
  test.each(MALICIOUS_CHARACTERS)(
    'should return 400 if id contains %p',
    async character => {
      const res = await fetch(
        `${API_BASE}/3d-network?model=HumanGem&version=${HUMAN_GEM_VERSION}&type=compartment&id=${character}`,
      );
      await expectBadReqeustMaliciousCharacter(res);
    },
  );
});
