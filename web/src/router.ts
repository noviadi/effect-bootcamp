import { pageById } from "./course"

export type Route =
  | { readonly type: "page"; readonly pageId: string }
  | { readonly type: "file"; readonly path: string }

export const pageHash = (pageId: string): string => `#/page/${encodeURIComponent(pageId)}`
export const fileHash = (path: string): string => `#/file/${encodeURIComponent(path)}`

export const parseHash = (hash: string): Route => {
  const pageMatch = /^#\/page\/([^/]+)$/.exec(hash)
  if (pageMatch?.[1]) {
    const pageId = decodeURIComponent(pageMatch[1])
    if (pageById.has(pageId)) return { type: "page", pageId }
  }
  const fileMatch = /^#\/file\/(.+)$/.exec(hash)
  if (fileMatch?.[1]) return { type: "file", path: decodeURIComponent(fileMatch[1]) }
  return { type: "page", pageId: "start" }
}
