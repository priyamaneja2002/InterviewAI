const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();
const defaultAllowedOrigins = [
    'http://localhost:5173',
    'https://interview-ai-phi-flax.vercel.app',
];

const allowedOrigins = (process.env.FRONTEND_URLS || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

const corsOrigins = allowedOrigins.length > 0 ? allowedOrigins : defaultAllowedOrigins;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: corsOrigins,
    credentials: true
}))

/* require all the routes here */
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes')


/* using all the routes here */ 
app.use('/api/auth', authRouter); 
app.use('/api/interview', interviewRouter)

module.exports = app;
