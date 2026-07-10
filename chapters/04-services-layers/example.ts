import { Context, Effect, Layer } from "effect"

class Greeter extends Context.Tag("Greeter")<Greeter, { readonly greet: (name: string) => string }>() {}
const GreeterLive = Layer.succeed(Greeter, { greet: (name) => `Hello, ${name}` })

const program = Effect.gen(function* () {
  const greeter = yield* Greeter
  return greeter.greet("Effect")
})

console.log(Effect.runSync(program.pipe(Effect.provide(GreeterLive))))

