# Instructor course map

This is a one-day workshop or a self-paced course. For a live cohort, use the first 10 minutes of each chapter to discuss its mental model, spend most of the time pairing on the exercise, and close with the checkpoints.

## Learning outcomes

By the end, learners can:

- read `Effect<Success, Error, Requirements>` as an executable specification;
- wrap synchronous and Promise-based code without losing failure information;
- compose workflows with `pipe` and `Effect.gen`;
- model expected failures as tagged values and recover selectively;
- express dependencies as services and assemble implementations with Layers;
- guarantee cleanup with scoped acquisition and release;
- use fibers and bounded concurrency without leaking work;
- test success, failure, dependencies, and time without real delays;
- structure a small production-style Effect application.

## Scope decisions

The course intentionally omits Streams, Schema, STM, caching, batching, platform packages, and observability. They matter, but including them would trade depth in the fundamental mental model for API breadth. The final README points learners toward those next steps.

## Suggested schedule

Run chapters 01–04 before lunch (4 hours including a short break), chapters 05–07 after lunch (3 hours), and reserve 2 hours for the capstone plus a final retrospective. The capstone has checkpoints so a class can stop after the core workflow if time is tight.
