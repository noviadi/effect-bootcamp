# Effect Fundamentals Bootcamp

A hands-on, 8–10 hour course for TypeScript engineers who want to build reliable applications with Effect. The course teaches a small, practical core of Effect and ends with a testable order-processing capstone.

## Start here

Requirements: Node.js 20+ and npm. The official Effect docs require TypeScript 5.4 or newer; this repository uses strict TypeScript.

```bash
npm install
npm run check
npm test
```

## Use the local course reader

Start the course website from the repository root:

```bash
npm run course
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The reader provides ordered lesson navigation, progress tracking, solution reveals, and read-only previews of the course files. Use the copy-path actions to open exercises in your preferred IDE; exercises are not edited or executed in the browser.

To verify and preview the production build locally:

```bash
npm run course:build
npm run course:preview
```

Work through the chapters in order. In each chapter:

1. Read `README.md`.
2. Run the example with `npm run lesson -- <path-to-example>`.
3. Replace every `TODO` in `exercise.ts` without opening `solution.ts`.
4. Run the chapter test, for example `npm test -- chapters/01-effect-model`.
5. Compare your implementation with `solution.ts` and answer the checkpoint questions.

## Curriculum (about 9 hours)

| Chapter | Topic | Time |
| --- | --- | ---: |
| 01 | The Effect model: success, error, requirements, laziness | 60 min |
| 02 | Composition with pipelines and generators | 60 min |
| 03 | Typed errors, recovery, retry, and timeout | 75 min |
| 04 | Services and Layers | 75 min |
| 05 | Resource safety and Scope | 60 min |
| 06 | Fibers and structured concurrency | 60 min |
| 07 | Testing Effect programs | 60 min |
| 08 | Capstone: resilient order processor | 150 min |
| | **Total** | **9 hours** |

The curriculum follows the official documentation's progression from the Effect type and constructors through errors, requirements, resource safety, concurrency, and testing. Each lesson links to its primary documentation pages.

## Repository conventions

- `example.ts` is an executable guided example.
- `exercise.ts` is starter code and intentionally compiles before completion.
- `solution.ts` is one idiomatic answer, not the only valid answer.
- `*.test.ts` specifies observable behavior and doubles as a progress check.
- Effects are constructed in modules and executed only at application boundaries.

## Official references

- [Effect documentation](https://effect.website/docs/)
- [Installation](https://effect.website/docs/getting-started/installation/)
- [Effect API reference](https://effect.website/docs/additional-resources/api-reference/)
