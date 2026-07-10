import { Effect } from "effect"

export interface Connection { readonly query: (sql: string) => Effect.Effect<string> }

// TODO: acquire a connection, use it, and always close it.
export const withConnection = <A, E>(
  open: Effect.Effect<Connection, E>,
  _close: (connection: Connection) => Effect.Effect<void>,
  use: (connection: Connection) => Effect.Effect<A, E>
): Effect.Effect<A, E> => open.pipe(Effect.flatMap(use))

