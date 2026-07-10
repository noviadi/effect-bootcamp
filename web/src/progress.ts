import { coursePages, lessonPages, pageById } from "./course"

export const progressStorageKey = "effect-bootcamp:progress"

export interface LearnerProgress {
  readonly version: 1
  readonly completedLessonIds: ReadonlyArray<string>
  readonly revealedSolutionIds: ReadonlyArray<string>
  readonly lastPageId: string
}

export const initialProgress: LearnerProgress = {
  version: 1,
  completedLessonIds: [],
  revealedSolutionIds: [],
  lastPageId: "start",
}

const strings = (value: unknown): value is Array<string> =>
  Array.isArray(value) && value.every((item) => typeof item === "string")

export const parseProgress = (raw: string | null): LearnerProgress => {
  if (raw === null) return initialProgress
  try {
    const value: unknown = JSON.parse(raw)
    if (typeof value !== "object" || value === null) return initialProgress
    const candidate = value as Record<string, unknown>
    if (
      candidate.version !== 1 ||
      !strings(candidate.completedLessonIds) ||
      !strings(candidate.revealedSolutionIds) ||
      typeof candidate.lastPageId !== "string"
    ) return initialProgress

    const lessonIds = new Set(lessonPages.map((page) => page.id))
    return {
      version: 1,
      completedLessonIds: [...new Set(candidate.completedLessonIds.filter((id) => lessonIds.has(id)))],
      revealedSolutionIds: [...new Set(candidate.revealedSolutionIds.filter((id) => lessonIds.has(id)))],
      lastPageId: pageById.has(candidate.lastPageId) ? candidate.lastPageId : coursePages[0]!.id,
    }
  } catch {
    return initialProgress
  }
}

export const loadProgress = (storage: Pick<Storage, "getItem">): LearnerProgress =>
  parseProgress(storage.getItem(progressStorageKey))

export const saveProgress = (storage: Pick<Storage, "setItem">, progress: LearnerProgress): void =>
  storage.setItem(progressStorageKey, JSON.stringify(progress))
