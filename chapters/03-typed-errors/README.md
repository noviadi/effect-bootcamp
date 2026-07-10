# 03 — Typed errors and resilience (75 minutes)

## Goal

Separate expected operational failures from defects. Expected failures belong in `E`; bugs and broken invariants are defects in the `Cause` and are not silently caught by ordinary error handlers.

Use tagged error classes so handlers can be exhaustive and selective:

```ts
class NotFound extends Data.TaggedError("NotFound")<{ id: string }> {}
```

- `catchTag` handles one tagged error and removes it from `E`.
- `catchTags` handles several tagged errors.
- `mapError` changes the error value without recovering.
- `orElse` provides a fallback Effect.
- `retry(schedule)` repeats failures according to a value describing policy.
- `timeout` bounds how long a workflow may run.
- `Effect.exit` exposes success or complete failure as data at a boundary.

Avoid `catchAll(() => succeed(default))` unless every expected error truly has the same recovery. Selective recovery preserves domain meaning.

## Exercise

Build `getProfile`: retry transient transport errors twice, do not retry `NotFound`, and recover `NotFound` to a guest profile. Hint: use `retry` with a `Schedule` that checks the error type, then `catchTag`.

## Checkpoints

1. Which failures should be modeled in `E`, and which are defects?
2. Why should retries be limited and selective?
3. How does catching a tagged error change the inferred error type?

## Official reading

- [Two Types of Errors](https://effect.website/docs/error-management/two-error-types/)
- [Expected Errors](https://effect.website/docs/error-management/expected-errors/)
- [Retrying](https://effect.website/docs/error-management/retrying/)
- [Timing Out](https://effect.website/docs/error-management/timing-out/)

