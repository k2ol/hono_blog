import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { parseMarkdown, extractMetadata, generateExcerpt, type BlogPost } from './markdown';

const POSTS_DIR = join(process.cwd(), 'posts');

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const files = await readdir(POSTS_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const slug = file.replace('.md', '');
        return await getPostBySlug(slug);
      })
    );

    // Sort by date (newest first)
    return posts
      .filter(post => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = join(POSTS_DIR, `${slug}.md`);
    const content = await readFile(filePath, 'utf-8');
    
    const { metadata, body } = extractMetadata(content);
    const htmlContent = parseMarkdown(body);
    
    return {
      slug,
      title: metadata.title || slug.replace(/-/g, ' '),
      content: htmlContent,
      date: metadata.date || new Date().toISOString().split('T')[0],
      excerpt: generateExcerpt(htmlContent),
      metadata: {
        ...metadata,
        tags: metadata.tags || []
      }
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.slice(0, limit);
}