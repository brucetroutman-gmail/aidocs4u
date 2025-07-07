# AIDocs4U Revised Plan - Two App Architecture

## Project Overview
**Mission**: AI-powered document search with complete local privacy
**Architecture**: Separate website and desktop client applications

---

## App 1: Website (aidocs4u.com)

### Purpose
Marketing, information, and user account management

### Technical Stack
- **Frontend**: Vanilla JavaScript ES6 modules (.mjs)
- **Backend**: Node.js 20+ with Express
- **Database**: MySQL (user accounts only)
- **Server**: Linux with NGINX + SSL

### Features
- **Marketing Pages**: Home, pricing, about, testimonials
- **User Management**: Sign up, sign in, account settings
- **Information Hub**: Knowledge base, tutorials, support
- **Download Portal**: Client app distribution

### Pages Structure
```
Home Page
├── Hero section with value proposition
├── Feature highlights (privacy, AI-powered, easy setup)
└── Call-to-action (download client)

Navigation Menu
├── Pricing (service tiers)
├── Services ▼
│   ├── Document Search
│   ├── AI Analysis
│   ├── Privacy Solutions
│   └── Enterprise Support
├── Explore ▼
│   ├── How We Got Here
│   └── What Our Customers Say
└── Support ▼
    ├── Knowledge Base
    ├── Tutorials
    └── Contact Us
```

### Database Schema
```sql
Users Table:
- id (PRIMARY KEY)
- email (UNIQUE)
- password_hash
- created_at
- last_login
- subscription_tier
```

---

## App 2: Desktop Client (Electron)

### Purpose
Local document processing and AI search

### Technical Stack
- **Framework**: Electron
- **Frontend**: HTML5/CSS3 + JavaScript ES6
- **AI Engine**: Ollama (5 local models)
- **Storage**: Local file system + SQLite
- **Platform**: Mac Mini (Silicon processor)

### Core Features

#### Authentication
- Sign in with website credentials
- Offline mode after initial authentication

#### Document Management
- Create/modify/delete document folders
- Upload documents (PDF, DOCX, TXT, MD)
- Local file organization and indexing

#### AI Search Configuration
- **Search Types**:
  - Local Model Only
  - My Documents Only  
  - My Documents + Local Model
- **Model Selection**: Up to 5 Ollama models (checkboxes)
- **Options**: Internet toggle, Scoring toggle

#### Search Interface
- User prompt input
- Execute search button
- Results display with scoring (if enabled)

#### Settings Menu
- General settings
- AI model configuration
- Document folder management
- Privacy settings
- Update software
- Dark mode toggle

### Local Data Storage
```
~/AIDocs4U/
├── documents/
│   ├── folder1/
│   └── folder2/
├── embeddings/
├── search_history.db
└── app_settings.json
```

---

## Integration Points

### Website → Client
- User downloads client from website
- Authentication credentials sync
- License/subscription validation

### Client → Website (Optional)
- Usage analytics (privacy-compliant)
- Update notifications
- Support ticket creation

### Existing Code Integration
```javascript
// Client app calls existing modules
import { executeSearch } from './existingsearch.mjs';
import { scoreResponse } from './existingscoring.mjs';

// Variables passed to existing code
const searchConfig = {
  searchType: String,
  selectedModels: Array,
  useInternet: Boolean,
  enableScoring: Boolean,
  userPrompt: String,
  documentFolders: Array
};
```

---

## Development Phases

### Phase 1: Website Foundation
- Basic website with marketing pages
- User authentication system
- Client download portal
- MySQL database setup

### Phase 2: Client MVP
- Electron app with basic UI
- Document upload and management
- Ollama integration
- Basic search functionality

### Phase 3: Advanced Features
- AI processing and embeddings
- Search scoring system
- Settings and configuration
- Error handling and logging

### Phase 4: Production Ready
- Security hardening
- Performance optimization
- User testing and feedback
- Deployment and distribution

---

## File Structure

### Website
```
aidocs4u-web/
├── client/
│   ├── index.html
│   ├── styles/
│   ├── scripts/
│   └── assets/
├── server/
│   ├── server.mjs
│   ├── routes/
│   └── middleware/
└── database/
    └── schema.sql
```

### Desktop Client
```
aidocs4u-client/
├── main.js (Electron main process)
├── renderer/
│   ├── index.html
│   ├── styles/
│   └── scripts/
├── preload.js
├── shared/
│   ├── existingsearch.mjs
│   └── existingscoring.mjs
└── package.json
```

---

## Key Benefits of This Architecture

1. **Clear Separation**: Website for marketing, client for functionality
2. **Privacy Focus**: All document processing stays local
3. **Scalability**: Website can handle many users, client runs locally
4. **Maintenance**: Independent updates for web and desktop
5. **Security**: Minimal data exchange between components

---

## Next Steps

1. Set up development environment
2. Create website foundation with user authentication
3. Build Electron client shell
4. Integrate Ollama and existing search modules
5. Test end-to-end workflow
6. Deploy and distribute