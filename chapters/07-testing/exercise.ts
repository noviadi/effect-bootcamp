import { Data, Effect } from "effect"

export class InvalidEmail extends Data.TaggedError("InvalidEmail")<{ readonly value: string }> {}
export const validateEmail = (value: string) => value.includes("@")
  ? Effect.succeed(value)
  : Effect.fail(new InvalidEmail({ value }))

export const reminder = Effect.sleep("1 hour").pipe(Effect.as("Send reminder"))

// TODO: write tests for the failure and virtual-time behavior in your own *.test.ts.

