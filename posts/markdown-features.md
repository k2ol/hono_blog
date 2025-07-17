---
title: Markdown Features Showcase
date: 2024-01-25
author: Blog Author
tags: markdown, formatting, demo
---

# Markdown Features Showcase

This post demonstrates the various Markdown features supported by this blog platform.

## Text Formatting

You can make text **bold**, *italic*, or ***both***. You can also use ~~strikethrough~~ text.

## Lists

### Unordered Lists
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered Lists
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

## Code

Inline code: `const greeting = "Hello, World!"`

Code blocks with syntax highlighting:

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

```json
{
  "name": "markdown-blog",
  "version": "1.0.0",
  "description": "A blog platform built with Hono.js",
  "features": [
    "Markdown parsing",
    "Responsive design",
    "Fast rendering"
  ]
}
```

## Blockquotes

> "The best way to predict the future is to invent it."
> 
> — Alan Kay

> **Note:** This is a multi-line blockquote that can contain
> multiple paragraphs and even other formatting like **bold text**.

## Links and Images

Check out [Hono.js](https://hono.dev) for more information about the framework powering this blog.

## Tables

| Feature | Supported | Notes |
|---------|-----------|-------|
| Headers | ✅ | H1-H6 |
| Lists | ✅ | Ordered & unordered |
| Code | ✅ | Inline & blocks |
| Tables | ✅ | Like this one! |
| Links | ✅ | Internal & external |

## Horizontal Rule

---

## Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

This blog platform renders all these Markdown features beautifully, making it easy to create rich, formatted content for your readers.