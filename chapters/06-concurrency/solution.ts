import { Effect } from "effect"

export const fetchAll = <A, E>(ids: ReadonlyArray<string>, fetchOne: (id: string) => Effect.Effect<A, E>) =>
  Effect.forEach(ids, fetchOne, { concurrency: 2 })

export const winner = <A, E>(left: Effect.Effect<A, E>, right: Effect.Effect<A, E>) =>
  Effect.race(left, right)

