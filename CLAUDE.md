# CLAUDE.md

This file provides guidance to Claude Code (code.ai/claude) when working in this repository.

## 项目概述

**MD2WeChatHtml** — 纯前端 Web 单页应用（SPA），将 Markdown 转换为微信公众号排版的富文本。核心价值：用户用 Markdown 写作 → 实时预览 → 选择主题 → 一键复制富文本，直接粘贴到微信公众平台后台即可发布。

**当前状态**：V1.0.0-beta.1 已完成开发和部署，代码量 2389 行，已上线运行。

### 线上地址

- **GitHub 仓库**：https://github.com/TimFIV/md2wechathtml
- **在线演示**：https://md2wechathtml.netlify.app

## 产品形态

- **纯前端 SPA**，无服务端交互，一切数据在浏览器本地
- 分屏布局：左侧 Markdown 编辑器（默认 40%），右侧手机模型预览（375×812）
- 10 套内置主题 + 暗黑模式适配
- 文件上传（.md）、本地历史记录（IndexedDB）、一键复制富文本

## 技术栈

| 领域 | 实际方案 |
|------|----------|
| 前端框架 | React 19 + TypeScript |
| 构建工具 | Vite 8 |
| Markdown 解析 | `markdown-it` + 插件（footnote、texmath） |
| 公式渲染 | `KaTeX` |
| 代码高亮 | `Shiki` |
| 本地存储 | IndexedDB（`idb-keyval`） |
| 复制实现 | Clipboard API + `execCommand` 降级 |
| 主题管理 | 行内 style 属性渲染 |

## 关键约束

- **所有样式必须写为行内 `style` 属性**，不允许使用 class 或 id，确保复制到微信后台后样式不丢失
- 预览更新延迟 ≤ 200ms
- 无服务端，无数据上传，纯本地处理

## 主题系统

- 10 套主题：「默认纯净」「文艺浅调」「深阅读」「商务简雅」「科技极简」「萌趣手账」「灰度杂志」「墨夜星辰」「森林日记」「暖阳笔记」
- 每套主题定义：正文字色、背景色、标题色（H1-H6）、加粗色、链接色、引用块边框/背景、代码块样式、表格边框/表头/斑马纹、分割线颜色、行高、段间距
- 「墨夜星辰」为暗黑主题，每套主题均有暗色模式变体
- 暗黑模式预览开关仅影响预览区，不改变生成 HTML（除非用户选择了暗黑主题）

## Markdown 语法支持

**P0（已实现）**：标题 H1-H6、加粗/斜体/删除线、无序/有序列表、引用块、链接、图片占位符（灰色占位框）、行内代码、代码块（语法高亮）、表格（斑马纹、自适应）、分割线、任务列表

**P1（已实现）**：数学公式（KaTeX）、脚注（锚点链接）、视频卡片（占位符）

## 项目结构

```
src/
├── main.tsx              # 入口
├── App.tsx               # 主应用（分屏布局）
├── types/index.ts        # 类型定义
├── lib/
│   ├── markdown.ts       # Markdown 解析（markdown-it + 插件）
│   └── themes.ts         # 10 套主题定义
├── hooks/
│   └── useHistory.ts     # IndexedDB 历史记录 Hook
└── components/
    ├── Editor.tsx        # Markdown 编辑器
    ├── Preview.tsx       # 预览区（手机模型）
    ├── Toolbar.tsx       # 工具栏（主题选择、暗黑模式、复制等）
    ├── HistoryPanel.tsx  # 历史记录面板
    ├── HtmlModal.tsx     # HTML 源码弹窗
    └── Toast.tsx         # 提示组件
```

## 开发命令

```bash
npm run dev        # 启动开发服务器（http://localhost:5173）
npm run build      # 构建生产版本（输出到 dist/）
npm run lint       # 代码检查
npm run preview    # 预览生产构建
```

## 里程碑

1. ~~原型阶段~~ ✅ V1.0.0-beta.1（2026/05/17）：完整功能 + 上线部署
2. V1.1（后续）：主题自定义、导出增强、更多语法

## 参考文档

- 产品需求文档：`prd.md`
