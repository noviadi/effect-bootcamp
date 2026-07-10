import { Effect, Fiber, TestClock, TestContext } from "effect"

const program = Effect.gen(function* () {
  const fiber = yield* Effect.sleep("1 hour").pipe(Effect.as("done"), Effect.fork)
  yield* TestClock.adjust("1 hour")
  return yield* Fiber.join(fiber)
})

console.log(await Effect.runPromise(program.pipe(Effect.provide(TestContext.TestContext))))
