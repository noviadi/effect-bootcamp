import { Effect, Exit } from "effect"
import { describe, expect, it } from "vitest"
import { placeOrder } from "./app.js"
import { emptyState, testLayer } from "./layers.js"

const input = {
  customerEmail: "ada@example.com",
  items: [{ sku: "book", quantity: 2 }, { sku: "pen", quantity: 3 }]
}

describe("capstone", () => {
  it("places an order through provided services", async () => {
    const state = emptyState()
    const program = placeOrder(input).pipe(
      Effect.provide(testLayer(new Map([["book", 1500], ["pen", 200]]), state))
    )
    expect(await Effect.runPromise(program)).toBe("order-1")
    expect(state.paymentAttempts).toEqual([3600])
    expect(state.saved).toEqual([{ paymentId: "payment-1", cents: 3600 }])
    expect(state.receipts).toEqual(["ada@example.com:order-1:3600"])
  })

  it("short-circuits invalid input before services", async () => {
    const state = emptyState()
    const exit = await Effect.runPromiseExit(
      placeOrder({ ...input, customerEmail: "invalid" }).pipe(
        Effect.provide(testLayer(new Map(), state))
      )
    )
    expect(Exit.isFailure(exit)).toBe(true)
    expect(state.paymentAttempts).toEqual([])
  })

  it("retries unavailability but not declined cards", async () => {
    const unavailable = emptyState()
    await Effect.runPromiseExit(placeOrder(input).pipe(
      Effect.provide(testLayer(new Map([["book", 1500], ["pen", 200]]), unavailable, "unavailable"))
    ))
    expect(unavailable.paymentAttempts).toHaveLength(3)

    const declined = emptyState()
    await Effect.runPromiseExit(placeOrder(input).pipe(
      Effect.provide(testLayer(new Map([["book", 1500], ["pen", 200]]), declined, "declined"))
    ))
    expect(declined.paymentAttempts).toHaveLength(1)
  })
})

