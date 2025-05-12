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

// ======= API cho bảng users =======

// GET /users (1. lấy all, 2. lọc email + password, 3. lọc chỉ email)
app.get('/users', async (req, res) => {
  const { email, password } = req.query;
  let query = supabase.from('users').select('*');

  if (email && password) {
    // Lọc theo email + password
    query = query.eq('email', email).eq('password', password);
  } else if (email) {
    // Lọc chỉ theo email
    query = query.eq('email', email);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// GET /users/:id (4. lấy theo id duy nhất)
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'User not found' });

  res.json(data);
});

// POST /users (thêm user)
app.post('/users', async (req, res) => {
  const { fullName, email, password, token } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!fullName || !email || !password || !token) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Chèn vào bảng users
  const { data, error } = await supabase.from('users').insert([
    { fullName, email, password, token }
  ]).select().single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
});

// ======= API cho bảng topics =======

// GET /topics (lấy tất cả)
app.get('/topics', async (req, res) => {
  const { data, error } = await supabase.from('topics').select('*');
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// GET /topics/:id (lấy theo id duy nhất)
app.get('/topics/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('topics').select('*').eq('id', id).single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Topic not found' });

  res.json(data);
});

// POST /topics (thêm topic)
app.post('/topics', async (req, res) => {
  const { name } = req.body;
  const { data, error } = await supabase.from('topics').insert([{ name }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});


// ======= API cho bảng questions =======

// GET /questions (lấy tất cả hoặc lọc theo topicId)
app.get('/questions', async (req, res) => {
  const { topicId } = req.query;

  let query = supabase.from('questions').select('*');

  // Nếu có truyền topicId, lọc theo topic_id
  if (topicId) {
    query = query.eq('topicId', topicId);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// POST /questions (thêm câu hỏi)
app.post('/questions', async (req, res) => {
  const { content, topicId } = req.body;
  const { data, error } = await supabase
    .from('questions')
    .insert([{ content, topicId }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ======= API cho bảng answers =======

// GET /answers (lấy tất cả hoặc lọc theo userId)
app.get('/answers', async (req, res) => {
  const { userId } = req.query;

  let query = supabase.from('answers').select('*');

  // Nếu có truyền userId, lọc theo user_id
  if (userId) {
    query = query.eq('userId', userId);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// GET /answers/:id (lấy answer theo id duy nhất)
app.get('/answers/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('id', id)
    .single();  // Trả về 1 object duy nhất

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// POST /answers (thêm answer mới)
app.post('/answers', async (req, res) => {
  const { time, userId, topicId, answers } = req.body;

  // Kiểm tra trường bắt buộc 'time'
  if (!time) {
    return res.status(400).json({ error: "'time' field is required" });
  }

  const { data, error } = await supabase
    .from('answers')
    .insert([{
      time: time,
      userId: userId || null,
      topicId: topicId || null,
      answers: answers || null
    }])
    .select()
    .single();  // Trả về object duy nhất (nếu bạn muốn trả array bỏ .single())

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Answer created', data });
});

// Khởi động server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API server chạy tại http://localhost:${PORT}`)
})
