# NatureJournal

A full-stack application for documenting immersive nature sessions and analyzing emotional states using Large Language Models (LLM).

## Features
- **Authentication**: JWT-based secure login and registration using HTTP-only cookies.
- **Journal Entries**: Document your nature experiences with selected ambiences (Forest, Ocean, Mountain).
- **LLM Emotion Analysis**: Automatically extract emotions, keywords, and summaries from your entries using the Groq API.
- **Insights Dashboard**: Track your most frequent emotions, ambiences, and total journals.
- **Modern UI**: Clean, nature-themed design with smooth Framer Motion animations.

## Tech Stack
### Frontend
- React 18 (Vite)
- Tailwind CSS v3 (Styling)
- Framer Motion (Animations)
- Axios (API Client)
- React Router DOM
- React Icons

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (Password Hashing)
- Groq API SDK (LLM Integration)
- cookie-parser & cors

---

## Complete Local Setup Guide

Follow these instructions to run the project on your local machine.

### Prerequisites
Before you begin, ensure you have the following installed on your system:
- **Node.js** (v18 or higher recommended) - [Download Node.js](https://nodejs.org/)
- **MongoDB** (Local instance or MongoDB Atlas cluster URI)
- **Git** (for cloning the repository)
- A **Groq API Key** (Get free access at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd ArvyaXAssignmnet
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

#### Environment Variables (.env)
Create a `.env` file in the `backend/` directory by copying `.env.example` (if present) or creating a new file:
```env
# Server running port
PORT=3000

# MongoDB Connection String (Replace with your own if using Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/nature_journal

# JWT Secret Key for signing tokens (Use a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Groq API Key for LLM Analysis
GROQ_API_KEY=gsk_your_groq_api_key_here

# Client URL for CORS
VITE_API_BASE_URL=http://localhost:5173
```

#### Start the Backend Server
```bash
npm run dev
```
You should see:
```text
Server is running on Port 3000
Connected to database
```

### 3. Frontend Setup
Open a **new terminal window** (leave the backend running) and navigate to the frontend directory:
```bash
cd frontend
npm install
```

#### Environment Variables (.env)
Create a `.env` file in the `frontend/` directory:
```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Start the Frontend Server
```bash
npm run dev
```
You should see:
```text
  VITE v8.x.x  ready in 1500 ms

  ➜  Local:   http://localhost:5173/
```

### 4. Open Application
Open your browser and navigate to `http://localhost:5173`. You can now register a new account, write a journal, and analyze it!

---

## API Endpoints Overview
| HTTP Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate and receive cookie | Public |
| `POST` | `/api/auth/logout` | Clear auth cookie | Public |
| `POST` | `/api/journal/analyze` | Analyze journal text with LLM | Protected |
| `POST` | `/api/journal` | Save a new journal entry | Protected |
| `GET` | `/api/journal` | Retrieve all user journals | Protected |
| `GET` | `/api/journal/insights` | Get user statistics | Protected |

## Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📬 Contact

**Saksham Chaurasiya**
- **LinkedIn:** [linkedin.com/in/saksham-chaurasiya-14f](https://www.linkedin.com/in/saksham-chaurasiya-14f/)
- **GitHub:** [@SakshamChaurasiya](https://github.com/SakshamChaurasiya)

## License
Distributed under the MIT License.
