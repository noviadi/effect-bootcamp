import { Effect } from "effect"

const events: Array<string> = []
const resource = Effect.acquireRelease(
  Effect.sync(() => { events.push("open"); return { id: 1 } }),
  () => Effect.sync(() => { events.push("close") })
)
const program = Effect.scoped(Effect.gen(function* () {
  const connection = yield* resource
  events.push(`use-${connection.id}`)
}))

Effect.runSync(program)
console.log(events)

