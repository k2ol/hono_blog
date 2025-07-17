import { getAllPosts } from './posts';
import type { BlogPost } from './markdown';

export interface TagInfo {
  name: string;
  count: number;
  posts: BlogPost[];
}

export async function getAllTags(): Promise<TagInfo[]> {
  const allPosts = await getAllPosts();
  const tagMap = new Map<string, BlogPost[]>();
  
  // Scan all posts and collect tags
  allPosts.forEach(post => {
    if (post.metadata.tags && Array.isArray(post.metadata.tags)) {
      post.metadata.tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)!.push(post);
      });
    }
  });
  
  // Convert to TagInfo array and sort by count (descending)
  const tags: TagInfo[] = Array.from(tagMap.entries()).map(([name, posts]) => ({
    name,
    count: posts.length,
    posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }));
  
  return tags.sort((a, b) => b.count - a.count);
}

export async function getPostsByTag(tagName: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  
  return allPosts.filter(post => 
    post.metadata.tags && 
    Array.isArray(post.metadata.tags) && 
    post.metadata.tags.includes(tagName)
  );
}

export async function getTagCloud(): Promise<TagInfo[]> {
  return await getAllTags();
}

export async function getRelatedPosts(currentPost: BlogPost, limit: number = 3): Promise<BlogPost[]> {
  if (!currentPost.metadata.tags || !Array.isArray(currentPost.metadata.tags)) {
    return [];
  }
  
  const allPosts = await getAllPosts();
  const relatedPosts: { post: BlogPost, score: number }[] = [];
  
  allPosts.forEach(post => {
    if (post.slug === currentPost.slug) return; // Skip current post
    
    if (post.metadata.tags && Array.isArray(post.metadata.tags)) {
      // Calculate similarity score based on shared tags
      const sharedTags = currentPost.metadata.tags.filter(tag => 
        post.metadata.tags.includes(tag)
      );
      
      if (sharedTags.length > 0) {
        const score = sharedTags.length / Math.max(currentPost.metadata.tags.length, post.metadata.tags.length);
        relatedPosts.push({ post, score });
      }
    }
  });
  
  // Sort by score (descending) and return top results
  return relatedPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}