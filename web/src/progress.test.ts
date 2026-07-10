import { describe, expect, it } from "vitest"
import { initialProgress, loadProgress, parseProgress, progressStorageKey, saveProgress } from "./progress"

describe("learner progress", () => {
  it("falls back safely for missing, malformed, and unsupported state", () => {
    expect(parseProgress(null)).toEqual(initialProgress)
    expect(parseProgress("not json")).toEqual(initialProgress)
    expect(parseProgress(JSON.stringify({ version: 2 }))).toEqual(initialProgress)
  })

  it("removes unknown and duplicate identifiers", () => {
    const parsed = parseProgress(JSON.stringify({
      version: 1,
      completedLessonIds: ["01-effect-model", "unknown", "01-effect-model"],
      revealedSolutionIds: ["02-composition", "unknown"],
      lastPageId: "missing",
    }))
    expect(parsed).toEqual({
      version: 1,
      completedLessonIds: ["01-effect-model"],
      revealedSolutionIds: ["02-composition"],
      lastPageId: "start",
    })
  })

  it("loads and saves through the supplied storage interface", () => {
    const entries = new Map<string, string>()
    const storage = {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => entries.set(key, value),
    }
    const next = { ...initialProgress, completedLessonIds: ["01-effect-model"] }
    saveProgress(storage, next)
    expect(entries.has(progressStorageKey)).toBe(true)
    expect(loadProgress(storage)).toEqual(next)
  })
})
