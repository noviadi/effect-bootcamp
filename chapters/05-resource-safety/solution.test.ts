import { Effect, Exit } from "effect"
import { describe, expect, it } from "vitest"
import { withConnection } from "./solution.js"

describe("chapter 05", () => {
  it.each(["success", "failure"] as const)("closes after %s", (mode) => {
    const events: Array<string> = []
    const connection = { query: () => Effect.succeed("row") }
    const result = withConnection(
      Effect.sync(() => { events.push("open"); return connection }),
      () => Effect.sync(() => { events.push("close") }),
      () => Effect.sync(() => { events.push("use") }).pipe(
        Effect.flatMap(() => mode === "success" ? Effect.succeed("ok") : Effect.fail("boom"))
      )
    )
    const exit = Effect.runSyncExit(result)
    expect(events).toEqual(["open", "use", "close"])
    expect(Exit.isSuccess(exit)).toBe(mode === "success")
  })
})

