import { marked } from 'marked';

export interface BlogPost {
  slug: string;
  title: string;
  content: string;
  date: string;
  excerpt: string;
  metadata: Record<string, any>;
}

export function parseMarkdown(content: string): string {
  // Configure marked options for better rendering
  marked.setOptions({
    breaks: true,
    gfm: true, // GitHub Flavored Markdown
    tables: true,
    sanitize: false,
    smartLists: true,
    smartypants: true
  });
  
  return marked(content);
}


export function extractMetadata(content: string): { metadata: Record<string, any>, body: string } {
  const lines = content.split('\n');
  const metadata: Record<string, any> = {};
  let bodyStartIndex = 0;

  // Check if content starts with frontmatter
  if (lines[0].trim() === '---') {
    let i = 1;
    while (i < lines.length && lines[i].trim() !== '---') {
      const line = lines[i].trim();
      if (line && line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        
        // Handle different value types
        if (key.trim() === 'tags') {
          // Parse tags as comma-separated values
          metadata[key.trim()] = value.split(',').map(tag => tag.trim());
        } else {
          metadata[key.trim()] = value;
        }
      }
      i++;
    }
    bodyStartIndex = i + 1;
  }

  const body = lines.slice(bodyStartIndex).join('\n').trim();
  return { metadata, body };
}

export function generateExcerpt(content: string, length: number = 150): string {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
  return plainText.length > length ? plainText.substring(0, length) + '...' : plainText;
}