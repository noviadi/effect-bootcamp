import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"

const webRoot = fileURLToPath(new URL(".", import.meta.url))
const repositoryRoot = fileURLToPath(new URL("..", import.meta.url))

export default defineConfig({
  root: webRoot,
  server: {
    fs: { allow: [repositoryRoot] },
  },
  build: {
    outDir: fileURLToPath(new URL("../dist", import.meta.url)),
    emptyOutDir: true,
  },
})
