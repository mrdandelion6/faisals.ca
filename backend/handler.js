const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const resumeRoute = require('./routes/resume');

const app = express();

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://faisals.ca', 'https://www.faisals.ca']
        : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'],
    methods: ['GET'],
    credentials: false
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api', resumeRoute);

app.get('/api/health', (_, res) => {
    res.json({ status: 'ok' });
});

module.exports.handler = serverless(app);
