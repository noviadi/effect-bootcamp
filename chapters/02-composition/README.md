# 02 — Composition (60 minutes)

## Goal

Build larger workflows without manually inspecting success or failure. Effect combinators preserve and combine the three channels in the type.

Use pipelines for linear transformations:

```ts
effect.pipe(
  Effect.map(transformSuccess),
  Effect.flatMap(nextEffect)
)
```

Use `Effect.gen` when later steps need names, branching, or several intermediate values. Inside a generator, `yield* effect` unwraps success, short-circuits on failure, and accumulates requirements.

Key distinction: `map` callback returns a plain value; `flatMap` callback returns another Effect. `Effect.all` combines independent effects and returns their results in the same structure.

## Exercise

Implement a checkout subtotal pipeline in `exercise.ts`. First use `pipe`, then rewrite it with `Effect.gen`. Invalid quantities must short-circuit before the price lookup.

```bash
npm run lesson -- chapters/02-composition/example.ts
npm test -- chapters/02-composition
```

## Checkpoints

1. What creates `Effect<Effect<A>>`, and how does `flatMap` prevent it?
2. What happens to downstream steps after an upstream failure?
3. When is `Effect.all` clearer than a generator?

## Official reading

- [Building Pipelines](https://effect.website/docs/getting-started/building-pipelines/)
- [Using Generators](https://effect.website/docs/getting-started/using-generators/)
- [Control Flow Operators](https://effect.website/docs/getting-started/control-flow/)

