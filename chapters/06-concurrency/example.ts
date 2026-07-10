import { Effect } from "effect"

const task = (id: number) => Effect.gen(function* () {
  yield* Effect.sleep(`${40 - id * 5} millis`)
  return id
})

const program = Effect.all([1, 2, 3, 4].map(task), { concurrency: 2 })
console.log(await Effect.runPromise(program))

