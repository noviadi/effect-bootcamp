import DOMPurify from "dompurify"
import hljs from "highlight.js/lib/core"
import bash from "highlight.js/lib/languages/bash"
import typescript from "highlight.js/lib/languages/typescript"
import { marked } from "marked"
import { coursePages, findPageForResource, lessonPages, pageById, type CoursePage } from "./course"
import { getContent } from "./content"
import { fileHash, pageHash, parseHash } from "./router"
import { loadProgress, saveProgress, type LearnerProgress } from "./progress"
import "./styles.css"

hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("bash", bash)
hljs.registerLanguage("shell", bash)

const app = document.querySelector<HTMLDivElement>("#app")
if (!app) throw new Error("Missing #app element")

let progress = loadProgress(localStorage)

const escapeHtml = (value: string): string =>
  value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]!)

const persist = (next: LearnerProgress): void => {
  progress = next
  saveProgress(localStorage, progress)
}

const shell = (): void => {
  app.innerHTML = `
    <header class="mobile-header">
      <button class="icon-button" data-action="toggle-menu" aria-label="Open course navigation">☰</button>
      <a class="mobile-brand" href="${pageHash("start")}">Effect Bootcamp</a>
    </header>
    <div class="app-shell">
      <nav class="sidebar" aria-label="Course navigation">
        <div class="brand">
          <span class="brand-mark">E_</span>
          <span>Effect<br />Bootcamp</span>
        </div>
        <div class="progress-summary"></div>
        <div class="course-navigation"></div>
      </nav>
      <div class="backdrop" data-action="close-menu"></div>
      <main class="main-content" tabindex="-1"></main>
      <aside class="page-outline" aria-label="On this page"></aside>
    </div>
    <div class="toast" role="status" aria-live="polite"></div>
  `
}

const renderNavigation = (activePageId: string): void => {
  const completed = new Set(progress.completedLessonIds)
  const percentage = Math.round((completed.size / lessonPages.length) * 100)
  const summary = document.querySelector<HTMLDivElement>(".progress-summary")!
  summary.innerHTML = `
    <div class="progress-label"><span>Course progress</span><strong>${completed.size}/${lessonPages.length}</strong></div>
    <div class="progress-track" aria-label="${percentage}% complete"><span style="width: ${percentage}%"></span></div>
  `

  const navigation = document.querySelector<HTMLDivElement>(".course-navigation")!
  navigation.innerHTML = coursePages.map((page, index) => {
    const isComplete = completed.has(page.id)
    const state = page.kind === "lesson" ? `<span class="nav-state" aria-label="${isComplete ? "Completed" : "Not completed"}">${isComplete ? "✓" : ""}</span>` : ""
    const sectionLabel = index === 0 ? `<p class="nav-section">Course</p>` : index === 2 ? `<p class="nav-section">Lessons</p>` : ""
    return `${sectionLabel}<a class="nav-link ${activePageId === page.id ? "active" : ""}" href="${pageHash(page.id)}">
      <span class="nav-number">${escapeHtml(page.shortLabel)}</span>
      <span class="nav-title">${escapeHtml(page.title)}</span>${state}
    </a>`
  }).join("")
}

const slugHeadings = (container: HTMLElement): Array<{ id: string; text: string; level: number }> => {
  const used = new Map<string, number>()
  return [...container.querySelectorAll<HTMLHeadingElement>("h2, h3")].map((heading) => {
    const base = (heading.textContent ?? "section").toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") || "section"
    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count + 1}`
    heading.id = id
    return { id, text: heading.textContent ?? "Section", level: Number(heading.tagName[1]) }
  })
}

const enhanceMarkdown = (container: HTMLElement): void => {
  container.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    if (/^https?:\/\//.test(link.getAttribute("href") ?? "")) {
      link.target = "_blank"
      link.rel = "noopener noreferrer"
    }
  })
  container.querySelectorAll<HTMLElement>("pre code").forEach((block) => hljs.highlightElement(block))
  const headings = slugHeadings(container)
  const outline = document.querySelector<HTMLElement>(".page-outline")!
  outline.innerHTML = headings.length === 0 ? "" : `
    <p class="outline-title">On this page</p>
    ${headings.map((heading) => `<button class="outline-link level-${heading.level}" data-action="heading" data-heading="${heading.id}">${escapeHtml(heading.text)}</button>`).join("")}
  `
}

const resourcePanel = (page: CoursePage): string => {
  if (page.resourceGroups.length === 0) return ""
  const isRevealed = progress.revealedSolutionIds.includes(page.id)
  const groups = page.resourceGroups.map((group) => {
    if (group.spoiler && !isRevealed) return `
      <div class="resource-group spoiler-lock">
        <div><strong>Solutions hidden</strong><p>Reveal these only when you are ready to compare approaches.</p></div>
        <button class="secondary-button" data-action="reveal-solutions" data-page-id="${page.id}">Reveal solutions</button>
      </div>`
    return `<div class="resource-group">
      <div class="resource-heading"><h3>${escapeHtml(group.label)}</h3>${group.spoiler ? `<button class="text-button" data-action="hide-solutions" data-page-id="${page.id}">Hide again</button>` : ""}</div>
      <div class="resource-list">${group.resources.map((resource) => `
        <a class="resource-card" href="${fileHash(resource.path)}">
          <span class="file-icon">TS</span><span><strong>${escapeHtml(resource.label)}</strong><small>${escapeHtml(resource.path)}</small></span><span aria-hidden="true">→</span>
        </a>`).join("")}</div>
    </div>`
  }).join("")
  return `<section class="resources" aria-labelledby="lesson-files"><h2 id="lesson-files">Lesson files</h2>${groups}</section>`
}

const pager = (page: CoursePage): string => {
  const index = coursePages.findIndex((candidate) => candidate.id === page.id)
  const previous = coursePages[index - 1]
  const next = coursePages[index + 1]
  return `<nav class="pager" aria-label="Page navigation">
    ${previous ? `<a href="${pageHash(previous.id)}"><small>Previous</small><strong>← ${escapeHtml(previous.title)}</strong></a>` : "<span></span>"}
    ${next ? `<a class="next" href="${pageHash(next.id)}"><small>Next</small><strong>${escapeHtml(next.title)} →</strong></a>` : "<span></span>"}
  </nav>`
}

const renderPage = (page: CoursePage): void => {
  // Keep the last substantive destination when the learner returns to Start,
  // so the resume card can still take them back to their work.
  if (page.id !== "start" && progress.lastPageId !== page.id) persist({ ...progress, lastPageId: page.id })
  renderNavigation(page.id)
  const main = document.querySelector<HTMLElement>(".main-content")!
  const markdown = marked.parse(getContent(page.markdownPath), { async: false }) as string
  const cleanMarkdown = DOMPurify.sanitize(markdown)
  const completed = progress.completedLessonIds.includes(page.id)
  const resume = page.id === "start" && progress.lastPageId !== "start"
    ? `<a class="resume-card" href="${pageHash(progress.lastPageId)}"><span>Continue where you left off</span><strong>${escapeHtml(pageById.get(progress.lastPageId)?.title ?? "Course")}</strong></a>`
    : ""
  main.innerHTML = `
    <article class="content-page">
      ${resume}
      <div class="page-kicker">${page.kind === "lesson" ? `Lesson ${escapeHtml(page.shortLabel)} · ${escapeHtml(page.duration ?? "")}` : "Course guide"}</div>
      <div class="markdown-body">${cleanMarkdown}</div>
      ${page.command ? `<div class="command-card"><span><small>Progress check</small><code>${escapeHtml(page.command)}</code></span><button data-action="copy" data-copy="${escapeHtml(page.command)}">Copy command</button></div>` : ""}
      ${resourcePanel(page)}
      ${page.kind === "lesson" ? `<label class="completion-control"><input type="checkbox" data-action="complete" data-page-id="${page.id}" ${completed ? "checked" : ""} /><span><strong>Mark lesson complete</strong><small>Saved locally in this browser</small></span></label>` : ""}
      ${pager(page)}
    </article>`
  enhanceMarkdown(main.querySelector<HTMLElement>(".markdown-body")!)
  main.focus({ preventScroll: true })
  window.scrollTo(0, 0)
}

const renderFile = (path: string): void => {
  const owner = findPageForResource(path)
  const resource = owner?.resourceGroups.flatMap((group) => group.resources).find((item) => item.path === path)
  if (!owner || !resource) {
    location.hash = pageHash("start")
    return
  }
  if (resource.spoiler && !progress.revealedSolutionIds.includes(owner.id)) {
    location.hash = pageHash(owner.id)
    return
  }
  renderNavigation(owner.id)
  document.querySelector<HTMLElement>(".page-outline")!.innerHTML = ""
  const main = document.querySelector<HTMLElement>(".main-content")!
  const highlighted = hljs.highlight(getContent(path), { language: "typescript" }).value
  main.innerHTML = `<article class="source-page">
    <a class="back-link" href="${pageHash(owner.id)}">← Back to ${escapeHtml(owner.title)}</a>
    <div class="source-header"><div><span class="page-kicker">Read-only source</span><h1>${escapeHtml(resource.label)}</h1><code class="source-path">${escapeHtml(path)}</code></div>
      <button class="primary-button" data-action="copy" data-copy="${escapeHtml(path)}">Copy path</button>
    </div>
    <p class="source-note">Open this repository-relative path in your preferred IDE to make changes.</p>
    <pre class="source-code"><code class="hljs language-typescript">${highlighted}</code></pre>
  </article>`
  main.focus({ preventScroll: true })
  window.scrollTo(0, 0)
}

const closeMenu = (): void => document.body.classList.remove("menu-open")

const render = (): void => {
  closeMenu()
  const route = parseHash(location.hash)
  if (route.type === "page") renderPage(pageById.get(route.pageId) ?? coursePages[0]!)
  else renderFile(route.path)
}

let toastTimer: number | undefined
const showToast = (message: string): void => {
  const toast = document.querySelector<HTMLDivElement>(".toast")!
  toast.textContent = message
  toast.classList.add("visible")
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2200)
}

const copyText = async (value: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(value)
    showToast("Copied to clipboard")
  } catch {
    showToast("Copy unavailable — select the visible text instead")
  }
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]")
  if (!target) return
  const action = target.dataset.action
  if (action === "toggle-menu") document.body.classList.toggle("menu-open")
  if (action === "close-menu") closeMenu()
  if (action === "heading") document.getElementById(target.dataset.heading ?? "")?.scrollIntoView()
  if (action === "copy") void copyText(target.dataset.copy ?? "")
  if (action === "reveal-solutions") {
    const pageId = target.dataset.pageId
    if (pageId && window.confirm("Reveal the reference solution files for this lesson?")) {
      persist({ ...progress, revealedSolutionIds: [...new Set([...progress.revealedSolutionIds, pageId])] })
      render()
    }
  }
  if (action === "hide-solutions") {
    const pageId = target.dataset.pageId
    persist({ ...progress, revealedSolutionIds: progress.revealedSolutionIds.filter((id) => id !== pageId) })
    render()
  }
})

app.addEventListener("change", (event) => {
  const input = (event.target as HTMLElement).closest<HTMLInputElement>('input[data-action="complete"]')
  if (!input?.dataset.pageId) return
  const completed = new Set(progress.completedLessonIds)
  if (input.checked) completed.add(input.dataset.pageId)
  else completed.delete(input.dataset.pageId)
  persist({ ...progress, completedLessonIds: [...completed] })
  render()
})

window.addEventListener("hashchange", render)
shell()
render()
