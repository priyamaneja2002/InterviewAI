<img width="1122" height="785" alt="Demo Image1" src="https://github.com/user-attachments/assets/4521183d-bd64-4032-86cc-0d40001ce219" />

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
- `google-auth-library` for verifying Google ID tokens (Sign in with Google)
- Zod for validating structured AI responses
- Puppeteer for generating resume PDFs

## Features

- User registration and login (email + password)
- Sign in with Google via Google Identity Services, with automatic account linking by email
- Display name pulled from the Google profile (first name + last name) for a personalized header greeting
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
- Marketing landing page at `/` with features, "how it works", and CTAs
- Account dropdown in the header (Profile, Logout) accessible from the user pill
- Profile page at `/profile` with:
  - Hero card showing avatar, first name, full name, email, username, and member-since date
  - Quick stats: total plans created, average match, highest match, and last activity
  - Full interview history with search, match-score filters (high/mid/low), and click-through to any saved plan
- Context-aware footer that swaps the Login / Register links for a single Profile link once you're signed in

## Project Structure

```text
InterviewAI/
├── Backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/        # auth.controller.js, interview.controller.js
│       ├── middlewares/
│       ├── models/             # user.model.js (incl. googleId, firstName, lastName, avatar), interviewReport.model.js, blacklist.model.js
│       ├── routes/
│       └── services/           # ai.service.js (Gemini + Puppeteer)
└── Frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── layout/         # Header (with account dropdown), Footer, Layout, ScrollToTop
        │   ├── feedback/       # ComingSoonModal
        │   └── loading/        # AIThinking
        ├── features/
        │   ├── auth/           # context, hooks, pages (Login/Register), GoogleAuthButton, utils
        │   ├── interview/      # Home (create plan) & Interview report pages
        │   ├── landing/        # Public marketing landing page
        │   └── profile/        # Profile page with stats + interview history
        ├── App.jsx
        ├── app.routes.jsx
        └── main.jsx
```

## How It Works

1. The user lands on the public landing page and either registers, logs in, or signs in with Google.
2. For Google sign-in, the frontend uses Google Identity Services to obtain an ID token, which the backend verifies with `google-auth-library`; the user's first and last name (from the Google profile) are stored on the user document and used as the display name in the header.
3. The frontend sends authenticated requests to the Express backend using a `httpOnly` cookie.
4. On the Create Plan page, the user uploads a resume (PDF) and pastes a job description. The backend extracts the resume text with `pdf-parse`.
5. Gemini generates a structured interview report; the report is validated with Zod and stored in MongoDB linked to the authenticated user.
6. The frontend displays the report in separate sections for technical questions, behavioral questions, and the day-by-day roadmap.
7. The user can generate and download a tailored resume PDF from any saved report.
8. The Profile page surfaces account info plus the user's full interview history with quick stats, search, and match-score filters.

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas or a local MongoDB instance
- A Google Gemini API key
- A Google OAuth 2.0 Web Client ID (only required if you want to enable "Sign in with Google")

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

### Backend (`Backend/.env`)

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
# Required only if you want to enable "Sign in with Google".
# Must match the same OAuth client used by the frontend.
GOOGLE_CLIENT_ID=your_google_oauth_web_client_id
```

### Frontend (`Frontend/.env`)

A `Frontend/.env.example` file is included; copy it to `Frontend/.env` and fill in the value.

```env
# Google OAuth 2.0 Web Client ID. Must match Backend GOOGLE_CLIENT_ID.
VITE_GOOGLE_CLIENT_ID=your_google_oauth_web_client_id
```

If `VITE_GOOGLE_CLIENT_ID` is missing, the Login/Register pages will show an inline notice explaining how to enable Google sign-in, but email + password sign-in will continue to work.

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

- `POST /api/auth/register` — create a new account with username, email, password
- `POST /api/auth/login` — email + password login
- `POST /api/auth/google` — exchange a Google ID token (`{ credential }`) for an authenticated session; creates or links a user by email
- `GET /api/auth/logout` — clears the auth cookie and blacklists the token
- `GET /api/auth/get-me` — returns the currently authenticated user (`userId`, `username`, `email`, `firstName`, `lastName`, `avatar`, `createdAt`)

### Interview

- `POST /api/interview/` — generate a new interview report from `resume` (PDF), `selfDescription`, and `jobDescription`
- `GET /api/interview/report/:interviewId` — fetch one interview report owned by the user
- `GET /api/interview/reports` — list all interview reports for the authenticated user (used by the Profile history)
- `POST /api/interview/resume/pdf/:interviewReportId` — generate and download a tailored resume PDF for a saved report

## Routes (Frontend)

| Path | Page | Access |
| --- | --- | --- |
| `/` | Landing | Public |
| `/login` | Login (with Google sign-in) | Public |
| `/register` | Register (with Google sign-in) | Public |
| `/create-plan` | Create a new interview plan | Protected |
| `/interview/:interviewId` | View a saved interview report | Protected |
| `/profile` | Profile + interview history | Protected |

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
- Add report deletion/editing from the Profile history
- Editable profile fields (first/last name, avatar) for email + password accounts
- Add mock interview or voice interview practice

## Author

Built by Priyam Aneja.
