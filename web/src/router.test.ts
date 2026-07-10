import { describe, expect, it } from "vitest"
import { fileHash, pageHash, parseHash } from "./router"

describe("course routes", () => {
  it("round-trips page and repository paths", () => {
    expect(parseHash(pageHash("03-typed-errors"))).toEqual({ type: "page", pageId: "03-typed-errors" })
    const path = "capstone/starter/domain.ts"
    expect(parseHash(fileHash(path))).toEqual({ type: "file", path })
  })

  it("falls back to the start page for unknown routes and pages", () => {
    expect(parseHash("#/page/not-a-lesson")).toEqual({ type: "page", pageId: "start" })
    expect(parseHash("#/anything-else")).toEqual({ type: "page", pageId: "start" })
  })
})
