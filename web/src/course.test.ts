import { describe, expect, it } from "vitest"
import { contentByPath } from "./content"
import { coursePages, lessonPages } from "./course"

describe("course manifest", () => {
  it("contains the guides and all eight ordered lessons", () => {
    expect(coursePages.map((page) => page.id)).toEqual([
      "start",
      "overview",
      "01-effect-model",
      "02-composition",
      "03-typed-errors",
      "04-services-layers",
      "05-resource-safety",
      "06-concurrency",
      "07-testing",
      "08-capstone",
    ])
    expect(lessonPages).toHaveLength(8)
  })

  it("references existing content and classifies every solution as a spoiler", () => {
    for (const page of coursePages) {
      expect(contentByPath[page.markdownPath], page.markdownPath).toBeTypeOf("string")
      for (const group of page.resourceGroups) {
        for (const resource of group.resources) {
          expect(contentByPath[resource.path], resource.path).toBeTypeOf("string")
          if (resource.kind === "solution") expect(resource.spoiler).toBe(true)
        }
      }
    }
  })
})
