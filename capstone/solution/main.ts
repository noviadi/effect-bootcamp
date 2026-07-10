import { Console, Effect, Layer } from "effect"
import { placeOrder } from "./app.js"
import { Catalog, Email, Orders, Payments } from "./services.js"

const Live = Layer.mergeAll(
  Layer.succeed(Catalog, { price: (sku) => Effect.succeed(sku === "book" ? 1500 : 200) }),
  Layer.succeed(Payments, { charge: (_email, _cents) => Effect.succeed("payment-demo") }),
  Layer.succeed(Orders, { save: (_paymentId, _cents) => Effect.succeed("order-demo") }),
  Layer.succeed(Email, { receipt: (to, orderId, cents) => Console.log(`Receipt ${orderId} -> ${to}: ${cents} cents`) })
)

const main = placeOrder({
  customerEmail: "learner@example.com",
  items: [{ sku: "book", quantity: 1 }, { sku: "pen", quantity: 2 }]
}).pipe(
  Effect.tap((orderId) => Console.log(`Placed ${orderId}`)),
  Effect.provide(Live)
)

Effect.runPromise(main).catch((cause) => {
  console.error(cause)
  process.exitCode = 1
})
