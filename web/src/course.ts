import { getContent } from "./content"

export type PageKind = "guide" | "lesson"
export type ResourceKind = "example" | "exercise" | "starter" | "solution"

export interface CourseResource {
  readonly label: string
  readonly path: string
  readonly kind: ResourceKind
  readonly spoiler?: boolean
}

export interface ResourceGroup {
  readonly label: string
  readonly resources: ReadonlyArray<CourseResource>
  readonly spoiler?: boolean
}

export interface CoursePage {
  readonly id: string
  readonly shortLabel: string
  readonly title: string
  readonly kind: PageKind
  readonly duration?: string
  readonly markdownPath: string
  readonly command?: string
  readonly resourceGroups: ReadonlyArray<ResourceGroup>
}

const chapter = (
  number: string,
  slug: string,
  title: string,
  duration: string,
  hasSolution = true,
): CoursePage => {
  const root = `chapters/${number}-${slug}`
  const solutions: Array<CourseResource> = [
    ...(hasSolution ? [{ label: "Reference solution", path: `${root}/solution.ts`, kind: "solution" as const, spoiler: true }] : []),
    { label: "Reference tests", path: `${root}/solution.test.ts`, kind: "solution", spoiler: true },
  ]
  return {
    id: `${number}-${slug}`,
    shortLabel: number,
    title,
    kind: "lesson",
    duration,
    markdownPath: `${root}/README.md`,
    command: `npm test -- ${root}`,
    resourceGroups: [
      {
        label: "Lesson files",
        resources: [
          { label: "Guided example", path: `${root}/example.ts`, kind: "example" },
          { label: "Exercise", path: `${root}/exercise.ts`, kind: "exercise" },
        ],
      },
      { label: "Solutions", spoiler: true, resources: solutions },
    ],
  }
}

export const coursePages: ReadonlyArray<CoursePage> = [
  { id: "start", shortLabel: "Start", title: "Start here", kind: "guide", markdownPath: "README.md", resourceGroups: [] },
  { id: "overview", shortLabel: "Map", title: "Course overview", kind: "guide", markdownPath: "COURSE_MAP.md", resourceGroups: [] },
  chapter("01", "effect-model", "The Effect model", "60 min"),
  chapter("02", "composition", "Composition", "60 min"),
  chapter("03", "typed-errors", "Typed errors and resilience", "75 min"),
  chapter("04", "services-layers", "Services and Layers", "75 min"),
  chapter("05", "resource-safety", "Resource safety", "60 min"),
  chapter("06", "concurrency", "Structured concurrency", "60 min"),
  chapter("07", "testing", "Testing Effect programs", "60 min", false),
  {
    id: "08-capstone",
    shortLabel: "08",
    title: "Capstone: resilient order processor",
    kind: "lesson",
    duration: "150 min",
    markdownPath: "capstone/README.md",
    command: "npm test -- capstone",
    resourceGroups: [
      {
        label: "Starter files",
        resources: ["domain.ts", "services.ts", "app.ts"].map((file) => ({
          label: file,
          path: `capstone/starter/${file}`,
          kind: "starter" as const,
        })),
      },
      {
        label: "Solutions",
        spoiler: true,
        resources: ["domain.ts", "services.ts", "layers.ts", "app.ts", "app.test.ts", "main.ts"].map((file) => ({
          label: file,
          path: `capstone/solution/${file}`,
          kind: "solution" as const,
          spoiler: true,
        })),
      },
    ],
  },
]

export const lessonPages = coursePages.filter((page) => page.kind === "lesson")

export const pageById = new Map(coursePages.map((page) => [page.id, page]))

export const findPageForResource = (path: string): CoursePage | undefined =>
  coursePages.find((page) => page.resourceGroups.some((group) => group.resources.some((resource) => resource.path === path)))

const validateManifest = (): void => {
  const ids = new Set<string>()
  for (const page of coursePages) {
    if (ids.has(page.id)) throw new Error(`Duplicate course page id: ${page.id}`)
    ids.add(page.id)
    getContent(page.markdownPath)
    for (const group of page.resourceGroups) {
      for (const resource of group.resources) getContent(resource.path)
    }
  }
}

validateManifest()
