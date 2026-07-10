import { Effect } from "effect"

export class InvalidQuantity {
  readonly _tag = "InvalidQuantity"
  constructor(readonly quantity: number) {}
}
export class UnknownSku {
  readonly _tag = "UnknownSku"
  constructor(readonly sku: string) {}
}
export type CheckoutError = InvalidQuantity | UnknownSku
export type FindPrice = (sku: string) => Effect.Effect<number, UnknownSku>

// TODO: validate quantity, look up price, return price * quantity.
export const subtotal = (
  _sku: string,
  quantity: number,
  _findPrice: FindPrice
): Effect.Effect<number, CheckoutError> =>
  quantity > 0 ? Effect.succeed(0) : Effect.fail(new InvalidQuantity(quantity))

