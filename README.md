GhostShell

Your friendly ghost in the machine.

GhostShell is an AI-powered developer companion built to help developers debug code, understand errors, generate meaningful tests, review code changes, and learn programming concepts through conversation.

Powered by **Gemma through Ollama**, GhostShell combines a persistent AI chat experience with purpose-built developer tools in a dark, developer-focused interface.

 Find the ghost in your code. Understand the bug. Ship with confidence.

Features
AI Coding Companion — Ask programming questions, explore concepts, and get help debugging or designing projects.
Bug Detective — Analyze code errors, understand likely root causes, and get suggested fixes.
Test Generator — Generate unit tests with relevant edge cases for your code.
Diff Reviewer — Review code changes, identify potential bugs, and receive actionable suggestions.
Persistent Conversations — Save and revisit previous conversations using MongoDB.
Local AI Inference — Run Gemma locally through Ollama instead of relying on a hosted AI API.
Developer-Focused UI — A charcoal interface with muted gold and ghostly green accents.

 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, FastAPI |
| AI inference | Gemma, Ollama |
| Database | MongoDB |
| UI icons | Lucide React |

Architecture

```text
┌──────────────────────────────┐
│      React + Vite UI         │
│   Chat · Developer Tools     │
└──────────────┬───────────────┘
               │ HTTP API
               ▼
┌──────────────────────────────┐
│       FastAPI Backend        │
│ Chat · Debug · Tests · Diffs │
└──────────┬──────────┬────────┘
           │          │
           ▼          ▼
    ┌────────────┐ ┌────────────┐
    │  MongoDB   │ │   Ollama   │
    │  History   │ │   Gemma    │
    └────────────┘ └────────────┘
```
 Getting Started

Prerequisites

Install the following before running GhostShell:

- [Node.js](https://nodejs.org/)
- [Python 3.11+](https://www.python.org/)
- [MongoDB Community Server](https://www.mongodb.com/docs/manual/administration/install-community/)
- [Ollama](https://ollama.com/)

 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ghostshell.git
cd ghostshell
```

Replace `YOUR_USERNAME` with your GitHub username.

 2. Set up the AI model

Install and start Ollama, then download the model:

```bash
ollama pull gemma4:e2b
```

Ensure Ollama is running and the model is available locally.

 Configure the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` with the following configuration:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DATABASE=ghostshell
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=gemma4:e2b
FRONTEND_ORIGIN=http://localhost:5173
```

Start MongoDB before launching the backend.

On macOS with MongoDB installed through Homebrew:

```bash
brew services start mongodb/brew/mongodb-community@8.0
```

Run the API server:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://127.0.0.1:8000`.

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 4. Set up the frontend

Open a second terminal:

```bash
cd ~/Desktop/ghostshell/frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

 Developer Tools

GhostShell includes three purpose-built workflows:

 Bug Detective
Submit an error or code snippet to explore likely causes, understand the underlying issue, and receive suggested fixes.

Test Generator
Provide a function and specify a language or testing framework to generate tests covering normal behavior, boundary conditions, and invalid inputs.

Diff Reviewer
Submit a code diff to identify potential defects, assess their severity, and receive actionable review recommendations.

Note: AI-generated analysis and tests should be reviewed before being used in production. GhostShell does not claim to have executed code or tests unless execution is explicitly implemented and verified.

 Privacy and Security

GhostShell is designed around local AI inference:

- AI requests are sent to the configured Ollama instance.
- Conversation history is stored in the configured MongoDB database.
- The default development setup uses local services.

Local inference does not automatically guarantee complete privacy or security. Network configuration, logging, database access, and any future hosted deployment must be configured appropriately.



- [x] AI-powered conversational interface
- [x] Persistent conversation history
- [x] Error analysis workflow
- [x] Test generation workflow
- [x] Diff review workflow
- [ ] Automated code execution in an isolated sandbox
- [ ] Git repository integration
- [ ] Streaming AI responses
- [ ] Production deployment and hosted inference

 Contributing

Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them locally.
4. Submit a pull request describing the change.
