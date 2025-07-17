import { Hono } from 'hono'
import blog from './routes/blog'

const app = new Hono()

// Mount blog routes
app.route('/', blog)

export default app
