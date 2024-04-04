import { strict as assert } from 'node:assert';
import testUtils, { GLOBAL, parseFirstKey } from '../test-utils';
import XREAD from './XREAD';
import { parseArgs } from './generic-transformers';

describe('XREAD', () => {
  describe('FIRST_KEY_INDEX', () => {
    it('single stream', () => {
      assert.equal(
        parseFirstKey(XREAD, {
          key: 'key',
          id: ''
        }),
        'key'
      );
    });

    it('multiple streams', () => {
      assert.equal(
        parseFirstKey(XREAD, [{
          key: '1',
          id: ''
        }, {
          key: '2',
          id: ''
        }]),
        '1'
      );
    });
  });

  describe('transformArguments', () => {
    it('single stream', () => {
      assert.deepEqual(
        parseArgs(XREAD, {
          key: 'key',
          id: '0-0'
        }),
        ['XREAD', 'STREAMS', 'key', '0-0']
      );
    });

    it('multiple streams', () => {
      assert.deepEqual(
        parseArgs(XREAD, [{
          key: '1',
          id: '0-0'
        }, {
          key: '2',
          id: '0-0'
        }]),
        ['XREAD', 'STREAMS', '1', '2', '0-0', '0-0']
      );
    });

    it('with COUNT', () => {
      assert.deepEqual(
        parseArgs(XREAD, {
          key: 'key',
          id: '0-0'
        }, {
          COUNT: 1
        }),
        ['XREAD', 'COUNT', '1', 'STREAMS', 'key', '0-0']
      );
    });

    it('with BLOCK', () => {
      assert.deepEqual(
        parseArgs(XREAD, {
          key: 'key',
          id: '0-0'
        }, {
          BLOCK: 0
        }),
        ['XREAD', 'BLOCK', '0', 'STREAMS', 'key', '0-0']
      );
    });

    it('with COUNT, BLOCK', () => {
      assert.deepEqual(
        parseArgs(XREAD, {
          key: 'key',
          id: '0-0'
        }, {
          COUNT: 1,
          BLOCK: 0
        }),
        ['XREAD', 'COUNT', '1', 'BLOCK', '0', 'STREAMS', 'key', '0-0']
      );
    });
  });

  // TODO
  // testUtils.testAll('client.xRead', async client => {
  //   const message = { field: 'value' },
  //     [, reply] = await Promise.all([
  //       client.xAdd('key', '*', message),
  //       client.xRead({
  //         key: 'key',
  //         id: '0-0'
  //       })
  //     ])
  //   assert.equal(
  //     await client.xRead({
  //       key: 'key',
  //       id: '0'
  //     }),
  //     null
  //   );
  // }, GLOBAL.SERVERS.OPEN);
});
