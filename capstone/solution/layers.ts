import { Effect, Layer } from "effect"
import { CardDeclined, Catalog, Email, Orders, Payments, PaymentUnavailable, UnknownSku } from "./services.js"

export interface TestState {
  readonly paymentAttempts: Array<number>
  readonly saved: Array<{ paymentId: string; cents: number }>
  readonly receipts: Array<string>
}

export const testLayer = (
  prices: ReadonlyMap<string, number>,
  state: TestState,
  payment: "success" | "unavailable" | "declined" = "success"
) => Layer.mergeAll(
  Layer.succeed(Catalog, {
    price: (sku) => {
      const price = prices.get(sku)
      return price === undefined ? Effect.fail(new UnknownSku({ sku })) : Effect.succeed(price)
    }
  }),
  Layer.succeed(Payments, {
    charge: (_email, cents) => Effect.suspend<string, PaymentUnavailable | CardDeclined, never>(() => {
      state.paymentAttempts.push(cents)
      if (payment === "unavailable") return Effect.fail(new PaymentUnavailable({ message: "offline" }))
      if (payment === "declined") return Effect.fail(new CardDeclined({ reason: "insufficient funds" }))
      return Effect.succeed("payment-1")
    })
  }),
  Layer.succeed(Orders, {
    save: (paymentId, cents) => Effect.sync(() => {
      state.saved.push({ paymentId, cents })
      return "order-1"
    })
  }),
  Layer.succeed(Email, {
    receipt: (to, orderId, cents) => Effect.sync(() => {
      state.receipts.push(`${to}:${orderId}:${cents}`)
    })
  })
)

export const emptyState = (): TestState => ({ paymentAttempts: [], saved: [], receipts: [] })
