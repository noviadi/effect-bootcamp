import { Effect } from "effect"
import { type PlaceOrderInput, type ValidationError, validate } from "./domain.js"
import {
  type CardDeclined, Catalog, Email, Orders, Payments, type PaymentUnavailable,
  type PersistenceError, type UnknownSku
} from "./services.js"

export type PlaceOrderError = ValidationError | UnknownSku | PaymentUnavailable | CardDeclined | PersistenceError

export const placeOrder = (input: PlaceOrderInput): Effect.Effect<
  string,
  PlaceOrderError,
  Catalog | Payments | Orders | Email
> => Effect.gen(function* () {
  const valid = yield* validate(input)
  const catalog = yield* Catalog
  const payments = yield* Payments
  const orders = yield* Orders
  const email = yield* Email

  const priced = yield* Effect.forEach(valid.items, (item) =>
    catalog.price(item.sku).pipe(Effect.map((price) => price * item.quantity)),
    { concurrency: 3 }
  )
  const cents = priced.reduce((total, line) => total + line, 0)
  const paymentId = yield* payments.charge(valid.customerEmail, cents).pipe(
    Effect.retry({
      times: 2,
      while: (error) => error._tag === "PaymentUnavailable"
    })
  )
  const orderId = yield* orders.save(paymentId, cents)
  yield* email.receipt(valid.customerEmail, orderId, cents)
  return orderId
})

