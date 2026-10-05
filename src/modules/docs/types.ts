export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface DocItem {
  id: string;
  slug: string; // e.g. "deployment/embed-chat-widget"
  title: string;
  description: string;
  category: string;
  order: number;
  readingTime?: string;
  lastUpdated?: string;
  badge?: string;
  content: string; // Rich Markdown string
}

export interface DocCategory {
  id: string;
  title: string;
  icon: string;
  order: number;
  items: DocItem[];
}

export interface DocPaginationItem {
  title: string;
  slug: string;
  category: string;
}
