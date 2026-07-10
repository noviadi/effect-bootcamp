# 06 — Structured concurrency (60 minutes)

## Goal

Run independent effects concurrently while keeping their lifetime attached to the parent workflow. Effect fibers are lightweight, interruptible executions supervised by their scope.

- `Effect.all(effects, { concurrency })` runs a collection with controlled parallelism.
- `Effect.fork` starts a child fiber.
- `Fiber.join` waits for its success or failure.
- `Fiber.interrupt` cancels it cooperatively and waits for finalizers.
- `Effect.race` returns the first winner and interrupts the loser.

Prefer high-level combinators. Reach for raw fibers only when their lifecycle is genuinely part of your domain. Unbounded concurrency can overload downstream systems, so make the limit explicit.

## Exercise

Implement `fetchAll` with a maximum of two concurrent requests while preserving result order. Implement `winner` using a race.

## Checkpoints

1. How is a fiber different from an unmanaged Promise?
2. What happens to child fibers when the parent is interrupted?
3. Why is a concurrency limit part of correctness, not only performance?

## Official reading

- [Basic Concurrency](https://effect.website/docs/concurrency/basic-concurrency/)
- [Fibers](https://effect.website/docs/concurrency/fibers/)

