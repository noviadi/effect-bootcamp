# 05 — Resource safety (60 minutes)

## Goal

Guarantee release when use succeeds, fails, or is interrupted. `Effect.acquireRelease(acquire, release)` creates a scoped resource; the type includes `Scope` until the workflow is enclosed by `Effect.scoped` or supplied by a Layer.

```text
acquire ──> use ──> release
              │
              ├─ success      release still runs
              ├─ failure      release still runs
              └─ interruption release still runs
```

The release action is uninterruptible by default. Use `acquireUseRelease` for a local resource lifecycle and `acquireRelease` when several operations share the resource within a Scope.

## Exercise

Implement `withConnection`, recording `open`, `query`, and `close`. Prove with the test that `close` occurs after both success and failure.

## Checkpoints

1. Why is `try/finally` insufficient once work is concurrent and interruptible?
2. What does `Scope` in `R` mean?
3. Should release failure replace use failure? Inspect `Cause` to explore the answer.

## Official reading

- [Resource Management](https://effect.website/docs/resource-management/introduction/)
- [Scope](https://effect.website/docs/resource-management/scope/)

