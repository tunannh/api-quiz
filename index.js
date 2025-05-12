const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(cors())
app.use(express.json())

// Kết nối Supabase
const supabaseUrl = 'https://mzhqtpbneeuisninzeui.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16aHF0cGJuZWV1aXNuaW56ZXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNzY3NDAsImV4cCI6MjA2MjY1Mjc0MH0.gqjODp4XAMW4GTz8l3e0-VTedKBRYfZBEZErIh_UfNw'
const supabase = createClient(supabaseUrl, supabaseKey)

// === API ROUTES ===

// GET /users
app.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /users
app.post('/users', async (req, res) => {
  const { name, score } = req.body
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, score }])
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// ======= API cho bảng topics =======
app.get('/topics', async (req, res) => {
  const { data, error } = await supabase.from('topics').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/topics', async (req, res) => {
  const { name } = req.body
  const { data, error } = await supabase.from('topics').insert([{ name }])
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// ======= API cho bảng questions =======
app.get('/questions', async (req, res) => {
  const { data, error } = await supabase.from('questions').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/questions', async (req, res) => {
  const { content, topic_id } = req.body
  const { data, error } = await supabase
    .from('questions')
    .insert([{ content, topic_id }])
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// ======= API cho bảng answers =======
app.get('/answers', async (req, res) => {
  const { data, error } = await supabase.from('answers').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

app.post('/answers', async (req, res) => {
  const { content, question_id, is_correct } = req.body
  const { data, error } = await supabase
    .from('answers')
    .insert([{ content, question_id, is_correct }])
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})


// Khởi động server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API server chạy tại http://localhost:${PORT}`)
})
