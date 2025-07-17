import { Hono } from 'hono'
import blog from './routes/blog'
import tags from './routes/tags'

const app = new Hono()

// Mount blog routes
app.route('/', blog)

// Mount tags routes
app.route('/', tags)

export default app
