import { RedisArgument, Command, NullReply, NumberReply, ArrayReply } from '@redis/client/dist/lib/RESP/types';
import { transformRedisJsonArgument } from '.';
import { CommandParser } from '@redis/client/dist/lib/client/parser';

export interface JsonStrAppendOptions {
  path?: RedisArgument;
}

export default {
  FIRST_KEY_INDEX: 1,
  IS_READ_ONLY: false,
  parseCommand(parser: CommandParser, key: RedisArgument, append: string, options?: JsonStrAppendOptions) {
    parser.push('JSON.STRAPPEND');
    parser.pushKey(key);

    if (options?.path !== undefined) {
      parser.push(options.path);
    }

    parser.push(transformRedisJsonArgument(append));
  },
  transformArguments(key: RedisArgument, append: string, options?: JsonStrAppendOptions) { return [] },
  transformReply: undefined as unknown as () => NumberReply | ArrayReply<NullReply | NumberReply>
} as const satisfies Command;
