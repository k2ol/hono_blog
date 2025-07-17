import { Hono } from 'hono';
import { getAllPosts, getPostBySlug, getRecentPosts } from '../utils/posts';
import { getRelatedPosts } from '../utils/tags';

const blog = new Hono();

// Homepage with recent posts
blog.get('/', async (c) => {
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
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Markdown Blog</h1>
        <div class="nav">
          <a href="/">Home</a>
          <a href="/posts">All Posts</a>
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
                    ${post.metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
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

// All posts listing
blog.get('/posts', async (c) => {
  const allPosts = await getAllPosts();
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>All Posts - Markdown Blog</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { border-bottom: 2px solid #333; margin-bottom: 30px; padding-bottom: 20px; }
        .post-item { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .post-title { color: #333; text-decoration: none; }
        .post-title:hover { color: #666; }
        .post-meta { color: #666; font-size: 0.9em; }
        .nav { margin-bottom: 20px; }
        .nav a { margin-right: 20px; color: #333; text-decoration: none; }
        .nav a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Markdown Blog</h1>
        <div class="nav">
          <a href="/">Home</a>
          <a href="/posts">All Posts</a>
        </div>
      </div>
      
      <main>
        <h2>All Posts (${allPosts.length})</h2>
        ${allPosts.length === 0 ? 
          '<p>No posts found. Create some markdown files in the posts/ directory!</p>' :
          allPosts.map(post => `
            <article class="post-item">
              <h3><a href="/posts/${post.slug}" class="post-title">${post.title}</a></h3>
              <div class="post-meta">
                Published on ${post.date}
                ${post.metadata.author ? ` by ${post.metadata.author}` : ''}
                ${post.metadata.tags && post.metadata.tags.length > 0 ? `
                  <div class="post-tags">
                    ${post.metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                  </div>
                ` : ''}
              </div>
            </article>
          `).join('')
        }
      </main>
    </body>
    </html>
  `;
  
  return c.html(html);
});

// Individual post
blog.get('/posts/:slug', async (c) => {
  const slug = c.req.param('slug');
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Post Not Found - Markdown Blog</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
          .header { border-bottom: 2px solid #333; margin-bottom: 30px; padding-bottom: 20px; }
          .nav { margin-bottom: 20px; }
          .nav a { margin-right: 20px; color: #333; text-decoration: none; }
          .nav a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Markdown Blog</h1>
          <div class="nav">
            <a href="/">Home</a>
            <a href="/posts">All Posts</a>
          </div>
        </div>
        <main>
          <h2>Post Not Found</h2>
          <p>The post "${slug}" could not be found.</p>
          <p><a href="/posts">← Back to all posts</a></p>
        </main>
      </body>
      </html>
    `, 404);
  }
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${post.title} - Markdown Blog</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { border-bottom: 2px solid #333; margin-bottom: 30px; padding-bottom: 20px; }
        .post-meta { color: #666; font-size: 0.9em; margin-bottom: 30px; }
        .post-tags { margin-top: 10px; }
        .tag { display: inline-block; background: #e1f5fe; color: #0277bd; padding: 4px 8px; margin: 2px 4px 2px 0; border-radius: 4px; font-size: 0.8em; text-decoration: none; }
        .tag:hover { background: #b3e5fc; }
        .post-content { margin-bottom: 40px; }
        .post-content h1, .post-content h2, .post-content h3 { color: #333; }
        .post-content pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .post-content code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        .post-content blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
        .post-content table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        .post-content th, .post-content td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .post-content th { background-color: #f2f2f2; font-weight: bold; }
        .post-content img { max-width: 100%; height: auto; }
        .post-content hr { border: none; border-top: 2px solid #eee; margin: 30px 0; }
        .nav { margin-bottom: 20px; }
        .nav a { margin-right: 20px; color: #333; text-decoration: none; }
        .nav a:hover { text-decoration: underline; }
        .back-link { margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Markdown Blog</h1>
        <div class="nav">
          <a href="/">Home</a>
          <a href="/posts">All Posts</a>
        </div>
      </div>
      
      <main>
        <article>
          <h1>${post.title}</h1>
          <div class="post-meta">
            Published on ${post.date}
            ${post.metadata.author ? ` by ${post.metadata.author}` : ''}
            ${post.metadata.tags && post.metadata.tags.length > 0 ? `
              <div class="post-tags">
                Tags: ${post.metadata.tags.map(tag => `<a href="/tags/${encodeURIComponent(tag)}" class="tag">${tag}</a>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="post-content">
            ${post.content}
          </div>
        </article>
        
        <div class="back-link">
          <a href="/posts">← Back to all posts</a>
        </div>
        
        ${await generateRelatedPostsSection(post)}
      </main>
    </body>
    </html>
  `;
  
  return c.html(html);
});

async function generateRelatedPostsSection(currentPost: any): Promise<string> {
  const relatedPosts = await getRelatedPosts(currentPost, 3);
  
  if (relatedPosts.length === 0) {
    return '';
  }
  
  return `
    <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #eee;">
      <h3>Related Posts</h3>
      <div style="display: grid; gap: 20px;">
        ${relatedPosts.map(post => `
          <div style="padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <h4 style="margin: 0 0 8px 0;">
              <a href="/posts/${post.slug}" style="color: #333; text-decoration: none;">${post.title}</a>
            </h4>
            <div style="color: #666; font-size: 0.9em; margin-bottom: 8px;">
              ${post.date}${post.metadata.author ? ` by ${post.metadata.author}` : ''}
            </div>
            ${post.metadata.tags && post.metadata.tags.length > 0 ? `
              <div style="margin-top: 8px;">
                ${post.metadata.tags.map(tag => `<a href="/tags/${encodeURIComponent(tag)}" class="tag">${tag}</a>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export default blog;