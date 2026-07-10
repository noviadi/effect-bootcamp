import { Effect } from "effect"
import { describe, expect, it } from "vitest"
import { testLayer } from "./exercise.js"
import { welcomeUser } from "./solution.js"

describe("chapter 04", () => {
  it("assembles requirements with a Layer", () => {
    const sent: Array<string> = []
    const users = new Map([["1", { id: "1", email: "ada@example.com" }]])
    Effect.runSync(welcomeUser("1").pipe(Effect.provide(testLayer(users, sent))))
    expect(sent).toEqual(["ada@example.com: Welcome!"])
  })
})
