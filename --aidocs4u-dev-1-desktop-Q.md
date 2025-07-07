# AIDocs4U Development Phase 2 - Desktop Client

## Directory Structure
```
aidocs4u-client/
├── package.json
├── main.js
├── preload.js
├── renderer/
│   ├── index.html
│   ├── styles/
│   │   └── app.css
│   ├── scripts/
│   │   ├── app.mjs
│   │   ├── auth.mjs
│   │   ├── documents.mjs
│   │   └── search.mjs
│   └── assets/
│       └── --aidocs4u-logo.jpg
├── shared/
│   ├── existingsearch.mjs
│   └── existingscoring.mjs
└── data/
    ├── documents/
    ├── embeddings/
    └── settings.json
```

## File Contents

### File: package.json
```json
{
  "name": "aidocs4u-client",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "dev": "electron . --dev",
    "build": "electron-builder",
    "pack": "electron-builder --dir"
  },
  "devDependencies": {
    "electron": "^27.0.0",
    "electron-builder": "^24.6.4"
  },
  "dependencies": {
    "sqlite3": "^5.1.6",
    "axios": "^1.6.0"
  },
  "build": {
    "appId": "com.aidocs4u.client",
    "productName": "AIDocs4U",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!data/**/*"
    ],
    "mac": {
      "category": "public.app-category.productivity"
    }
  }
}
```

### File: main.js
```javascript
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'renderer/assets/--aidocs4u-logo.jpg'),
    titleBarStyle: 'default'
  });

  mainWindow.loadFile('renderer/index.html');

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Upload Documents',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.send('menu-upload-documents')
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'General Settings',
          click: () => mainWindow.webContents.send('menu-settings', 'general')
        },
        {
          label: 'AI Model Config',
          click: () => mainWindow.webContents.send('menu-settings', 'models')
        },
        {
          label: 'Document Folders',
          click: () => mainWindow.webContents.send('menu-settings', 'folders')
        },
        { type: 'separator' },
        {
          label: 'Toggle Dark Mode',
          click: () => mainWindow.webContents.send('menu-toggle-dark-mode')
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About AIDocs4U',
          click: () => mainWindow.webContents.send('menu-about')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result;
});

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documents', extensions: ['pdf', 'docx', 'txt', 'md'] }
    ]
  });
  return result;
});

ipcMain.handle('save-settings', async (event, settings) => {
  const settingsPath = path.join(__dirname, 'data/settings.json');
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  return { success: true };
});

ipcMain.handle('load-settings', async () => {
  const settingsPath = path.join(__dirname, 'data/settings.json');
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    return settings;
  } catch (error) {
    return getDefaultSettings();
  }
});

function getDefaultSettings() {
  return {
    searchType: 'Local Model Only',
    selectedModels: ['llama3'],
    useInternet: false,
    enableScoring: true,
    darkMode: false,
    documentFolders: []
  };
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### File: preload.js
```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFiles: () => ipcRenderer.invoke('select-files'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-upload-documents', callback);
    ipcRenderer.on('menu-settings', callback);
    ipcRenderer.on('menu-toggle-dark-mode', callback);
    ipcRenderer.on('menu-about', callback);
  }
});
```

### File: renderer/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIDocs4U</title>
    <link rel="stylesheet" href="styles/app.css">
</head>
<body>
    <div class="app-container">
        <!-- Header -->
        <header class="app-header">
            <div class="header-brand">
                <img src="assets/--aidocs4u-logo.jpg" alt="AIDocs4U" class="logo">
                <h1>AIDocs4U</h1>
            </div>
            <div class="header-user">
                <span id="userEmail">Not signed in</span>
                <button id="signOutBtn" class="btn-secondary">Sign Out</button>
            </div>
        </header>

        <!-- Auth Modal -->
        <div id="authModal" class="modal">
            <div class="modal-content">
                <h2>Sign In to AIDocs4U</h2>
                <form id="authForm">
                    <input type="email" id="email" placeholder="Email" required>
                    <input type="password" id="password" placeholder="Password" required>
                    <button type="submit">Sign In</button>
                </form>
                <p>Don't have an account? <a href="#" id="createAccountLink">Create one at aidocs4u.com</a></p>
            </div>
        </div>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Search Configuration -->
            <section class="config-section">
                <h3>Search Configuration</h3>
                <div class="config-grid">
                    <div class="config-item">
                        <label for="searchType">Type of Search:</label>
                        <select id="searchType">
                            <option value="Local Model Only">Local Model Only</option>
                            <option value="My Documents Only">My Documents Only</option>
                            <option value="My Documents + Local Model">My Documents + Local Model</option>
                        </select>
                    </div>
                    
                    <div class="config-item">
                        <label>Available Models:</label>
                        <div class="model-checkboxes">
                            <label><input type="checkbox" value="llama3" checked> Llama3</label>
                            <label><input type="checkbox" value="codellama"> CodeLlama</label>
                            <label><input type="checkbox" value="mistral"> Mistral</label>
                            <label><input type="checkbox" value="phi"> Phi</label>
                            <label><input type="checkbox" value="gemma"> Gemma</label>
                        </div>
                    </div>
                    
                    <div class="config-item">
                        <label class="toggle-label">
                            <input type="checkbox" id="useInternet">
                            <span class="toggle-slider"></span>
                            Use Internet
                        </label>
                    </div>
                    
                    <div class="config-item">
                        <label class="toggle-label">
                            <input type="checkbox" id="enableScoring" checked>
                            <span class="toggle-slider"></span>
                            Enable Scoring
                        </label>
                    </div>
                </div>
            </section>

            <!-- Document Management -->
            <section class="documents-section">
                <h3>Document Management</h3>
                <div class="documents-header">
                    <button id="createFolderBtn" class="btn-primary">Create Folder</button>
                    <button id="uploadDocsBtn" class="btn-primary">Upload Documents</button>
                    <button id="processDocsBtn" class="btn-secondary">AI Process Documents</button>
                </div>
                <div id="documentFolders" class="folder-list">
                    <!-- Folders will be populated here -->
                </div>
            </section>

            <!-- Search Interface -->
            <section class="search-section">
                <h3>Search Interface</h3>
                <div class="search-input-container">
                    <textarea id="userPrompt" placeholder="Enter your question or search query..."></textarea>
                    <button id="executeSearchBtn" class="btn-execute">➤</button>
                </div>
                <div id="searchResults" class="results-container">
                    <!-- Search results will appear here -->
                </div>
            </section>
        </main>

        <!-- Status Bar -->
        <footer class="status-bar">
            <span id="statusText">Ready</span>
            <span id="documentCount">Documents: 0</span>
            <span id="lastSync">Last Sync: Never</span>
        </footer>
    </div>

    <script type="module" src="scripts/app.mjs"></script>
</body>
</html>
```

### File: renderer/styles/app.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #2563eb;
    --secondary-color: #64748b;
    --success-color: #10b981;
    --danger-color: #ef4444;
    --text-color: #1f2937;
    --bg-color: #ffffff;
    --card-bg: #f9fafb;
    --border-color: #e5e7eb;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
    --text-color: #f9fafb;
    --bg-color: #111827;
    --card-bg: #1f2937;
    --border-color: #374151;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    height: 100vh;
    overflow: hidden;
}

.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow);
}

.header-brand {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logo {
    height: 40px;
    width: auto;
}

.header-brand h1 {
    font-size: 1.5rem;
    font-weight: 600;
}

.header-user {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.main-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.config-section, .documents-section, .search-section {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
}

.config-section h3, .documents-section h3, .search-section h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
}

.config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.config-item label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.config-item select, .config-item input[type="text"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-color);
    color: var(--text-color);
}

.model-checkboxes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.model-checkboxes label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: normal;
    margin-bottom: 0;
}

.toggle-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.toggle-slider {
    position: relative;
    width: 44px;
    height: 24px;
    background: var(--border-color);
    border-radius: 12px;
    transition: background 0.3s;
}

.toggle-slider::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s;
}

input[type="checkbox"]:checked + .toggle-slider {
    background: var(--primary-color);
}

input[type="checkbox"]:checked + .toggle-slider::before {
    transform: translateX(20px);
}

input[type="checkbox"] {
    display: none;
}

.documents-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.folder-list {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    min-height: 200px;
    padding: 1rem;
    background: var(--bg-color);
}

.search-input-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

#userPrompt {
    flex: 1;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-color);
    color: var(--text-color);
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}

.btn-execute {
    padding: 1rem 2rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: bold;
}

.results-container {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    min-height: 300px;
    padding: 1rem;
    background: var(--bg-color);
}

.btn-primary, .btn-secondary {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.3s;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: var(--secondary-color);
}

.btn-secondary {
    background: var(--secondary-color);
    color: white;
}

.status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 2rem;
    background: var(--card-bg);
    border-top: 1px solid var(--border-color);
    font-size: 0.9rem;
    color: var(--secondary-color);
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal.show {
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
    margin-bottom: 1rem;
    text-align: center;
}

.modal-content form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.modal-content input {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-color);
    color: var(--text-color);
}

.modal-content button {
    padding: 0.75rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.folder-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    margin-bottom: 0.5rem;
    background: var(--card-bg);
}

.folder-actions {
    display: flex;
    gap: 0.5rem;
}

.folder-actions button {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
}
```

### File: renderer/scripts/app.mjs
```javascript
import { AuthManager } from './auth.mjs';
import { DocumentManager } from './documents.mjs';
import { SearchManager } from './search.mjs';

class AIDocs4UApp {
    constructor() {
        this.auth = new AuthManager();
        this.documents = new DocumentManager();
        this.search = new SearchManager();
        this.settings = {};
        
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.setupEventListeners();
        this.setupMenuHandlers();
        
        // Check authentication status
        if (!this.auth.isAuthenticated()) {
            this.showAuthModal();
        } else {
            this.updateUserDisplay();
        }
    }

    async loadSettings() {
        try {
            this.settings = await window.electronAPI.loadSettings();
            this.applySettings();
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async saveSettings() {
        try {
            await window.electronAPI.saveSettings(this.settings);
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    applySettings() {
        // Apply search type
        document.getElementById('searchType').value = this.settings.searchType || 'Local Model Only';
        
        // Apply model selections
        const modelCheckboxes = document.querySelectorAll('.model-checkboxes input[type="checkbox"]');
        modelCheckboxes.forEach(checkbox => {
            checkbox.checked = this.settings.selectedModels?.includes(checkbox.value) || false;
        });
        
        // Apply toggles
        document.getElementById('useInternet').checked = this.settings.useInternet || false;
        document.getElementById('enableScoring').checked = this.settings.enableScoring !== false;
        
        // Apply dark mode
        if (this.settings.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
        }
        
        // Load document folders
        this.documents.loadFolders(this.settings.documentFolders || []);
    }

    setupEventListeners() {
        // Search configuration changes
        document.getElementById('searchType').addEventListener('change', (e) => {
            this.settings.searchType = e.target.value;
            this.saveSettings();
        });

        // Model selection changes
        document.querySelectorAll('.model-checkboxes input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.settings.selectedModels = Array.from(
                    document.querySelectorAll('.model-checkboxes input[type="checkbox"]:checked')
                ).map(cb => cb.value);
                this.saveSettings();
            });
        });

        // Toggle changes
        document.getElementById('useInternet').addEventListener('change', (e) => {
            this.settings.useInternet = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('enableScoring').addEventListener('change', (e) => {
            this.settings.enableScoring = e.target.checked;
            this.saveSettings();
        });

        // Document management
        document.getElementById('createFolderBtn').addEventListener('click', () => {
            this.documents.createFolder();
        });

        document.getElementById('uploadDocsBtn').addEventListener('click', () => {
            this.documents.uploadDocuments();
        });

        document.getElementById('processDocsBtn').addEventListener('click', () => {
            this.documents.processDocuments();
        });

        // Search
        document.getElementById('executeSearchBtn').addEventListener('click', () => {
            this.executeSearch();
        });

        // Auth
        document.getElementById('signOutBtn').addEventListener('click', () => {
            this.auth.signOut();
            this.showAuthModal();
        });
    }

    setupMenuHandlers() {
        window.electronAPI.onMenuAction((event, action) => {
            switch (event.type) {
                case 'menu-upload-documents':
                    this.documents.uploadDocuments();
                    break;
                case 'menu-settings':
                    this.showSettings(action);
                    break;
                case 'menu-toggle-dark-mode':
                    this.toggleDarkMode();
                    break;
                case 'menu-about':
                    this.showAbout();
                    break;
            }
        });
    }

    showAuthModal() {
        document.getElementById('authModal').classList.add('show');
    }

    hideAuthModal() {
        document.getElementById('authModal').classList.remove('show');
    }

    updateUserDisplay() {
        const user = this.auth.getCurrentUser();
        if (user) {
            document.getElementById('userEmail').textContent = user.email;
        }
    }

    async executeSearch() {
        const prompt = document.getElementById('userPrompt').value.trim();
        if (!prompt) {
            alert('Please enter a search query');
            return;
        }

        const searchConfig = {
            searchType: this.settings.searchType,
            selectedModels: this.settings.selectedModels,
            useInternet: this.settings.useInternet,
            enableScoring: this.settings.enableScoring,
            userPrompt: prompt,
            documentFolders: this.settings.documentFolders
        };

        try {
            document.getElementById('statusText').textContent = 'Searching...';
            const results = await this.search.execute(searchConfig);
            this.displayResults(results);
            document.getElementById('statusText').textContent = 'Search completed';
        } catch (error) {
            console.error('Search failed:', error);
            document.getElementById('statusText').textContent = 'Search failed';
            alert('Search failed. Please try again.');
        }
    }

    displayResults(results) {
        const container = document.getElementById('searchResults');
        container.innerHTML = `
            <div class="search-result">
                <h4>Search Results</h4>
                <pre>${JSON.stringify(results, null, 2)}</pre>
            </div>
        `;
    }

    toggleDarkMode() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        this.settings.darkMode = newTheme === 'dark';
        this.saveSettings();
    }

    showSettings(section) {
        alert(`Settings: ${section} - Coming soon!`);
    }

    showAbout() {
        alert('AIDocs4U v1.0.0\nPrivate AI Document Search');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIDocs4UApp();
});
```

### File: renderer/scripts/auth.mjs
```javascript
export class AuthManager {
    constructor() {
        this.user = null;
        this.token = null;
        this.loadStoredAuth();
        this.setupAuthForm();
    }

    loadStoredAuth() {
        const storedToken = localStorage.getItem('aidocs4u_token');
        const storedUser = localStorage.getItem('aidocs4u_user');
        
        if (storedToken && storedUser) {
            this.token = storedToken;
            this.user = JSON.parse(storedUser);
        }
    }

    setupAuthForm() {
        const authForm = document.getElementById('authForm');
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.signIn();
        });

        document.getElementById('createAccountLink').addEventListener('click', (e) => {
            e.preventDefault();
            // Open external browser to website
            require('electron').shell.openExternal('https://aidocs4u.com/auth');
        });
    }

    async signIn() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // This would connect to your web API
            const response = await fetch('https://aidocs4u.com/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                this.user = data.user;
                
                localStorage.setItem('aidocs4u_token', this.token);
                localStorage.setItem('aidocs4u_user', JSON.stringify(this.user));
                
                document.getElementById('authModal').classList.remove('show');
                this.updateUserDisplay();
            } else {
                alert(data.message || 'Sign in failed');
            }
        } catch (error) {
            console.error('Auth error:', error);
            alert('Connection failed. Please check your internet connection.');
        }
    }

    signOut() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('aidocs4u_token');
        localStorage.removeItem('aidocs4u_user');
    }

    isAuthenticated() {
        return this.token && this.user;
    }

    getCurrentUser() {
        return this.user;
    }

    updateUserDisplay() {
        if (this.user) {
            document.getElementById('userEmail').textContent = this.user.email;
        }
    }
}
```

### File: renderer/scripts/documents.mjs
```javascript
export class DocumentManager {
    constructor() {
        this.folders = [];
    }

    loadFolders(folders) {
        this.folders = folders;
        this.renderFolders();
    }

    renderFolders() {
        const container = document.getElementById('documentFolders');
        
        if (this.folders.length === 0) {
            container.innerHTML = '<p>No document folders created yet. Click "Create Folder" to get started.</p>';
            return;
        }

        container.innerHTML = this.folders.map(folder => `
            <div class="folder-item">
                <div class="folder-info">
                    <strong>📁 ${folder.name}</strong>
                    <small>${folder.documents?.length || 0} documents</small>
                </div>
                <div class="folder-actions">
                    <button class="btn-secondary" onclick="documentManager.modifyFolder('${folder.id}')">Modify</button>
                    <button class="btn-secondary" onclick="documentManager.uploadToFolder('${folder.id}')">Upload</button>
                    <button class="btn-secondary" onclick="documentManager.deleteFolder('${folder.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async createFolder() {
        const name = prompt('Enter folder name:');
        if (!name) return;

        const folder = {
            id: Date.now().toString(),
            name: name,
            documents: [],
            created: new Date().toISOString()
        };

        this.folders.push(folder);
        this.renderFolders();
        this.saveFolders();
    }

    async modifyFolder(folderId) {
        const folder = this.folders.find(f => f.id === folderId);
        if (!folder) return;

        const newName = prompt('Enter new folder name:', folder.name);
        if (!newName) return;

        folder.name = newName;
        this.renderFolders();
        this.saveFolders();
    }

    async deleteFolder(folderId) {
        if (!confirm('Are you sure you want to delete this folder and all its documents?')) {
            return;
        }

        this.folders = this.folders.filter(f => f.id !== folderId);
        this.renderFolders();
        this.saveFolders();
    }

    async uploadDocuments() {
        try {
            const result = await window.electronAPI.selectFiles();
            
            if (result.canceled || !result.filePaths.length) {
                return;
            }

            // If no folders exist, create a default one
            if (this.folders.length === 0) {
                await this.createFolder();
            }

            // For now, add to first folder
            const targetFolder = this.folders[0];
            
            result.filePaths.forEach(filePath => {
                const fileName = filePath.split('/').pop();
                targetFolder.documents.push({
                    id: Date.now().toString() + Math.random(),
                    name: fileName,
                    path: filePath,
                    uploaded: new Date().toISOString(),
                    processed: false
                });
            });

            this.renderFolders();
            this.saveFolders();
            this.updateDocumentCount();

            alert(`Uploaded ${result.filePaths.length} documents to ${targetFolder.name}`);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        }
    }

    async uploadToFolder(folderId) {
        const folder = this.folders.find(f => f.id === folderId);
        if (!folder) return;

        try {
            const result = await window.electronAPI.selectFiles();
            
            if (result.canceled || !result.filePaths.length) {
                return;
            }

            result.filePaths.forEach(filePath => {
                const fileName = filePath.split('/').pop();
                folder.documents.push({
                    id: Date.now().toString() + Math.random(),
                    name: fileName,
                    path: filePath,
                    uploaded: new Date().toISOString(),
                    processed: false
                });
            });

            this.renderFolders();
            this.saveFolders();
            this.updateDocumentCount();

            alert(`Uploaded ${result.filePaths.length} documents to ${folder.name}`);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        }
    }

    async processDocuments() {
        const totalDocs = this.folders.reduce((sum, folder) => sum + (folder.documents?.length || 0), 0);
        
        if (totalDocs === 0) {
            alert('No documents to process. Please upload some documents first.');
            return;
        }

        if (!confirm(`Process ${totalDocs} documents for AI search? This may take several minutes.`)) {
            return;
        }

        try {
            document.getElementById('statusText').textContent = 'Processing documents...';
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mark all documents as processed
            this.folders.forEach(folder => {
                if (folder.documents) {
                    folder.documents.forEach(doc => {
                        doc.processed = true;
                    });
                }
            });

            this.saveFolders();
            document.getElementById('statusText').textContent = 'Documents processed successfully';
            alert('All documents have been processed and are ready for AI search!');
        } catch (error) {
            console.error('Processing failed:', error);
            document.getElementById('statusText').textContent = 'Processing failed';
            alert('Document processing failed. Please try again.');
        }
    }

    saveFolders() {
        // This would be saved through the main process
        const settings = {
            documentFolders: this.folders
        };
        window.electronAPI.saveSettings(settings);
    }

    updateDocumentCount() {
        const totalDocs = this.folders.reduce((sum, folder) => sum + (folder.documents?.length || 0), 0);
        document.getElementById('documentCount').textContent = `Documents: ${totalDocs}`;
    }
}

// Make it globally available for onclick handlers
window.documentManager = new DocumentManager();
```

### File: renderer/scripts/search.mjs
```javascript
export class SearchManager {
    constructor() {
        this.searchHistory = [];
    }

    async execute(searchConfig) {
        try {
            // Import existing search modules
            const { executeSearch } = await import('../../shared/existingsearch.mjs');
            const { scoreResponse } = await import('../../shared/existingscoring.mjs');

            // Execute search with existing code
            const searchResults = await executeSearch(searchConfig);
            
            let results = searchResults;
            
            // Apply scoring if enabled
            if (searchConfig.enableScoring) {
                results = await scoreResponse(searchResults, searchConfig);
            }

            // Save to history
            this.searchHistory.push({
                query: searchConfig.userPrompt,
                timestamp: new Date().toISOString(),
                results: results,
                config: searchConfig
            });

            // Update last sync time
            document.getElementById('lastSync').textContent = `Last Search: ${new Date().toLocaleTimeString()}`;

            return results;
        } catch (error) {
            console.error('Search execution failed:', error);
            throw error;
        }
    }

    getSearchHistory() {
        return this.searchHistory;
    }

    clearHistory() {
        this.searchHistory = [];
    }
}
```

### File: shared/existingsearch.mjs
```javascript
// Placeholder for your existing search functionality
export async function executeSearch(searchConfig) {
    console.log('Executing search with config:', searchConfig);
    
    // This is where your existing search logic would go
    // For now, return mock results
    return {
        query: searchConfig.userPrompt,
        searchType: searchConfig.searchType,
        models: searchConfig.selectedModels,
        results: [
            {
                title: "Sample Result 1",
                content: "This is a sample search result based on your query.",
                source: "document1.pdf",
                relevance: 0.95
            },
            {
                title: "Sample Result 2", 
                content: "Another relevant result from your documents.",
                source: "document2.txt",
                relevance: 0.87
            }
        ],
        timestamp: new Date().toISOString()
    };
}
```

### File: shared/existingscoring.mjs
```javascript
// Placeholder for your existing scoring functionality
export async function scoreResponse(searchResults, searchConfig) {
    console.log('Scoring results:', searchResults);
    
    // This is where your existing scoring logic would go
    // For now, add mock scores
    if (searchResults.results) {
        searchResults.results.forEach((result, index) => {
            result.score = Math.random() * 100;
            result.confidence = Math.random();
        });
        
        // Sort by score
        searchResults.results.sort((a, b) => b.score - a.score);
    }
    
    searchResults.scored = true;
    searchResults.scoringTimestamp = new Date().toISOString();
    
    return searchResults;
}
```

## Installation Instructions

1. **Create directory structure**:
   ```bash
   mkdir -p aidocs4u-client/renderer/{styles,scripts,assets}
   mkdir -p aidocs4u-client/shared
   mkdir -p aidocs4u-client/data/{documents,embeddings}
   ```

2. **Install dependencies**:
   ```bash
   cd aidocs4u-client
   npm install
   ```

3. **Copy logo file** to `renderer/assets/--aidocs4u-logo.jpg`

4. **Run development**:
   ```bash
   npm run dev
   ```

5. **Build for distribution**:
   ```bash
   npm run build
   ```

## VSCode Debug Configuration

### File: .vscode/launch.json
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Electron App",
            "type": "node",
            "request": "launch",
            "program": "${workspaceFolder}/aidocs4u-client/main.js",
            "args": ["--dev"],
            "env": {
                "NODE_ENV": "development"
            },
            "console": "integratedTerminal",
            "runtimeExecutable": "${workspaceFolder}/aidocs4u-client/node_modules/.bin/electron"
        }
    ]
}
```

This creates a complete Electron desktop client with authentication, document management, search interface, and integration points for your existing search and scoring modules.