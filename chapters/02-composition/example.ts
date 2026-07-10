import { Effect, pipe } from "effect"

const parse = (text: string) => Effect.succeed(Number(text))
const ensurePositive = (n: number) => n > 0 ? Effect.succeed(n) : Effect.fail("not-positive" as const)

const pipeline = pipe(parse("21"), Effect.flatMap(ensurePositive), Effect.map((n) => n * 2))
const generator = Effect.gen(function* () {
  const n = yield* parse("21")
  const positive = yield* ensurePositive(n)
  return positive * 2
})

console.log(Effect.runSync(pipeline), Effect.runSync(generator))

