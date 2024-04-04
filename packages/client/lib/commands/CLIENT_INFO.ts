import { Command, VerbatimStringReply } from '../RESP/types';
import { CommandParser } from '../client/parser';

export interface ClientInfoReply {
  id: number;
  addr: string;
  /**
   * available since 6.2
   */
  laddr?: string;
  fd: number;
  name: string;
  age: number;
  idle: number;
  flags: string;
  db: number;
  sub: number;
  psub: number;
  /**
   * available since 7.0.3
   */
  ssub?: number;
  multi: number;
  qbuf: number;
  qbufFree: number;
  /**
   * available since 6.0
   */
  argvMem?: number;
  /**
   * available since 7.0
   */
  multiMem?: number;
  obl: number;
  oll: number;
  omem: number;
  /**
   * available since 6.0
   */
  totMem?: number;
  events: string;
  cmd: string;
  /**
   * available since 6.0
   */
  user?: string;
  /**
   * available since 6.2
   */
  redir?: number;
  /**
   * available since 7.0
   */
  resp?: number;
}

const CLIENT_INFO_REGEX = /([^\s=]+)=([^\s]*)/g;

export default {
  FIRST_KEY_INDEX: undefined,
  IS_READ_ONLY: true,
  parseCommand(parser: CommandParser) {
    parser.pushVariadic(['CLIENT', 'INFO']);
  },
  transformArguments() { return [] },
  transformReply(rawReply: VerbatimStringReply) {
    const map: Record<string, string> = {};
    for (const item of rawReply.toString().matchAll(CLIENT_INFO_REGEX)) {
      map[item[1]] = item[2];
    }

    const reply: ClientInfoReply = {
      id: Number(map.id),
      addr: map.addr,
      fd: Number(map.fd),
      name: map.name,
      age: Number(map.age),
      idle: Number(map.idle),
      flags: map.flags,
      db: Number(map.db),
      sub: Number(map.sub),
      psub: Number(map.psub),
      multi: Number(map.multi),
      qbuf: Number(map.qbuf),
      qbufFree: Number(map['qbuf-free']),
      argvMem: Number(map['argv-mem']),
      obl: Number(map.obl),
      oll: Number(map.oll),
      omem: Number(map.omem),
      totMem: Number(map['tot-mem']),
      events: map.events,
      cmd: map.cmd,
      user: map.user
    };

    if (map.laddr !== undefined) {
      reply.laddr = map.laddr;
    }

    if (map.redir !== undefined) {
      reply.redir = Number(map.redir);
    }

    if (map.ssub !== undefined) {
      reply.ssub = Number(map.ssub);
    }

    if (map['multi-mem'] !== undefined) {
      reply.multiMem = Number(map['multi-mem']);
    }

    if (map.resp !== undefined) {
      reply.resp = Number(map.resp);
    }

    return reply;
  }
} as const satisfies Command;
