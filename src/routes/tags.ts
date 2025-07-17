import { Hono } from 'hono';
import { getAllTags, getPostsByTag } from '../utils/tags';

const tags = new Hono();

// Tags overview page
tags.get('/tags', async (c) => {
  const allTags = await getAllTags();
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>All Tags - Markdown Blog</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { border-bottom: 2px solid #333; margin-bottom: 30px; padding-bottom: 20px; }
        .nav { margin-bottom: 20px; }
        .nav a { margin-right: 20px; color: #333; text-decoration: none; }
        .nav a:hover { text-decoration: underline; }
        .tag-cloud { margin: 30px 0; }
        .tag-item { display: inline-block; margin: 8px 12px 8px 0; }
        .tag-link { 
          display: inline-block; 
          background: #e1f5fe; 
          color: #0277bd; 
          padding: 8px 16px; 
          border-radius: 20px; 
          text-decoration: none; 
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .tag-link:hover { 
          background: #b3e5fc; 
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .tag-count { 
          background: #0277bd; 
          color: white; 
          padding: 2px 8px; 
          border-radius: 10px; 
          font-size: 0.8em; 
          margin-left: 8px;
        }
        .tag-size-1 { font-size: 0.9em; }
        .tag-size-2 { font-size: 1.0em; }
        .tag-size-3 { font-size: 1.1em; }
        .tag-size-4 { font-size: 1.2em; }
        .tag-size-5 { font-size: 1.3em; }
        .tags-stats { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
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
        <h2>All Tags</h2>
        
        <div class="tags-stats">
          <strong>${allTags.length}</strong> tags found across all blog posts
        </div>
        
        ${allTags.length === 0 ? 
          '<p>No tags found. Add tags to your blog posts using YAML frontmatter!</p>' :
          `<div class="tag-cloud">
            ${allTags.map(tag => {
              // Calculate tag size based on post count
              const maxCount = Math.max(...allTags.map(t => t.count));
              const sizeClass = Math.min(5, Math.max(1, Math.ceil((tag.count / maxCount) * 5)));
              
              return `
                <div class="tag-item">
                  <a href="/tags/${encodeURIComponent(tag.name)}" class="tag-link tag-size-${sizeClass}">
                    ${tag.name}
                    <span class="tag-count">${tag.count}</span>
                  </a>
                </div>
              `;
            }).join('')}
          </div>`
        }
      </main>
    </body>
    </html>
  `;
  
  return c.html(html);
});

// Individual tag page
tags.get('/tags/:tagName', async (c) => {
  const tagName = decodeURIComponent(c.req.param('tagName'));
  const posts = await getPostsByTag(tagName);
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Posts tagged "${tagName}" - Markdown Blog</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { border-bottom: 2px solid #333; margin-bottom: 30px; padding-bottom: 20px; }
        .nav { margin-bottom: 20px; }
        .nav a { margin-right: 20px; color: #333; text-decoration: none; }
        .nav a:hover { text-decoration: underline; }
        .post-item { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
        .post-title { color: #333; text-decoration: none; }
        .post-title:hover { color: #666; }
        .post-meta { color: #666; font-size: 0.9em; margin-bottom: 10px; }
        .post-tags { margin-top: 10px; }
        .tag { display: inline-block; background: #e1f5fe; color: #0277bd; padding: 4px 8px; margin: 2px 4px 2px 0; border-radius: 4px; font-size: 0.8em; text-decoration: none; }
        .tag:hover { background: #b3e5fc; }
        .current-tag { background: #0277bd; color: white; }
        .back-link { margin-bottom: 20px; }
        .tag-header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
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
        <div class="back-link">
          <a href="/tags">← Back to all tags</a>
        </div>
        
        <div class="tag-header">
          <h2>Posts tagged with "${tagName}"</h2>
          <p><strong>${posts.length}</strong> post${posts.length !== 1 ? 's' : ''} found</p>
        </div>
        
        ${posts.length === 0 ? 
          `<p>No posts found with the tag "${tagName}".</p>` :
          posts.map(post => `
            <article class="post-item">
              <h3><a href="/posts/${post.slug}" class="post-title">${post.title}</a></h3>
              <div class="post-meta">
                Published on ${post.date}
                ${post.metadata.author ? ` by ${post.metadata.author}` : ''}
                ${post.metadata.tags && post.metadata.tags.length > 0 ? `
                  <div class="post-tags">
                    Tags: ${post.metadata.tags.map(tag => 
                      `<a href="/tags/${encodeURIComponent(tag)}" class="tag ${tag === tagName ? 'current-tag' : ''}">${tag}</a>`
                    ).join('')}
                  </div>
                ` : ''}
              </div>
              <p>${post.excerpt}</p>
            </article>
          `).join('')
        }
      </main>
    </body>
    </html>
  `;
  
  return c.html(html);
});

export default tags;