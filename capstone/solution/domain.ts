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

export const validate = (input: PlaceOrderInput): Effect.Effect<PlaceOrderInput, ValidationError> =>
  Effect.gen(function* () {
    if (!/^\S+@\S+\.\S+$/.test(input.customerEmail)) {
      return yield* Effect.fail(new InvalidEmail({ value: input.customerEmail }))
    }
    if (input.items.length === 0) return yield* Effect.fail(new EmptyCart({}))
    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return yield* Effect.fail(new InvalidQuantity(item))
      }
    }
    return input
  })

