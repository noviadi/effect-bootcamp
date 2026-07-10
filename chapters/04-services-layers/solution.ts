import { Effect } from "effect"
import { Emailer, UserRepository } from "./exercise.js"

export const welcomeUser = (id: string) =>
  Effect.gen(function* () {
    const users = yield* UserRepository
    const emailer = yield* Emailer
    const user = yield* users.findById(id)
    yield* emailer.send(user.email, "Welcome!")
  })

