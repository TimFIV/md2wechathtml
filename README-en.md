# MD2WeChat

> 📝 Markdown → WeChat Official Account Formatting Tool

**Write Markdown, copy rich text with one click, paste directly into WeChat editor.**

![MD2WeChat Preview](./docs/screenshot.png)

[中文文档](./README.md)

---

## ✨ Features

- **Real-time Preview** — Write Markdown on the left, see rendered result on a phone mockup on the right, <200ms latency
- **10 Beautiful Themes** — From minimal to literary, from business to dark mode, switch with one click
- **One-click Copy** — Generates rich text with inline styles, paste into WeChat editor without losing formatting
- **Dark Mode Preview** — Simulate WeChat's dark mode appearance
- **Local History** — Auto-saves to IndexedDB, no server upload, privacy first
- **File Import** — Open or drag & drop .md files
- **Math & Footnotes** — LaTeX math formulas and footnote syntax support
- **Pure Frontend** — No server, no data upload, fully private

## 🚀 Live Demo

> Coming soon

## 🛠️ Local Development

### Requirements

- Node.js >= 18
- npm >= 9

### Setup

```bash
git clone https://github.com/TimFIV/md2wechat.git
cd md2wechat
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

Output is in `dist/`, ready to deploy to any static hosting.

## 🎨 Themes

| Theme | Style | Best For |
|-------|-------|----------|
| 📄 Default | Clean black on white | General articles |
| 🌸 Literary | Serif + soft pink blockquotes | Essays |
| 📖 Deep Reading | Parchment + dark green titles | Long-form content |
| 💼 Business | Deep blue + professional layout | Reports |
| ⚡ Tech Minimal | GitHub-style compact layout | Technical posts |
| 🎀 Cute Journal | Rounded fonts + cream tones | Lifestyle diaries |
| 🗞️ Magazine | High-contrast B&W + serif | Magazine-style |
| 🌌 Starry Night | Deep space blue + neon accents | Tech & sci-fi |
| 🌿 Forest | Fresh green palette | Travel & nature |
| ☀️ Warm Sunshine | Caramel amber tones | Food & lifestyle |

## 📐 Supported Markdown

**Basic**: Headings H1-H6, bold/italic/strikethrough, lists, blockquotes, links, image placeholders, code blocks, tables, horizontal rules, task lists.

**Extended**:

| Syntax | Description |
|--------|-------------|
| `$...$` | Inline math |
| `$$...$$` | Block math |
| `[^1]` | Footnotes |
| `![video](url)` | Video placeholder card |

## 🏗️ Tech Stack

| Area | Solution |
|------|----------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Markdown | markdown-it + plugins |
| Math | KaTeX |
| Code Highlighting | Shiki |
| Storage | IndexedDB (idb-keyval) |
| Clipboard | Clipboard API + execCommand fallback |

## 🤝 Contributing

Issues and PRs are welcome!

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/xxx`)
3. Commit (`git commit -m 'feat: xxx'`)
4. Push (`git push origin feature/xxx`)
5. Open a Pull Request

## 📄 License

[MIT](./LICENSE) © TimFIV
