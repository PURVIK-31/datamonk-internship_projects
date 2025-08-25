import React, { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function App() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch(`${API_URL}/items`)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => { load() }, [])

  async function addItem(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    await fetch(`${API_URL}/items`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })
    setTitle('')
    await load()
    setLoading(false)
  }

  async function updateItem(id) {
    const newTitle = prompt('New title?')
    if (!newTitle) return
    await fetch(`${API_URL}/items/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTitle }) })
    await load()
  }

  async function deleteItem(id) {
    await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' })
    await load()
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Items</h2>
      <form onSubmit={addItem} style={{ display: 'flex', gap: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="add item" style={{ flex: 1, padding: 8 }} />
        <button disabled={loading} type="submit">Add</button>
      </form>
      <ul>
        {items.map(i => (
          <li key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
            <span>{i.title}</span>
            <span style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => updateItem(i.id)}>Edit</button>
              <button onClick={() => deleteItem(i.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}


