import { RedisArgument, ArrayReply, NullReply, BlobStringReply, Command, UnwrapReply } from '@redis/client/dist/lib/RESP/types';
import { isArrayReply } from '@redis/client/dist/lib/commands/generic-transformers';
import { transformRedisJsonNullReply } from '.';
import { CommandParser } from '@redis/client/dist/lib/client/parser';

export interface RedisArrPopOptions {
  path: RedisArgument;
  index?: number;
}

export default {
  FIRST_KEY_INDEX: 1,
  IS_READ_ONLY: false,
  parseCommand(parser: CommandParser, key: RedisArgument, options?: RedisArrPopOptions) {
    parser.push('JSON.ARRPOP');
    parser.pushKey(key);

    if (options) {
      parser.push(options.path);

      if (options.index !== undefined) {
        parser.push(options.index.toString());
      }
    }
  },
  transformArguments(key: RedisArgument, options?: RedisArrPopOptions) { return [] },
  transformReply(reply: NullReply | BlobStringReply | ArrayReply<NullReply | BlobStringReply>) {
    return isArrayReply(reply) ?
      (reply as unknown as UnwrapReply<typeof reply>).map(item => transformRedisJsonNullReply(item)) :
      transformRedisJsonNullReply(reply);
  }
} as const satisfies Command;

