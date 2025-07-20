import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import resumeRoute from './routes/resume';

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

app.get('/api/health', (_: Request, res: Response) => {
    res.json({ status: 'ok' });
});

module.exports.handler = serverless(app);
