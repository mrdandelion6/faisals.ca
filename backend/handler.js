const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const resumeRoute = require('./routes/resume');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', resumeRoute);

app.get('/api/health', (_, res) => {
    res.json({ status: 'ok' });
});

module.exports.handler = serverless(app);
