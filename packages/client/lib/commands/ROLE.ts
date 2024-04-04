import { BlobStringReply, NumberReply, ArrayReply, TuplesReply, UnwrapReply, Command } from '../RESP/types';
import { CommandParser } from '../client/parser';

type MasterRole = [
  role: BlobStringReply<'master'>,
  replicationOffest: NumberReply,
  replicas: ArrayReply<TuplesReply<[host: BlobStringReply, port: BlobStringReply, replicationOffest: BlobStringReply]>>
];

type SlaveRole = [
  role: BlobStringReply<'slave'>,
  masterHost: BlobStringReply,
  masterPort: NumberReply,
  state: BlobStringReply<'connect' | 'connecting' | 'sync' | 'connected'>,
  dataReceived: NumberReply
];

type SentinelRole = [
  role: BlobStringReply<'sentinel'>,
  masterNames: ArrayReply<BlobStringReply>
];

type Role = TuplesReply<MasterRole | SlaveRole | SentinelRole>;

export default {
  FIRST_KEY_INDEX: undefined,
  IS_READ_ONLY: true,
  parseCommand(parser: CommandParser) {
    parser.push('ROLE');
  },
  transformArguments() { return [] },
  transformReply(reply: UnwrapReply<Role>) {
    switch (reply[0] as unknown as UnwrapReply<typeof reply[0]>) {
      case 'master': {
        const [role, replicationOffest, replicas] = reply as MasterRole;
        return {
          role,
          replicationOffest,
          replicas: (replicas as unknown as UnwrapReply<typeof replicas>).map(replica => {
            const [host, port, replicationOffest] = replica as unknown as UnwrapReply<typeof replica>;
            return {
              host,
              port: Number(port),
              replicationOffest: Number(replicationOffest)
            };
          })
        };
      }

      case 'slave': {
        const [role, masterHost, masterPort, state, dataReceived] = reply as SlaveRole;
        return {
          role,
          master: {
            host: masterHost,
            port: masterPort
          },
          state,
          dataReceived,
        };
      }

      case 'sentinel': {
        const [role, masterNames] = reply as SentinelRole;
        return {
          role,
          masterNames
        };
      }
    }
  }
} as const satisfies Command;
