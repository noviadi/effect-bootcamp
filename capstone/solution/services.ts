import { Context, Data, Effect } from "effect"

export class UnknownSku extends Data.TaggedError("UnknownSku")<{ readonly sku: string }> {}
export class PaymentUnavailable extends Data.TaggedError("PaymentUnavailable")<{ readonly message: string }> {}
export class CardDeclined extends Data.TaggedError("CardDeclined")<{ readonly reason: string }> {}
export class PersistenceError extends Data.TaggedError("PersistenceError")<{ readonly message: string }> {}
export class Catalog extends Context.Tag("capstone/Catalog")<Catalog, {
  readonly price: (sku: string) => Effect.Effect<number, UnknownSku>
}>() {}
export class Payments extends Context.Tag("capstone/Payments")<Payments, {
  readonly charge: (email: string, cents: number) => Effect.Effect<string, PaymentUnavailable | CardDeclined>
}>() {}
export class Orders extends Context.Tag("capstone/Orders")<Orders, {
  readonly save: (paymentId: string, cents: number) => Effect.Effect<string, PersistenceError>
}>() {}
export class Email extends Context.Tag("capstone/Email")<Email, {
  readonly receipt: (to: string, orderId: string, cents: number) => Effect.Effect<void>
}>() {}

