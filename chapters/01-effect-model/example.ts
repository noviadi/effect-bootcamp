import { Effect } from "effect"

let executions = 0

const lazy = Effect.sync(() => {
  executions += 1
  return `execution-${executions}`
})

console.log("before running:", executions)
console.log("first:", Effect.runSync(lazy))
console.log("second:", Effect.runSync(lazy))

class JsonError {
  readonly _tag = "JsonError"
  constructor(readonly cause: unknown) {}
}

const parseJson = (input: string) =>
  Effect.try({
    try: () => JSON.parse(input) as unknown,
    catch: (cause) => new JsonError(cause)
  })

console.log(Effect.runSyncExit(parseJson("not json")))

