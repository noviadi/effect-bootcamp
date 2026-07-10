# 07 — Testing Effect programs (60 minutes)

## Goal

Test descriptions, not internal combinator choices. Provide deterministic service Layers, execute with `runPromise`, and inspect `Exit` when failure is the expected result.

Effect's `TestContext` Layer includes a virtual `TestClock`. Effects using `sleep`, retry delays, or timeout can be tested instantly by providing that Layer, forking the workflow, and advancing time with `TestClock.adjust`. This avoids slow and flaky wall-clock tests.

Useful boundaries:

- success: run the fully provided Effect and assert its value;
- expected failure: run `Effect.exit(program)` and inspect the `Exit`/`Cause`;
- dependency interaction: use an in-memory service whose state is a `Ref`;
- time: fork, adjust `TestClock`, join;
- cleanup: record acquisition and release events.

## Exercise

Complete the tests in `exercise.ts`: test a typed failure and a one-hour reminder without waiting. The solution demonstrates `Effect.flip` for a simple expected-error assertion and `TestClock` for virtual time.

## Checkpoints

1. Why test through service boundaries instead of mocking Effect combinators?
2. When is `Effect.flip` simpler than inspecting an `Exit`?
3. Why must a sleeping workflow be forked before advancing the test clock?

## Official reading

- [TestClock](https://effect.website/docs/testing/testclock/)
- [Exit](https://effect.website/docs/data-types/exit/)
- [Cause](https://effect.website/docs/data-types/cause/)
