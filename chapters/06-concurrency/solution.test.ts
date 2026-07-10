import { Effect, Ref } from "effect"
import { describe, expect, it } from "vitest"
import { fetchAll, winner } from "./solution.js"

describe("chapter 06", () => {
  it("bounds concurrency and retains order", async () => {
    const program = Effect.gen(function* () {
      const active = yield* Ref.make(0)
      const peak = yield* Ref.make(0)
      const fetchOne = (id: string) => Effect.acquireUseRelease(
        Ref.updateAndGet(active, (n) => n + 1).pipe(
          Effect.tap((n) => Ref.update(peak, (p) => Math.max(p, n)))
        ),
        () => Effect.sleep("5 millis").pipe(Effect.as(id)),
        () => Ref.update(active, (n) => n - 1)
      )
      const result = yield* fetchAll(["a", "b", "c", "d"], fetchOne)
      return { result, peak: yield* Ref.get(peak) }
    })
    expect(await Effect.runPromise(program)).toEqual({ result: ["a", "b", "c", "d"], peak: 2 })
  })

  it("races", async () => {
    const result = await Effect.runPromise(winner(
      Effect.sleep("20 millis").pipe(Effect.as("slow")),
      Effect.succeed("fast")
    ))
    expect(result).toBe("fast")
  })
})

