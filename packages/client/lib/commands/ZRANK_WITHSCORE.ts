import { NullReply, TuplesReply, NumberReply, BlobStringReply, DoubleReply, UnwrapReply, Command } from '../RESP/types';
import ZRANK from './ZRANK';

export default {
  FIRST_KEY_INDEX: ZRANK.FIRST_KEY_INDEX,
  IS_READ_ONLY: ZRANK.IS_READ_ONLY,
  parseCommand(...args: Parameters<typeof ZRANK.parseCommand>) {
    ZRANK.parseCommand(...args);
    args[0].push('WITHSCORE');
  },
  transformArguments(...args: Parameters<typeof ZRANK.transformArguments>) { return [] },
  transformReply: {
    2: (reply: UnwrapReply<NullReply | TuplesReply<[NumberReply, BlobStringReply]>>) => {
      if (reply === null) return null;

      return {
        rank: reply[0],
        score: Number(reply[1])
      };
    },
    3: (reply: UnwrapReply<NullReply | TuplesReply<[BlobStringReply, DoubleReply]>>) => {
      if (reply === null) return null;

      return {
        rank: reply[0],
        score: reply[1]
      };
    }
  }
} as const satisfies Command;
