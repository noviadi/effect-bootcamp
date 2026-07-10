import { Effect } from "effect"
import type { PlaceOrderInput, ValidationError } from "./domain.js"
import type {
  CardDeclined, Catalog, Email, Orders, Payments, PaymentUnavailable, PersistenceError, UnknownSku
} from "./services.js"

export type PlaceOrderError = ValidationError | UnknownSku | PaymentUnavailable | CardDeclined | PersistenceError
export type PlaceOrderRequirements = Catalog | Payments | Orders | Email

// TODO: implement the workflow described in ../README.md.
export const placeOrder = (
  _input: PlaceOrderInput
): Effect.Effect<string, PlaceOrderError, PlaceOrderRequirements> =>
  Effect.die("TODO: place order")

