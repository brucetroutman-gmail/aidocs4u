# AIDocs4U Development Phase 1 - Website Foundation

## Directory Structure
```
aidocs4u-web/
├── package.json
├── client/
│   ├── index.html
│   ├── auth.html
│   ├── download.html
│   ├── styles/
│   │   └── main.css
│   ├── scripts/
│   │   ├── main.mjs
│   │   └── auth.mjs
│   └── assets/
│       └── --aidocs4u-logo.jpg
├── server/
│   ├── server.mjs
│   ├── routes/
│   │   ├── auth.mjs
│   │   └── pages.mjs
│   └── middleware/
│       └── auth.mjs
└── database/
    └── schema.sql
```

## File Contents

### File: package.json
```json
{
  "name": "aidocs4u-web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server/server.mjs",
    "dev": "node --watch server/server.mjs"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5"
  }
}
```

### File: server/server.mjs
```javascript
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.mjs';
import pageRoutes from './routes/pages.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

app.use('/api/auth', authRoutes);
app.use('/', pageRoutes);

app.listen(PORT, () => {
  console.log(`AIDocs4U server running on port ${PORT}`);
});
```

### File: database/schema.sql
```sql
CREATE DATABASE IF NOT EXISTS aidocs4u;
USE aidocs4u;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  subscription_tier ENUM('free', 'pro', 'enterprise') DEFAULT 'free'
);

CREATE INDEX idx_email ON users(email);
```

### File: server/routes/auth.mjs
```javascript
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
```

### File: server/routes/pages.mjs
```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/index.html'));
});

router.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/auth.html'));
});

router.get('/download', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/download.html'));
});

export default router;
```

### File: client/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIDocs4U - Private AI Document Search</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="nav-brand">
                <img src="assets/--aidocs4u-logo.jpg" alt="AIDocs4U" class="logo">
                <span>AIDocs4U</span>
            </div>
            <div class="nav-menu">
                <a href="#home">Home</a>
                <a href="#pricing">Pricing</a>
                <div class="dropdown">
                    <a href="#services">Services ▼</a>
                    <div class="dropdown-content">
                        <a href="#document-search">Document Search</a>
                        <a href="#ai-analysis">AI Analysis</a>
                        <a href="#privacy-solutions">Privacy Solutions</a>
                        <a href="#enterprise">Enterprise Support</a>
                    </div>
                </div>
                <div class="dropdown">
                    <a href="#explore">Explore ▼</a>
                    <div class="dropdown-content">
                        <a href="#story">How We Got Here</a>
                        <a href="#testimonials">What Our Customers Say</a>
                    </div>
                </div>
                <div class="dropdown">
                    <a href="#support">Support ▼</a>
                    <div class="dropdown-content">
                        <a href="#kb">Knowledge Base</a>
                        <a href="#tutorials">Tutorials</a>
                        <a href="#contact">Contact Us</a>
                    </div>
                </div>
            </div>
            <div class="nav-auth">
                <button id="darkModeToggle">🌙</button>
                <select id="languageSelect">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                </select>
                <a href="/auth" class="btn-signin">Sign In</a>
                <a href="/auth" class="btn-signup">Sign Up</a>
            </div>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="hero-content">
                <h1>AI Document Search & Analysis</h1>
                <p>Keep Your Data Private & Local</p>
                <p class="hero-subtitle">Search and analyze your personal documents with AI while keeping everything completely private on your local computer.</p>
                <a href="/download" class="btn-primary">Get Started Now</a>
            </div>
        </section>

        <section class="features">
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>🔒 Private & Secure</h3>
                    <p>All processing happens locally. Your documents never leave your computer.</p>
                </div>
                <div class="feature-card">
                    <h3>🤖 AI-Powered Search</h3>
                    <p>Advanced AI models help you find exactly what you're looking for.</p>
                </div>
                <div class="feature-card">
                    <h3>⚡ Easy Setup</h3>
                    <p>Simple installation on your Mac Mini with everything included.</p>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-links">
                <a href="#about">About</a>
                <a href="#privacy">Privacy</a>
                <a href="#terms">Terms</a>
                <a href="#contact">Contact</a>
            </div>
            <div class="footer-social">
                <a href="#twitter">Twitter</a>
                <a href="#linkedin">LinkedIn</a>
            </div>
        </div>
    </footer>

    <script type="module" src="scripts/main.mjs"></script>
</body>
</html>
```

### File: client/auth.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - AIDocs4U</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <img src="assets/--aidocs4u-logo.jpg" alt="AIDocs4U" class="auth-logo">
            
            <div id="signinForm" class="auth-form">
                <h2>Sign In</h2>
                <form>
                    <input type="email" id="signinEmail" placeholder="Email" required>
                    <input type="password" id="signinPassword" placeholder="Password" required>
                    <button type="submit">Sign In</button>
                </form>
                <p>Don't have an account? <a href="#" id="showSignup">Sign Up</a></p>
            </div>

            <div id="signupForm" class="auth-form hidden">
                <h2>Sign Up</h2>
                <form>
                    <input type="email" id="signupEmail" placeholder="Email" required>
                    <input type="password" id="signupPassword" placeholder="Password" required>
                    <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <a href="#" id="showSignin">Sign In</a></p>
            </div>
        </div>
    </div>

    <script type="module" src="scripts/auth.mjs"></script>
</body>
</html>
```

### File: client/styles/main.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --text-color: #1f2937;
    --bg-color: #ffffff;
    --card-bg: #f9fafb;
    --border-color: #e5e7eb;
}

[data-theme="dark"] {
    --text-color: #f9fafb;
    --bg-color: #111827;
    --card-bg: #1f2937;
    --border-color: #374151;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    font-size: 1.2rem;
}

.logo {
    height: 40px;
    width: auto;
}

.nav-menu {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.dropdown {
    position: relative;
}

.dropdown-content {
    display: none;
    position: absolute;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0.5rem 0;
    min-width: 200px;
    z-index: 1000;
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown-content a {
    display: block;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: var(--text-color);
}

.nav-auth {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.btn-primary, .btn-signin, .btn-signup {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0.75rem 2rem;
}

.btn-signin {
    color: var(--text-color);
    border: 1px solid var(--border-color);
}

.btn-signup {
    background: var(--primary-color);
    color: white;
}

.hero {
    text-align: center;
    padding: 4rem 2rem;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin: 1rem 0 2rem;
    opacity: 0.9;
}

.features {
    padding: 4rem 2rem;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.feature-card {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    border: 1px solid var(--border-color);
}

.feature-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
}

.auth-card {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    width: 100%;
    max-width: 400px;
}

.auth-logo {
    height: 60px;
    display: block;
    margin: 0 auto 2rem;
}

.auth-form input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-color);
    color: var(--text-color);
}

.auth-form button {
    width: 100%;
    padding: 0.75rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

.hidden {
    display: none;
}

footer {
    background: var(--card-bg);
    border-top: 1px solid var(--border-color);
    padding: 2rem;
    text-align: center;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-links, .footer-social {
    display: flex;
    gap: 2rem;
}

.footer-links a, .footer-social a {
    color: var(--text-color);
    text-decoration: none;
}

@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-menu {
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .footer-content {
        flex-direction: column;
        gap: 1rem;
    }
}
```

### File: client/scripts/main.mjs
```javascript
// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    darkModeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
darkModeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

// Language selector
const languageSelect = document.getElementById('languageSelect');
languageSelect.addEventListener('change', (e) => {
    localStorage.setItem('language', e.target.value);
    // Language switching logic would go here
});

// Load saved language
const savedLanguage = localStorage.getItem('language') || 'en';
languageSelect.value = savedLanguage;
```

### File: client/scripts/auth.mjs
```javascript
const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showSignin = document.getElementById('showSignin');

// Toggle between signin and signup forms
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

showSignin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
});

// Handle signin
signinForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    
    try {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/download';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Sign in failed. Please try again.');
    }
});

// Handle signup
signupForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Account created successfully! Please sign in.');
            signupForm.classList.add('hidden');
            signinForm.classList.remove('hidden');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Sign up failed. Please try again.');
    }
});
```

## Installation Instructions

1. **Create directory structure**:
   ```bash
   mkdir -p aidocs4u-web/client/{styles,scripts,assets}
   mkdir -p aidocs4u-web/server/{routes,middleware}
   mkdir -p aidocs4u-web/database
   ```

2. **Install dependencies**:
   ```bash
   cd aidocs4u-web
   npm install
   ```

3. **Setup MySQL database**:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

4. **Update database credentials** in `server/routes/auth.mjs`

5. **Copy logo file** to `client/assets/--aidocs4u-logo.jpg`

6. **Run development server**:
   ```bash
   npm run dev
   ```

7. **Access website** at `http://localhost:3000`

## VSCode Debug Configuration

### File: .vscode/launch.json
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Server",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/aidocs4u-web/server/server.mjs",
            "env": {
                "NODE_ENV": "development"
            },
            "console": "integratedTerminal"
        }
    ]
}
```

This creates a complete website foundation with user authentication, responsive design, and dark mode support. Ready for Phase 2: Desktop Client development.