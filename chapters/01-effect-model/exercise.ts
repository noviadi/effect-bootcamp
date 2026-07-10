import { Effect } from "effect"

export class InvalidPort {
  readonly _tag = "InvalidPort"
  constructor(readonly input: string) {}
}

// TODO: succeed with an integer from 1 through 65_535, otherwise fail InvalidPort.
export const parsePort = (input: string): Effect.Effect<number, InvalidPort> =>
  Effect.fail(new InvalidPort(input))

export class UserLoadError {
  readonly _tag = "UserLoadError"
  constructor(readonly cause: unknown) {}
}

// TODO: defer `request` and map Promise rejection to UserLoadError.
export const loadUser = (
  request: () => Promise<{ readonly id: number }>
): Effect.Effect<{ readonly id: number }, UserLoadError> =>
  Effect.fail(new UserLoadError("TODO"))

