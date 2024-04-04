import { RedisArgument, ArrayReply, TuplesToMapReply, BlobStringReply, NumberReply, NullReply, UnwrapReply, Resp2Reply, Command } from '../RESP/types';
import { CommandParser } from '../client/parser';

export type XInfoGroupsReply = ArrayReply<TuplesToMapReply<[
  [BlobStringReply<'name'>, BlobStringReply],
  [BlobStringReply<'consumers'>, NumberReply],
  [BlobStringReply<'pending'>, NumberReply],
  [BlobStringReply<'last-delivered-id'>, NumberReply],
  /** added in 7.0 */
  [BlobStringReply<'entries-read'>, NumberReply | NullReply],
  /** added in 7.0 */
  [BlobStringReply<'lag'>, NumberReply],
]>>;

export default {
  FIRST_KEY_INDEX: 2,
  IS_READ_ONLY: true,
  parseCommand(parser: CommandParser, key: RedisArgument) {
    parser.pushVariadic(['XINFO', 'GROUPS']);
    parser.pushKey(key);
  },
  transformArguments(key: RedisArgument) { return [] },
  transformReply: {
    2: (reply: UnwrapReply<Resp2Reply<XInfoGroupsReply>>) => {
      return reply.map(group => {
        const unwrapped = group as unknown as UnwrapReply<typeof group>;
        return {
          name: unwrapped[1],
          consumers: unwrapped[3],
          pending: unwrapped[5],
          'last-delivered-id': unwrapped[7],
          'entries-read': unwrapped[9],
          lag: unwrapped[11]
        };
      });
    },
    3: undefined as unknown as () => XInfoGroupsReply
  }
} as const satisfies Command;
