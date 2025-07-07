import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your-password',
  database: 'aidocs4u'
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.execute(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hashedPassword]
    );
    
    res.json({ success: true, message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Email already exists' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
    
    await db.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    
    res.json({ success: true, token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;