# AIDocs4U Technical Specifications

## Project Overview
**Mission**: Provide AI-powered document search and analysis while keeping personal data completely local and private.

**Architecture**: Hybrid web/desktop application with local AI processing via Ollama.

## System Architecture

### Core Components
1. **Web Application** (aidocs4u.com)
2. **Desktop Client** (Electron app)
3. **Local AI Engine** (Ollama + 5 models)
4. **Cloud Infrastructure** (NGINX + Express + MySQL)

## Technical Stack

### Frontend
- **Framework**: Vanilla JavaScript ES6 (modules)
- **Build**: Native ES6 modules (.mjs files)
- **UI**: Responsive HTML5/CSS3
- **Desktop**: Electron framework

### Backend
- **Server**: Node.js 20+ with Express
- **Database**: MySQL
- **Web Server**: NGINX with SSL
- **AI Engine**: Ollama (local)

### File Structure
```
aidocs4u/
├── client/
│   ├── index.html
│   ├── styles/
│   ├── scripts/
│   └── assets/
├── server/
│   ├── server.mjs
│   ├── routes/
│   └── middleware/
├── desktop/
│   ├── main.js
│   ├── renderer/
│   └── preload.js
└── shared/
    ├── existingsearch.mjs
    └── existingscoring.mjs
```

## Web Application Specifications

### Core Features
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Toggle functionality
- **Multi-language Support**: Language selector
- **User Authentication**: Sign In/Sign Up with MySQL

### Navigation Structure
```
Header: [Logo] [Language] [Dark/Light] [Sign In] [Sign Up]
Menu: [Home] [Pricing] [Services▼] [Explore▼] [Support▼]

Services Dropdown:
- Document Search
- AI Analysis  
- Data Insights
- Privacy Solutions
- Custom Integration
- Enterprise Support

Explore Dropdown:
- How We Got Here
- What Our Customers Say

Support Dropdown:
- Knowledge Base
- Tutorials
- Contact Us
```

### Pages Required
1. **Home**: Hero section + features
2. **Pricing**: Service tiers and costs
3. **About**: Company story
4. **Testimonials**: Customer feedback
5. **Knowledge Base**: Help articles
6. **Tutorials**: How-to guides
7. **Contact**: Support form

## Desktop Client Specifications

### Main Interface Components

#### 1. Authentication Panel
```javascript
const authConfig = {
  signIn: { email: String, password: String },
  signUp: { email: String, password: String, confirmPassword: String }
};
```

#### 2. Search Configuration Panel
```javascript
const searchConfig = {
  searchType: ['Local Model Only', 'My Documents Only', 'My Documents + Local Model'],
  selectedModels: [], // Up to 5 checkboxes
  useInternet: Boolean,
  enableScoring: Boolean
};
```

#### 3. Document Management Panel
```javascript
const documentConfig = {
  folders: [
    {
      id: String,
      name: String,
      documents: Array,
      created: Date,
      modified: Date
    }
  ],
  actions: ['create', 'modify', 'delete', 'upload']
};
```

#### 4. AI Processing Panel
```javascript
const aiConfig = {
  processDocuments: Function, // Embedding generation
  userPrompt: String,
  executeSearch: Function
};
```

#### 5. Settings Menu
```javascript
const settingsMenu = [
  'General Settings',
  'AI Model Config', 
  'Document Folders',
  'Privacy Settings',
  'Network Settings',
  'Performance',
  'Update Software',
  'Toggle Dark Mode'
];
```

## Data Models

### User Model
```javascript
const User = {
  id: Number,
  email: String,
  password: String, // Hashed
  created: Date,
  lastLogin: Date,
  preferences: Object
};
```

### Document Model
```javascript
const Document = {
  id: Number,
  userId: Number,
  folderId: Number,
  filename: String,
  filepath: String,
  filesize: Number,
  mimetype: String,
  uploaded: Date,
  processed: Boolean,
  embeddings: Array
};
```

### Search Model
```javascript
const Search = {
  id: Number,
  userId: Number,
  query: String,
  searchType: String,
  models: Array,
  useInternet: Boolean,
  enableScoring: Boolean,
  results: Object,
  timestamp: Date,
  duration: Number
};
```

## API Specifications

### Authentication Endpoints
```javascript
POST /api/auth/signin
POST /api/auth/signup
POST /api/auth/logout
GET  /api/auth/verify
```

### Document Management Endpoints
```javascript
GET    /api/documents
POST   /api/documents/upload
PUT    /api/documents/:id
DELETE /api/documents/:id
POST   /api/documents/process
```

### Search Endpoints
```javascript
POST /api/search/execute
GET  /api/search/history
POST /api/search/score
```

### Folder Management Endpoints
```javascript
GET    /api/folders
POST   /api/folders
PUT    /api/folders/:id
DELETE /api/folders/:id
```

## Integration Specifications

### Ollama Integration
```javascript
const ollamaConfig = {
  models: ['llama3', 'codellama', 'mistral', 'phi', 'gemma'],
  endpoint: 'http://localhost:11434',
  timeout: 30000
};
```

### Existing Code Integration
```javascript
// These modules must be called by the client
import { executeSearch } from './existingsearch.mjs';
import { scoreResponse } from './existingscoring.mjs';

const searchVariables = {
  searchType: String,
  selectedModels: Array,
  useInternet: Boolean,
  enableScoring: Boolean,
  userPrompt: String,
  documentFolders: Array
};
```

## Security Requirements

### Data Privacy
- All document processing happens locally
- No personal data transmitted to external servers
- Encrypted local storage for sensitive data
- User authentication via secure tokens

### Network Security
- HTTPS only for web application
- SSL certificate for aidocs4u.com
- Input validation and sanitization
- SQL injection prevention

## Performance Requirements

### Desktop Client
- **Startup Time**: < 3 seconds
- **Search Response**: < 10 seconds for local queries
- **Memory Usage**: < 2GB during normal operation
- **Storage**: Efficient document indexing

### Web Application
- **Page Load**: < 2 seconds
- **API Response**: < 500ms for standard queries
- **Concurrent Users**: Support 100+ simultaneous users

## Deployment Specifications

### Mac Mini Setup
1. Install Ollama + 5 AI models
2. Install Node.js 20+
3. Deploy Electron application
4. Configure local database
5. Set up document storage

### Cloud Infrastructure
- **Domain**: aidocs4u.com with SSL
- **Server**: Linux with NGINX + Express
- **Database**: MySQL with user management
- **Monitoring**: Performance and error tracking

## Development Phases

### Phase 1: Core Infrastructure
- Set up development environment
- Create basic web application structure
- Implement user authentication
- Database schema creation

### Phase 2: Desktop Client MVP
- Electron application setup
- Basic UI implementation
- Ollama integration
- Document upload functionality

### Phase 3: AI Integration
- Search functionality implementation
- Scoring system integration
- Performance optimization
- Testing framework

### Phase 4: Production Deployment
- Security hardening
- Performance tuning
- User acceptance testing
- Production deployment

## Testing Strategy

### Unit Testing
- API endpoint testing
- Database operations
- AI integration functions
- UI component testing

### Integration Testing
- End-to-end search workflows
- Authentication flows
- Document processing pipelines
- Cross-platform compatibility

### Performance Testing
- Load testing for web application
- Memory usage optimization
- Search response time benchmarking
- Concurrent user testing

## Maintenance & Updates

### Update Mechanism
- Automatic software updates via desktop client
- Model updates through Ollama
- Web application continuous deployment
- Database migration scripts

### Monitoring
- Application performance metrics
- Error logging and reporting
- User activity analytics (privacy-compliant)
- System resource monitoring