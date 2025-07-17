import { Hono } from 'hono'
import posts from './routes/posts'
import tags from './routes/tags'
import index from './routes/index'

const app = new Hono()

// Mount blog routes
app.route('/posts', posts)

// Mount tags routes
app.route('/tags', tags)
app.route('/' , index)


export default app
