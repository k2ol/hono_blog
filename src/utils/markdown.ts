// Simple markdown parser without external dependencies
// Note: For production use, install 'marked' package with: bun install marked

export interface BlogPost {
  slug: string;
  title: string;
  content: string;
  date: string;
  excerpt: string;
  metadata: Record<string, any>;
}

export function parseMarkdown(content: string): string {
  // Simple markdown parser for basic functionality
  // Replace with marked(content) after running: bun install
  return content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\(([^\)]+)\)/gim, '<img alt="$1" src="$2" />')
    .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
    .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/\n/gim, '<br>')
    .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
    .replace(/<\/ul><br><ul>/gim, '')
    .replace(/<\/blockquote><br><blockquote>/gim, '<br>');
}

export function extractMetadata(content: string): { metadata: Record<string, any>, body: string } {
  const lines = content.split('\n');
  const metadata: Record<string, any> = {};
  let bodyStartIndex = 0;

  // Check if content starts with frontmatter
  if (lines[0] === '---') {
    let i = 1;
    while (i < lines.length && lines[i] !== '---') {
      const line = lines[i].trim();
      if (line && line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        metadata[key.trim()] = valueParts.join(':').trim();
      }
      i++;
    }
    bodyStartIndex = i + 1;
  }

  const body = lines.slice(bodyStartIndex).join('\n');
  return { metadata, body };
}

export function generateExcerpt(content: string, length: number = 150): string {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
  return plainText.length > length ? plainText.substring(0, length) + '...' : plainText;
}