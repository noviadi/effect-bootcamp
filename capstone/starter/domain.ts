import { Data, Effect } from "effect"

export interface LineItem { readonly sku: string; readonly quantity: number }
export interface PlaceOrderInput { readonly customerEmail: string; readonly items: ReadonlyArray<LineItem> }

export class InvalidEmail extends Data.TaggedError("InvalidEmail")<{ readonly value: string }> {}
export class EmptyCart extends Data.TaggedError("EmptyCart")<Record<string, never>> {}
export class InvalidQuantity extends Data.TaggedError("InvalidQuantity")<{
  readonly sku: string
  readonly quantity: number
}> {}
export type ValidationError = InvalidEmail | EmptyCart | InvalidQuantity

// TODO: validate email, non-empty cart, and every quantity.
export const validate = (_input: PlaceOrderInput): Effect.Effect<PlaceOrderInput, ValidationError> =>
  Effect.die("TODO: validate order")

