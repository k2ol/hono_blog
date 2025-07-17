import { Hono } from 'hono';
import { getAllPosts, getPostBySlug, getRecentPosts } from '../utils/posts';
import { getRelatedPosts } from '../utils/tags';

const index = new Hono();

// Homepage with recent posts
index.get('/', async (c) => {
  const recentPosts = await getRecentPosts(5);
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Markdown Blog</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { border-bottom: 2px solid #333; margin-bottom: 30px; padding-bottom: 20px; }
        .post-preview { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .post-title { color: #333; text-decoration: none; }
        .post-title:hover { color: #666; }
        .post-meta { color: #666; font-size: 0.9em; margin-bottom: 10px; }
        .post-excerpt { color: #444; }
        .nav { margin-bottom: 20px; }
        .nav a { margin-right: 20px; color: #333; text-decoration: none; }
        .nav a:hover { text-decoration: underline; }
        .post-tags { margin-top: 10px; }
        .tag { display: inline-block; background: #e1f5fe; color: #0277bd; padding: 4px 8px; margin: 2px 4px 2px 0; border-radius: 4px; font-size: 0.8em; text-decoration: none; }
        .tag:hover { background: #b3e5fc; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Markdown Blog</h1>
        <div class="nav">
          <a href="/">Home</a>
          <a href="/posts">All Posts</a>
          <a href="/tags">Tags</a>
        </div>
      </div>
      
      <main>
        <h2>Recent Posts</h2>
        ${recentPosts.length === 0 ? 
          '<p>No posts found. Create some markdown files in the posts/ directory!</p>' :
          recentPosts.map(post => `
            <article class="post-preview">
              <h3><a href="/posts/${post.slug}" class="post-title">${post.title}</a></h3>
              <div class="post-meta">
                Published on ${post.date}
                ${post.metadata.author ? ` by ${post.metadata.author}` : ''}
                ${post.metadata.tags && post.metadata.tags.length > 0 ? `
                  <div class="post-tags">
                    ${post.metadata.tags.map(tag => `<a href="/tags/${encodeURIComponent(tag)}" class="tag">${tag}</a>`).join('')}
                  </div>
                ` : ''}
              </div>
              <p class="post-excerpt">${post.excerpt}</p>
            </article>
          `).join('')
        }
      </main>
    </body>
    </html>
  `;
  
  return c.html(html);
});

export default index;