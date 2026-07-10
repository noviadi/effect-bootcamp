import { Effect, Fiber, TestClock, TestContext } from "effect"
import { describe, expect, it } from "vitest"
import { reminder, validateEmail } from "./exercise.js"

describe("chapter 07", () => {
  it("asserts a typed error", async () => {
    const error = await Effect.runPromise(Effect.flip(validateEmail("invalid")))
    expect(error._tag).toBe("InvalidEmail")
    expect(error.value).toBe("invalid")
  })

  it("controls time without waiting", async () => {
    const test = Effect.gen(function* () {
      const fiber = yield* Effect.fork(reminder)
      yield* TestClock.adjust("1 hour")
      return yield* Fiber.join(fiber)
    })
    expect(await Effect.runPromise(test.pipe(Effect.provide(TestContext.TestContext)))).toBe("Send reminder")
  })
})
