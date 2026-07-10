import { Data, Effect, Schedule } from "effect"

class Busy extends Data.TaggedError("Busy")<{ readonly attempt: number }> {}
let attempt = 0
const unstable = Effect.suspend(() => {
  attempt += 1
  return attempt < 3 ? Effect.fail(new Busy({ attempt })) : Effect.succeed("ready")
})

const program = unstable.pipe(
  Effect.retry(Schedule.recurs(2)),
  Effect.catchTag("Busy", () => Effect.succeed("fallback"))
)

console.log(Effect.runSync(program))

