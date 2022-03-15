import { RedisCommandArgument, RedisCommandArguments } from '.';
import { BitValue } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export const IS_READ_ONLY = true;

export function transformArguments(
    key: RedisCommandArgument,
    bit: BitValue,
    start?: number,
    end?: number,
    bitRange?: boolean
): RedisCommandArguments {
    const args = ['BITPOS', key, bit.toString()];

    if (typeof start === 'number') {
        args.push(start.toString());
    }

    if (typeof end === 'number') {
        args.push(end.toString());
    }

    if (bitRange) {
        args.push('BIT');
    }

    return args;
}

export declare function transformReply(): number;
