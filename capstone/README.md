# 08 — Capstone: resilient order processor (150 minutes)

Build a small order workflow that validates input, loads prices concurrently, charges a payment provider, stores the order, and sends a receipt. All external capabilities are Effect services and the application is assembled with Layers.

## Scenario

An API boundary has already decoded this request:

```ts
interface PlaceOrderInput {
  readonly customerEmail: string
  readonly items: ReadonlyArray<{ readonly sku: string; readonly quantity: number }>
}
```

Your workflow must:

1. reject an invalid email, an empty cart, or non-positive quantities;
2. request each SKU price through `Catalog`, with at most three lookups in flight;
3. calculate the total in integer cents;
4. charge through `Payments`, retrying only `PaymentUnavailable` twice;
5. persist the paid order through `Orders`;
6. send a receipt through `Email`;
7. return the stored order ID;
8. preserve typed domain failures all the way to the boundary.

## Architecture target

```text
placeOrder
   ├── Catalog ─────── price lookup (bounded concurrency)
   ├── Payments ────── charge (selective retry)
   ├── Orders ──────── persistence
   └── Email ───────── receipt
          ▲
          └── implementations supplied once with a Layer
```

## Work in checkpoints

### A. Domain and validation — 25 minutes

Open `starter/domain.ts`. Define tagged errors and implement `validate`. Do not throw. Run `npm run check` often and read the error channel inferred by the editor.

### B. Workflow and dependencies — 55 minutes

Open `starter/app.ts`. Request services inside `Effect.gen`, use `Effect.forEach` with `{ concurrency: 3 }`, calculate cents, and sequence the external actions. There must be no `runPromise` inside the workflow.

### C. Resilience — 25 minutes

Retry `PaymentUnavailable` twice. Ensure `CardDeclined` is attempted once. Keep policy beside the call site so a reader can see which operation is repeated.

### D. Tests — 35 minutes

Create deterministic test Layers. Cover the happy path, validation short-circuiting, and selective retry. Assert observable service calls, not which combinators were used.

### E. Review — 10 minutes

Compare against `solution/`. Explain the final `Effect<Success, Error, Requirements>` before the Layer is provided and after it is provided. Identify the single execution boundary.

## Run the reference implementation

```bash
npm test -- capstone
npm run lesson -- capstone/solution/main.ts
```

## Definition of done

- `npm run check` passes.
- Tests cover success and at least two failure paths.
- Expected failures are tagged values, not thrown exceptions.
- Business logic depends on service interfaces, not implementations.
- Parallelism and retry counts are bounded.
- Only the outermost `main` executes the Effect.

## Stretch goals (outside the 9-hour core)

- Give a database connection a scoped Layer using `acquireRelease`.
- Add a payment timeout and map it to a domain error.
- Decode unknown API input with Effect Schema.
- Process a stream of orders with backpressure.
- Add structured logs and spans.

Continue with the official guides for [Schema](https://effect.website/docs/schema/introduction/), [Streams](https://effect.website/docs/stream/introduction/), and [Observability](https://effect.website/docs/observability/logging/).

