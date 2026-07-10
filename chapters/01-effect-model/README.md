# 01 — The Effect model (60 minutes)

## Goal

Learn to read an Effect value as a lazy description: `Effect<Success, Error, Requirements>`. Nothing happens until a runtime executes it.

```text
Effect<A, E, R>
       │  │  └─ services the workflow needs
       │  └──── expected failure values
       └─────── success value
```

Unlike `Promise<A>`, the type records expected errors and dependencies. Effect also uses one abstraction for synchronous and asynchronous work.

## Core constructors

- `Effect.succeed(value)` describes immediate success.
- `Effect.fail(error)` describes an expected failure.
- `Effect.sync(thunk)` defers synchronous work that cannot fail.
- `Effect.try({ try, catch })` catches throwing synchronous code.
- `Effect.promise(thunk)` defers a Promise that is known not to reject.
- `Effect.tryPromise({ try, catch })` translates Promise rejection into a typed error.

Constructors take thunks where work must remain lazy. `Effect.sync(Math.random())` is invalid because the work has already happened; use `Effect.sync(() => Math.random())`.

## Run

```bash
npm run lesson -- chapters/01-effect-model/example.ts
```

Then implement `parsePort` and `loadUser` in `exercise.ts`. Check the inferred `A`, `E`, and `R` at each step in your editor.

## Checkpoints

1. Why is constructing an Effect different from running it?
2. When should rejected Promises use `tryPromise` rather than `promise`?
3. Why should `runPromise` usually appear only at an application boundary?

## Official reading

- [The Effect Type](https://effect.website/docs/getting-started/the-effect-type/)
- [Creating Effects](https://effect.website/docs/getting-started/creating-effects/)
- [Running Effects](https://effect.website/docs/getting-started/running-effects/)

