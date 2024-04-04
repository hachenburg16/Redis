import { strict as assert } from 'node:assert';
import testUtils, { GLOBAL } from '../test-utils';
import CONFIG_SET from './CONFIG_SET';
import { parseArgs } from './generic-transformers';

describe('CONFIG SET', () => {
  describe('transformArguments', () => {
    it('set one parameter (old version)', () => {
      assert.deepEqual(
        parseArgs(CONFIG_SET, 'parameter', 'value'),
        ['CONFIG', 'SET', 'parameter', 'value']
      );
    });

    it('set muiltiple parameters', () => {
      assert.deepEqual(
        parseArgs(CONFIG_SET, {
          1: 'a',
          2: 'b',
          3: 'c'
        }),
        ['CONFIG', 'SET', '1', 'a', '2', 'b', '3', 'c']
      );
    });
  });

  testUtils.testWithClient('client.configSet', async client => {
    assert.equal(
      await client.configSet('maxmemory', '0'),
      'OK'
    );
  }, GLOBAL.SERVERS.OPEN);
});
