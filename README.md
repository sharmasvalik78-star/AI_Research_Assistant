# AI Research Assistant

An AI-powered Research Assistant built using React, FastAPI, ChromaDB, and JWT Authentication.

## Features

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Research Chat
* Document Upload
* ChromaDB Vector Storage
* Code Generator
* Viva Question Generator
* Dashboard Analytics
* Logout Functionality

## Technology Stack

### Frontend

* React
* Vite
* Axios
* React Router DOM

### Backend

* FastAPI
* SQLAlchemy
* JWT Authentication
* ChromaDB
* SQLite

## Project Structure

AI_Research_Assistant/

├── backend/

├── frontend/

├── uploads/

└── README.md

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Application Modules

### Dashboard

Displays AI statistics, vector count, document count, and uploaded files.

### Research Chat

Ask questions from uploaded documents using Retrieval-Augmented Generation (RAG).

### Upload Documents

Upload PDF, DOCX, and PPTX files for processing.

### Code Generator

Generate code snippets using AI.

### Viva Generator

Generate viva questions and answers automatically.

### Authentication

Secure Login, Register, Logout, and Protected Routes.

## Future Improvements

* User Profile Management
* Cloud Storage
* Multi-user Document Isolation
* Advanced Analytics
* Deployment Monitoring

## Author

Sharmasvali k
