import { Effect } from "effect"
import { InvalidPort, UserLoadError } from "./exercise.js"

export const parsePort = (input: string): Effect.Effect<number, InvalidPort> =>
  Effect.suspend(() => {
    const port = Number(input)
    return Number.isInteger(port) && port >= 1 && port <= 65_535
      ? Effect.succeed(port)
      : Effect.fail(new InvalidPort(input))
  })

export const loadUser = (
  request: () => Promise<{ readonly id: number }>
): Effect.Effect<{ readonly id: number }, UserLoadError> =>
  Effect.tryPromise({ try: request, catch: (cause) => new UserLoadError(cause) })

