import { RedisArgument, SimpleStringReply, BlobStringReply, NullReply, Command } from '../RESP/types';
import { CommandParser } from '../client/parser';

export interface SetOptions {
  expiration?: {
    type: 'EX' | 'PX' | 'EXAT' | 'PXAT';
    value: number;
  } | {
    type: 'KEEPTTL';
  } | 'KEEPTTL';
  /**
   * @deprecated Use `expiration` { type: 'EX', value: number } instead
   */
  EX?: number;
  /**
   * @deprecated Use `expiration` { type: 'PX', value: number } instead
   */
  PX?: number;
  /**
   * @deprecated Use `expiration` { type: 'EXAT', value: number } instead
   */
  EXAT?: number;
  /**
   * @deprecated Use `expiration` { type: 'PXAT', value: number } instead
   */
  PXAT?: number;
  /**
   * @deprecated Use `expiration` 'KEEPTTL' instead
   */
  KEEPTTL?: boolean;

  condition?: 'NX' | 'XX';
  /**
   * @deprecated Use `{ condition: 'NX' }` instead.
   */
  NX?: boolean;
  /**
   * @deprecated Use `{ condition: 'XX' }` instead.
   */
  XX?: boolean;
  
  GET?: boolean;
}

export default {
  FIRST_KEY_INDEX: 1,
  parseCommand(parser: CommandParser, key: RedisArgument, value: RedisArgument | number, options?: SetOptions) {
    parser.push('SET');
    parser.pushKey(key);
    parser.push(typeof value === 'number' ? value.toString() : value);

    if (options?.expiration) {
      if (typeof options.expiration === 'string') {
        parser.push(options.expiration);
      } else if (options.expiration.type === 'KEEPTTL') {
        parser.push('KEEPTTL');
      } else {
        parser.pushVariadic(
          [
            options.expiration.type,
            options.expiration.value.toString()
          ]
        );
      }
    } else if (options?.EX !== undefined) {
      parser.pushVariadic(['EX', options.EX.toString()]);
    } else if (options?.PX !== undefined) {
      parser.pushVariadic(['PX', options.PX.toString()]);
    } else if (options?.EXAT !== undefined) {
      parser.pushVariadic(['EXAT', options.EXAT.toString()]);
    } else if (options?.PXAT !== undefined) {
      parser.pushVariadic(['PXAT', options.PXAT.toString()]);
    } else if (options?.KEEPTTL) {
      parser.push('KEEPTTL');
    }

    if (options?.condition) {
      parser.push(options.condition);
    } else if (options?.NX) {
      parser.push('NX');
    } else if (options?.XX) {
      parser.push('XX');
    }

    if (options?.GET) {
      parser.push('GET');
    }
  },
  transformArguments(key: RedisArgument, value: RedisArgument | number, options?: SetOptions) { return [] },
  transformReply: undefined as unknown as () => SimpleStringReply<'OK'> | BlobStringReply | NullReply
} as const satisfies Command;
