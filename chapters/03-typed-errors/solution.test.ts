import { Effect } from "effect"
import { describe, expect, it, vi } from "vitest"
import { NotFound, TransportError } from "./exercise.js"
import { getProfile } from "./solution.js"

describe("chapter 03", () => {
  it("retries transient errors", () => {
    let attempts = 0
    const fetch = vi.fn(() => Effect.suspend(() => ++attempts < 3
      ? Effect.fail(new TransportError({ message: "busy" }))
      : Effect.succeed({ id: "1", name: "Ada" })))
    expect(Effect.runSync(getProfile("1", fetch))).toEqual({ id: "1", name: "Ada" })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(attempts).toBe(3)
  })

  it("does not retry NotFound and recovers", () => {
    let attempts = 0
    const fetch = () => Effect.suspend(() => { attempts++; return Effect.fail(new NotFound({ id: "x" })) })
    expect(Effect.runSync(getProfile("x", fetch))).toEqual({ id: "x", name: "Guest" })
    expect(attempts).toBe(1)
  })
})

