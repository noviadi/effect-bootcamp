import { Effect, Exit } from "effect"
import { describe, expect, it, vi } from "vitest"
import { loadUser, parsePort } from "./solution.js"

describe("chapter 01", () => {
  it("validates ports", () => {
    expect(Effect.runSync(parsePort("8080"))).toBe(8080)
    expect(Exit.isFailure(Effect.runSyncExit(parsePort("0")))).toBe(true)
  })

  it("is lazy and maps rejection", async () => {
    const request = vi.fn(() => Promise.reject("offline"))
    const program = loadUser(request)
    expect(request).not.toHaveBeenCalled()
    const exit = await Effect.runPromiseExit(program)
    expect(request).toHaveBeenCalledOnce()
    expect(Exit.isFailure(exit)).toBe(true)
  })
})

