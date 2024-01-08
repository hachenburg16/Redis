# [Transactions](https://redis.io/docs/interact/transactions/) ([`MULTI`](https://redis.io/commands/multi/)/[`EXEC`](https://redis.io/commands/exec/))

Start a [transaction](https://redis.io/docs/interact/transactions/) by calling `.multi()`, then chaining your commands. When you're done, call `.exec()` and you'll get an array back with your results:

```javascript
const [setReply, getReply] = await client.multi()
  .set('key', 'value')
  .get('another-key')
  .exec();
```

## `exec<'typed'>()`/`execTyped()`

A transaction invoked with `.exec<'typed'>`/`execTyped()` will return types appropriate to the commands in the transaction:

```javascript
const multi = client.multi().ping();
await multi.exec(); // Array<ReplyUnion>
await multi.exec<'typed'>(); // [string]
await multi.execTyped(); // [string]
```

> :warning: this only works when all the commands are invoked in a single "call chain"

## [`WATCH`](https://redis.io/commands/watch/)

You can also [watch](https://redis.io/docs/interact/transactions/#optimistic-locking-using-check-and-set) keys by calling `.watch()`. Your transaction will abort if any of the watched keys change or if the client reconnected between the `watch` and `exec` calls.

The `WATCH` state is stored on the connection (by the server). In case you need to run multiple `WATCH` & `MULTI` in parallel you'll need to use a [pool](./pool.md).