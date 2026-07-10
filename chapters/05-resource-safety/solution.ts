import { Effect } from "effect"
import type { Connection } from "./exercise.js"

export const withConnection = <A, E>(
  open: Effect.Effect<Connection, E>,
  close: (connection: Connection) => Effect.Effect<void>,
  use: (connection: Connection) => Effect.Effect<A, E>
): Effect.Effect<A, E> => Effect.acquireUseRelease(open, use, close)

