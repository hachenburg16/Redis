import { RedisArgument, NumberReply, Command } from '../RESP/types';
import { CommandParser } from '../client/parser';
import { RedisVariadicArgument } from './generic-transformers';

export default {
  FIRST_KEY_INDEX: 1,
  IS_READ_ONLY: false,
  parseCommand(parser: CommandParser, destination: RedisArgument, keys: RedisVariadicArgument) {
    parser.push('SINTERSTORE');
    parser.pushKey(destination)
    parser.pushKeys(keys);
  },
  transformArguments(destination: RedisArgument, keys: RedisVariadicArgument) { return [] },
  transformReply: undefined as unknown as () => NumberReply
} as const satisfies Command;
