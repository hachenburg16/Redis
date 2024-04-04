import { BlobStringReply, Command } from '../RESP/types';
import { CommandParser } from '../client/parser';

export const LATENCY_EVENTS = {
  ACTIVE_DEFRAG_CYCLE: 'active-defrag-cycle',
  AOF_FSYNC_ALWAYS: 'aof-fsync-always',
  AOF_STAT: 'aof-stat',
  AOF_REWRITE_DIFF_WRITE: 'aof-rewrite-diff-write',
  AOF_RENAME: 'aof-rename',
  AOF_WRITE: 'aof-write',
  AOF_WRITE_ACTIVE_CHILD: 'aof-write-active-child',
  AOF_WRITE_ALONE: 'aof-write-alone',
  AOF_WRITE_PENDING_FSYNC: 'aof-write-pending-fsync',
  COMMAND: 'command',
  EXPIRE_CYCLE: 'expire-cycle',
  EVICTION_CYCLE: 'eviction-cycle',
  EVICTION_DEL: 'eviction-del',
  FAST_COMMAND: 'fast-command',
  FORK: 'fork',
  RDB_UNLINK_TEMP_FILE: 'rdb-unlink-temp-file'
} as const;

export type LatencyEvent = typeof LATENCY_EVENTS[keyof typeof LATENCY_EVENTS];

export default {
  FIRST_KEY_INDEX: undefined,
  IS_READ_ONLY: true,
  parseCommand(parser: CommandParser, event: LatencyEvent) {
    parser.pushVariadic(['LATENCY', 'GRAPH', event]);
  },
  transformArguments(event: LatencyEvent) { return [] },
  transformReply: undefined as unknown as () => BlobStringReply
} as const satisfies Command;
