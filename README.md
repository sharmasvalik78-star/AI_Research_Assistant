# AI Research Assistant Pro

AI Research Assistant Pro is a full-stack AI-powered research assistant designed to help users upload research documents, search and retrieve relevant information, interact with documents using AI, organize research projects, create notes, analyze research activity, and generate shareable research reports.

## Overview

AI Research Assistant Pro combines Retrieval-Augmented Generation (RAG), vector search, document processing, and Google's Gemini AI to provide an intelligent research workspace.

The application allows users to:

- Register and log in securely
- Upload research documents
- Parse and process documents
- Search documents using semantic similarity
- Ask questions about uploaded research
- Receive AI-generated answers using document context
- Organize research into projects
- Manage research chat sessions
- Create and manage research notes
- View research analytics
- Generate research reports
- Share research reports publicly
- Reset forgotten passwords
- Use the application in dark mode

---

## Key Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Current-user authentication
- Forgot password functionality
- Secure password reset token system

### Document Management

- Upload research documents
- Document parsing
- Text extraction
- Text chunking
- Document-specific processing
- Document selection
- Document management

### AI-Powered Research Chat

- AI research assistant
- Document-specific questions
- Retrieval-Augmented Generation (RAG)
- Context-aware answers
- Gemini AI integration
- Relevant document retrieval
- Research conversation history

### Semantic Search

- ChromaDB vector database
- Document embeddings
- Similarity-based retrieval
- Document-specific filtering
- Efficient research information retrieval

### Research Projects

- Create research projects
- Organize documents by project
- Manage research workspaces
- Research notes
- Project-specific research content

### Analytics

- Research activity analytics
- Dashboard statistics
- Analytics filtering
- Research insights
- Data visualization

### Research Reports

- Generate research reports
- Public shareable reports
- Project-based report access
- Research report presentation

### User Experience

- Modern responsive interface
- Dark mode
- Light mode
- Chat interface
- Auto-scrolling conversations
- Keyboard-friendly interaction
- Loading states
- Error states
- Accessibility improvements

---

## System Architecture

```text
                         +-------------------+
                         |       User        |
                         +---------+---------+
                                   |
                                   v
                         +-------------------+
                         | React Frontend    |
                         | Vite              |
                         | Tailwind CSS      |
                         +---------+---------+
                                   |
                                 Axios
                                   |
                                   v
                         +-------------------+
                         | FastAPI Backend   |
                         +---------+---------+
                                   |
                  +----------------+----------------+
                  |                |                |
                  v                v                v
          +---------------+ +---------------+ +---------------+
          |  PostgreSQL   | |   ChromaDB    | |  Gemini API   |
          |   Database    | | Vector Store  | |      AI       |
          +---------------+ +---------------+ +---------------+
                  |                |                |
                  +----------------+----------------+
                                   |
                                   v
                         +-------------------+
                         | Research Results  |
                         +-------------------+
