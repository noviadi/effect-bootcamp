import { Effect } from "effect"

// TODO: execute at most two fetches concurrently and retain input order.
export const fetchAll = <A, E>(
  ids: ReadonlyArray<string>,
  fetchOne: (id: string) => Effect.Effect<A, E>
): Effect.Effect<Array<A>, E> => Effect.forEach(ids, fetchOne)

// TODO: return the first successful completion and interrupt the loser.
export const winner = <A, E>(
  left: Effect.Effect<A, E>,
  _right: Effect.Effect<A, E>
): Effect.Effect<A, E> => left

