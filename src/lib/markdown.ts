import MarkdownIt from 'markdown-it';
import markdownItFootnote from 'markdown-it-footnote';
import type { Theme } from '../types';

// 配置 markdown-it
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})
  .use(markdownItFootnote);

// 图片渲染规则 — 拦截图片，处理 video 和普通图片占位
md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx];
  const alt = token.children
    ? token.children.map((c) => c.content).join('').trim()
    : '';
  const src = token.attrGet('src') || '';

  if (alt.toLowerCase() === 'video') {
    return `<div data-placeholder="video" data-src="${escAttr(src)}">📹 视频占位符<br/><span>请在公众号后台替换视频<br/>${escHtml(src)}</span></div>`;
  }

  return `<div data-placeholder="image">${escHtml(alt) || escHtml(src) || '图片占位'}<br/><span>请在公众号后台替换图片</span></div>`;
};

// 脚注容器样式
const originalFootnoteBlockOpen =
  md.renderer.rules.footnote_block_open ||
  function () {
    return '<hr><section class="footnotes"><ol>';
  };
md.renderer.rules.footnote_block_open = function (...args) {
  const html = originalFootnoteBlockOpen(...args);
  return html.replace('<hr>', '<hr>');
};

// 行内 LaTeX
md.inline.ruler.after('escape', 'inline_math', (state) => {
  const start = state.pos;
  if (state.src[start] !== '$') return false;
  const next = state.src[start + 1];
  if (next === '$' || next === ' ' || next === undefined) return false;

  const end = state.src.indexOf('$', start + 1);
  if (end === -1 || end === start + 1) return false;

  const token = state.push('inline_math', '', 0);
  token.content = state.src.slice(start + 1, end);
  state.pos = end + 1;
  return true;
});

md.renderer.rules.inline_math = (tokens, idx) => {
  const content = tokens[idx].content;
  return `<span data-latex="${escAttr(content)}">∑ ${escHtml(content)}</span>`;
};

// 块级 LaTeX
md.block.ruler.after('fence', 'display_math', (state, startLine, endLine) => {
  const start = state.bMarks[startLine] + state.tShift[startLine];
  const marker = state.src.slice(start, start + 2);
  if (marker !== '$$') return false;

  let nextLine = startLine + 1;
  let found = false;
  while (nextLine < endLine) {
    const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
    if (state.src.slice(lineStart, lineStart + 2) === '$$') {
      found = true;
      break;
    }
    nextLine++;
  }
  if (!found) return false;

  const token = state.push('display_math', '', 0);
  token.content = state.getLines(startLine + 1, nextLine, 0, false);
  token.map = [startLine, nextLine + 1];
  state.line = nextLine + 1;
  return true;
});

md.renderer.rules.display_math = (tokens, idx) => {
  const content = tokens[idx].content;
  return `<div data-latex="${escAttr(content)}">∑∑ ${escHtml(content)}</div>`;
};

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escAttr(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function renderMarkdown(source: string): string {
  return md.render(source);
}

export function applyInlineStyles(html: string, theme: Theme): string {
  const { colors, style } = theme;
  const container = document.createElement('div');
  container.innerHTML = html;

  const apply = (el: HTMLElement) => {
    const tag = el.tagName.toLowerCase();
    const s = el.style;

    // 基础文字样式
    s.color = colors.text;
    s.lineHeight = String(style.lineHeight);
    s.fontSize = style.fontSize;
    s.fontFamily = style.fontFamily;
    s.wordBreak = 'break-word';
    s.whiteSpace = 'pre-wrap';

    switch (tag) {
      case 'h1':
        s.fontSize = '22px';
        s.fontWeight = 'bold';
        s.color = colors.h1;
        s.marginTop = colors.headingMarginTop;
        s.marginBottom = colors.headingMarginBottom;
        s.paddingBottom = '0.3em';
        s.borderBottom = `1px solid ${colors.hr}`;
        break;
      case 'h2':
        s.fontSize = '19px';
        s.fontWeight = 'bold';
        s.color = colors.h2;
        s.marginTop = colors.headingMarginTop;
        s.marginBottom = colors.headingMarginBottom;
        s.paddingBottom = '0.2em';
        s.borderBottom = `1px solid ${colors.hr}`;
        break;
      case 'h3':
        s.fontSize = '17px';
        s.fontWeight = 'bold';
        s.color = colors.h3;
        s.marginTop = '1.2em';
        s.marginBottom = '0.6em';
        break;
      case 'h4':
        s.fontSize = '16px';
        s.fontWeight = 'bold';
        s.color = colors.h4;
        s.marginTop = '1em';
        s.marginBottom = '0.5em';
        break;
      case 'h5':
        s.fontSize = '15px';
        s.fontWeight = 'bold';
        s.color = colors.h5;
        s.marginTop = '1em';
        s.marginBottom = '0.5em';
        break;
      case 'h6':
        s.fontSize = '14px';
        s.fontWeight = 'bold';
        s.color = colors.h6;
        s.marginTop = '1em';
        s.marginBottom = '0.5em';
        break;
      case 'p':
        s.marginTop = '0';
        s.marginBottom = colors.paragraphSpacing;
        break;
      case 'strong':
      case 'b':
        s.fontWeight = 'bold';
        s.color = colors.bold;
        break;
      case 'em':
      case 'i':
        s.fontStyle = 'italic';
        s.color = colors.italic;
        break;
      case 'del':
      case 's':
        s.textDecoration = 'line-through';
        s.color = colors.strikethrough;
        break;
      case 'a':
        s.color = colors.link;
        s.textDecoration = 'none';
        break;
      case 'code': {
        const parent = el.parentElement;
        if (parent && parent.tagName.toLowerCase() !== 'pre') {
          s.color = colors.inlineCode;
          s.backgroundColor = colors.inlineCodeBg;
          s.padding = '2px 6px';
          s.borderRadius = style.borderRadius;
          s.fontSize = '13px';
          s.fontFamily = style.codeFontFamily;
        }
        break;
      }
      case 'pre':
        s.backgroundColor = colors.codeBlockBg;
        s.color = colors.codeBlockText;
        s.padding = '1em';
        s.borderRadius = style.borderRadius;
        s.margin = '1em 0';
        s.overflowX = 'auto';
        s.fontSize = '13px';
        s.lineHeight = '1.6';
        s.whiteSpace = 'pre';
        s.fontFamily = style.codeFontFamily;
        break;
      case 'blockquote':
        s.borderLeft = `4px solid ${colors.blockquoteBorder}`;
        s.backgroundColor = colors.blockquoteBg;
        s.color = colors.blockquoteText;
        s.padding = '0.8em 1em';
        s.margin = '1em 0';
        s.fontStyle = 'normal';
        s.borderRadius = `0 ${style.borderRadius} ${style.borderRadius} 0`;
        break;
      case 'ul':
      case 'ol':
        s.paddingLeft = '1.5em';
        s.margin = '0.5em 0';
        break;
      case 'li':
        s.marginBottom = '0.3em';
        break;
      case 'hr':
        s.border = 'none';
        s.borderTop = `1px solid ${colors.hr}`;
        s.margin = '2em 0';
        break;
      case 'table':
        s.width = '100%';
        s.maxWidth = '100%';
        s.borderCollapse = 'collapse';
        s.fontSize = '14px';
        s.display = 'table';
        s.tableLayout = 'auto';
        // 包在滚动容器里，由外层 div 控制 margin 和 overflow
        s.margin = '0';
        break;
      case 'thead':
        s.backgroundColor = colors.tableHeaderBg;
        break;
      case 'th':
        s.padding = '8px 12px';
        s.border = `1px solid ${colors.tableBorder}`;
        s.textAlign = 'left';
        s.fontWeight = 'bold';
        s.color = colors.tableHeaderText;
        s.backgroundColor = colors.tableHeaderBg;
        break;
      case 'td':
        s.padding = '8px 12px';
        s.border = `1px solid ${colors.tableBorder}`;
        break;
      case 'section':
        s.fontSize = '13px';
        s.color = colors.footnoteText;
        s.marginTop = '2em';
        break;
      case 'div': {
        // 占位符
        const ph = el.getAttribute('data-placeholder');
        if (ph === 'video') {
          s.margin = '1em 0';
          s.padding = '2em 1em';
          s.background = colors.codeBlockBg;
          s.border = `1px dashed ${colors.hr}`;
          s.borderRadius = style.borderRadius;
          s.textAlign = 'center';
          s.color = colors.footnoteText;
          s.fontSize = '14px';
          // 子 span
          const span = el.querySelector('span');
          if (span) span.style.fontSize = '12px';
        } else if (ph === 'image') {
          s.margin = '1em 0';
          s.padding = '2em 1em';
          s.background = colors.codeBlockBg;
          s.border = `1px solid ${colors.tableBorder}`;
          s.borderRadius = style.borderRadius;
          s.textAlign = 'center';
          s.color = colors.footnoteText;
          s.fontSize = '14px';
          const span = el.querySelector('span');
          if (span) span.style.fontSize = '12px';
        }
        break;
      }
      case 'span': {
        if (el.getAttribute('data-latex')) {
          s.fontStyle = 'italic';
          s.color = colors.italic;
        }
        break;
      }
    }

    // 表格斑马纹
    if (tag === 'tr') {
      const table = el.closest('table');
      if (table) {
        const rows = Array.from(table.querySelectorAll('tr'));
        const index = rows.indexOf(el as HTMLTableRowElement);
        const headerRows = table.querySelectorAll('thead tr').length;
        const dataIndex = index - headerRows;
        if (dataIndex >= 0 && dataIndex % 2 === 1) {
          s.backgroundColor = colors.tableStripe;
        }
      }
    }

    for (const child of Array.from(el.children)) {
      apply(child as HTMLElement);
    }
  };

  container.style.background = colors.background;
  container.style.padding = '15px';

  for (const child of Array.from(container.children)) {
    apply(child as HTMLElement);
  }

  // 把 table 包到滚动容器里，防止在 375px 宽的手机模型里溢出
  const tables = container.querySelectorAll('table');
  for (const table of tables) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-table-wrapper', '');
    table.parentNode!.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  }

  return container.innerHTML;
}
