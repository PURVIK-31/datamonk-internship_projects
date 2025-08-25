import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pkg from 'pg'

dotenv.config()
const { Pool } = pkg

const app = express()
app.use(cors())
app.use(express.json())

const shouldUseSsl = (process.env.DATABASE_URL || '').includes('sslmode=require')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined
})

async function init() {
  let lastErr
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL
      )`)
      return
    } catch (err) {
      lastErr = err
      await new Promise(r => setTimeout(r, attempt * 500))
    }
  }
  throw lastErr
}

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/items', async (_req, res) => {
  const { rows } = await pool.query('SELECT * FROM items ORDER BY id DESC')
  res.json(rows)
})

app.post('/items', async (req, res) => {
  const { title } = req.body
  const { rows } = await pool.query('INSERT INTO items(title) VALUES($1) RETURNING *', [title])
  res.status(201).json(rows[0])
})

app.put('/items/:id', async (req, res) => {
  const { id } = req.params
  const { title } = req.body
  const { rows } = await pool.query('UPDATE items SET title=$1 WHERE id=$2 RETURNING *', [title, id])
  if (!rows[0]) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params
  const { rowCount } = await pool.query('DELETE FROM items WHERE id=$1', [id])
  if (!rowCount) return res.status(404).json({ error: 'Not found' })
  res.status(204).end()
})

const port = process.env.PORT || 3000
init().then(() => {
  app.listen(port, () => console.log(`api on ${port}`))
}).catch((err) => {
  console.error(err)
  process.exit(1)
})


