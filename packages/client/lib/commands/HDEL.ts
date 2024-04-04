import { RedisArgument, NumberReply, Command } from '../RESP/types';
import { CommandParser } from '../client/parser';
import { RedisVariadicArgument } from './generic-transformers';

export default {
  FIRST_KEY_INDEX: 1,
  parseCommand(parser: CommandParser, key: RedisArgument, field: RedisVariadicArgument) {
    parser.push('HDEL');
    parser.pushKey(key);
    parser.pushVariadic(field);
  },
  transformArguments(key: RedisArgument, field: RedisVariadicArgument) { return [] },
  transformReply: undefined as unknown as () => NumberReply
} as const satisfies Command;
