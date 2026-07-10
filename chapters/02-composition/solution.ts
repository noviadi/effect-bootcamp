import { Effect, pipe } from "effect"
import { InvalidQuantity, type CheckoutError, type FindPrice } from "./exercise.js"

const validateQuantity = (quantity: number): Effect.Effect<number, InvalidQuantity> =>
  quantity > 0 ? Effect.succeed(quantity) : Effect.fail(new InvalidQuantity(quantity))

export const subtotal = (
  sku: string,
  quantity: number,
  findPrice: FindPrice
): Effect.Effect<number, CheckoutError> =>
  pipe(
    validateQuantity(quantity),
    Effect.flatMap((validQuantity) =>
      pipe(findPrice(sku), Effect.map((price) => price * validQuantity))
    )
  )

export const subtotalGen = (sku: string, quantity: number, findPrice: FindPrice) =>
  Effect.gen(function* () {
    const validQuantity = yield* validateQuantity(quantity)
    const price = yield* findPrice(sku)
    return price * validQuantity
  })
