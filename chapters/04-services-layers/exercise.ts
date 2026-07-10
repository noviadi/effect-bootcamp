import { Context, Data, Effect, Layer } from "effect"

export interface User { readonly id: string; readonly email: string }
export class UserNotFound extends Data.TaggedError("UserNotFound")<{ readonly id: string }> {}

export class UserRepository extends Context.Tag("bootcamp/UserRepository")<
  UserRepository,
  { readonly findById: (id: string) => Effect.Effect<User, UserNotFound> }
>() {}

export class Emailer extends Context.Tag("bootcamp/Emailer")<
  Emailer,
  { readonly send: (to: string, body: string) => Effect.Effect<void> }
>() {}

// TODO: request both services, find the user, then send a welcome email.
export const welcomeUser = (_id: string): Effect.Effect<void, UserNotFound, UserRepository | Emailer> =>
  Effect.void

export const testLayer = (users: ReadonlyMap<string, User>, sent: Array<string>) =>
  Layer.merge(
    Layer.succeed(UserRepository, {
      findById: (id) => {
        const user = users.get(id)
        return user ? Effect.succeed(user) : Effect.fail(new UserNotFound({ id }))
      }
    }),
    Layer.succeed(Emailer, { send: (to, body) => Effect.sync(() => { sent.push(`${to}: ${body}`) }) })
  )

