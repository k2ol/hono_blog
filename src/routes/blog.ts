import { Hono } from 'hono';
import { getAllPosts, getPostBySlug, getRecentPosts } from '../utils/posts';

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
              <div class="post-meta">Published on ${post.date}</div>
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
              <div class="post-meta">Published on ${post.date}</div>
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
        .post-content { margin-bottom: 40px; }
        .post-content h1, .post-content h2, .post-content h3 { color: #333; }
        .post-content pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .post-content code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        .post-content blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
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
          <div class="post-meta">Published on ${post.date}</div>
          <div class="post-content">
            ${post.content}
          </div>
        </article>
        
        <div class="back-link">
          <a href="/posts">← Back to all posts</a>
        </div>
      </main>
    </body>
    </html>
  `;
  
  return c.html(html);
});

export default blog;