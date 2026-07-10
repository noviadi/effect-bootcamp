# 04 — Services and Layers (75 minutes)

## Goal

Make dependencies visible in `R`, then satisfy them at the edge. A service describes capabilities; a Layer describes how to construct one or more services, including their own dependencies and startup failures.

```text
business workflow ──requires──> Repository + Clock
                                  ▲
                                  │ provided by
                             application Layer
```

`Context.Tag` identifies a service. Yielding the tag inside `Effect.gen` requests its implementation. `Effect.provideService` is useful for one value; `Effect.provide(layer)` is the normal composition boundary for a dependency graph.

Keep interfaces small and behavior-focused. A service method returns Effect values, so its typed failures remain explicit. Avoid importing a concrete client into business logic: doing so hides the requirement and makes tests harder.

## Exercise

Implement `welcomeUser` using `UserRepository` and `Emailer`, without accepting either as a function argument. Then create a test Layer using the supplied constructors.

## Checkpoints

1. What does a non-`never` `R` tell a caller?
2. How is a Layer different from a service object?
3. Where should the final application Layer be provided?

## Official reading

- [Managing Services](https://effect.website/docs/requirements-management/services/)
- [Managing Layers](https://effect.website/docs/requirements-management/layers/)
- [Layer Memoization](https://effect.website/docs/requirements-management/layer-memoization/)

