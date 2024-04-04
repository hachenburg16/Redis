import { RedisArgument, NumberReply, Command } from '../RESP/types';
import { CommandParser } from '../client/parser';
import { BitValue } from './generic-transformers';

export default {
  FIRST_KEY_INDEX: 1,
  IS_READ_ONLY: true,
  parseCommand(parser: CommandParser,
    key: RedisArgument,
    bit: BitValue,
    start?: number,
    end?: number,
    mode?: 'BYTE' | 'BIT'
  ) {
    parser.setCachable();
    parser.push('BITPOS');
    parser.pushKey(key);
    parser.push(bit.toString());

    if (start !== undefined) {
      parser.push(start.toString());
    }

    if (end !== undefined) {
      parser.push(end.toString());
    }

    if (mode) {
      parser.push(mode);
    }
  },
  transformArguments(
    key: RedisArgument,
    bit: BitValue,
    start?: number,
    end?: number,
    mode?: 'BYTE' | 'BIT'
  ) { return [] },
  transformReply: undefined as unknown as () => NumberReply
} as const satisfies Command;
