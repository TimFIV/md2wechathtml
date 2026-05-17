export interface ThemeStyle {
  // 字体
  fontFamily: string;
  fontSize: string;
  lineHeight: number;
  // 圆角
  borderRadius: string;
  // 代码块字体
  codeFontFamily: string;
}

export interface ThemeColors {
  // 基础
  background: string;
  text: string;
  // 标题
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  // 内联
  bold: string;
  italic: string;
  strikethrough: string;
  link: string;
  inlineCode: string;
  inlineCodeBg: string;
  // 代码块
  codeBlockBg: string;
  codeBlockText: string;
  // 引用
  blockquoteBorder: string;
  blockquoteBg: string;
  blockquoteText: string;
  // 列表
  listBullet: string;
  // 表格
  tableBorder: string;
  tableHeaderBg: string;
  tableHeaderText: string;
  tableStripe: string;
  // 分割线
  hr: string;
  // 脚注
  footnoteLink: string;
  footnoteText: string;
  // 间距
  paragraphSpacing: string;
  headingMarginTop: string;
  headingMarginBottom: string;
}

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  colors: ThemeColors;
  style: ThemeStyle;
}

export interface HistoryItem {
  id: string;
  title: string;
  content: string;
  themeId: string;
  createdAt: number;
  updatedAt: number;
}
