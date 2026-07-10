const contentModules = import.meta.glob(
  [
    "../../README.md",
    "../../COURSE_MAP.md",
    "../../chapters/**/*.md",
    "../../chapters/**/*.ts",
    "../../capstone/**/*.md",
    "../../capstone/**/*.ts",
  ],
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>

export const contentByPath = Object.fromEntries(
  Object.entries(contentModules).map(([path, content]) => [path.replace(/^\.\.\/\.\.\//, ""), content]),
) as Readonly<Record<string, string>>

export const getContent = (path: string): string => {
  const content = contentByPath[path]
  if (content === undefined) throw new Error(`Course manifest references a missing file: ${path}`)
  return content
}
