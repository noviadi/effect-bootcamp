import { Effect } from "effect"
import { describe, expect, it, vi } from "vitest"
import { UnknownSku } from "./exercise.js"
import { subtotal, subtotalGen } from "./solution.js"

describe("chapter 02", () => {
  const prices = (sku: string) => sku === "A" ? Effect.succeed(12) : Effect.fail(new UnknownSku(sku))

  it("composes a subtotal", () => {
    expect(Effect.runSync(subtotal("A", 3, prices))).toBe(36)
    expect(Effect.runSync(subtotalGen("A", 3, prices))).toBe(36)
  })

  it("short-circuits", () => {
    const findPrice = vi.fn(prices)
    Effect.runSyncExit(subtotal("A", 0, findPrice))
    expect(findPrice).not.toHaveBeenCalled()
  })
})
