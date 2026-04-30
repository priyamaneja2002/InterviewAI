# InterviewAI

InterviewAI is a full-stack web application that helps users prepare for interviews by turning a job description and resume into a personalized interview strategy. It uses AI to analyze candidate-job fit, generate likely interview questions, identify skill gaps, build a preparation roadmap, and create a tailored resume PDF.

## What This Project Does

After signing in, a user can paste a target job description, upload their resume, and generate a custom interview report. The app then produces:

- A match score for the role
- Technical interview questions with model answers
- Behavioral interview questions with model answers
- Skill gap analysis with severity levels
- A day-wise preparation roadmap
- A downloadable, ATS-friendly resume PDF tailored to the target job

It also stores previous interview reports so users can revisit them later.

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Sass
- Context API for global auth/interview state

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT authentication with cookies
- bcryptjs for password hashing
- Multer for file uploads
- `pdf-parse` for extracting resume text from PDFs
- Google Gemini via `@google/genai`
- Zod for validating structured AI responses
- Puppeteer for generating resume PDFs

## Features

- User registration and login
- Cookie-based authentication
- Protected routes for authenticated users
- Resume upload and parsing
- AI-generated interview report based on resume, self-description, and job description
- Match score calculation
- Technical and behavioral question generation
- Skill gap detection with severity indicators
- Day-by-day interview preparation plan
- Resume PDF generation tailored to a specific job
- Recent report history on the dashboard

## Project Structure

```text
InterviewAI/
├── Backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
└── Frontend/
    ├── public/
    └── src/
        ├── features/
        │   ├── auth/
        │   └── interview/
        ├── App.jsx
        ├── app.routes.jsx
        └── main.jsx
```

## How It Works

1. The user registers or logs in.
2. The frontend sends authenticated requests to the Express backend.
3. The backend reads the uploaded resume PDF and extracts the text.
4. Gemini generates a structured interview report.
5. The report is validated with Zod and stored in MongoDB.
6. The frontend displays the report in separate sections for technical questions, behavioral questions, and roadmap.
7. The user can generate and download a tailored resume PDF from the saved report.

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas or a local MongoDB instance
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd InterviewAI
```

### 2. Install dependencies

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd ../Frontend
npm install
```

## Environment Variables

Create a `Backend/.env` file with:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
```

## Run Locally

Start the backend:

```bash
cd Backend
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd Frontend
npm run dev
```

Then open:

[`http://localhost:5173`](http://localhost:5173)

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/logout`
- `GET /api/auth/get-me`

### Interview

- `POST /api/interview/`
- `GET /api/interview/report/:interviewId`
- `GET /api/interview/reports`
- `POST /api/interview/resume/pdf/:interviewReportId`

## Important Notes

- The frontend currently expects the backend to run on `http://localhost:3000`.
- The backend CORS configuration currently expects the frontend on `http://localhost:5173`.
- Authentication is handled with cookies, so frontend and backend should be run with the local URLs above during development.
- The backend currently parses resume PDFs, so using PDF resumes is the safest supported flow.
- There are no automated tests configured yet in the repository.

## Why This Project Is Useful

This project goes beyond a basic interview-prep app by combining:

- AI-based role matching
- interview-specific preparation content
- resume tailoring
- persistent report history

That makes it useful both as a user-facing product idea and as a strong portfolio project that demonstrates full-stack development, AI integration, authentication, file handling, PDF generation, and database design.

## Possible Future Improvements

- Add better form validation and error handling
- Support DOCX resume parsing
- Add loading progress and toast notifications
- Deploy frontend and backend with environment-based API URLs
- Add unit and integration tests
- Add report deletion/editing
- Add mock interview or voice interview practice

## Author

Built by Priyam Aneja.
