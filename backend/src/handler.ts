import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import pdfFetchRoute from './routes/pdf';


if (process.env.NODE_ENV === 'dev') {
    console.log('LAMBDA STARTING - APP INITIALIZATION');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('S3_PDF_BUCKET:', process.env.S3_PDF_BUCKET);
}

const app = express();

const corsOptions = {
    origin: process.env.NODE_ENV === 'dev'
        ? '*'
        : ['https://faisals.ca', 'https://www.faisals.ca'],
    methods: ['GET'],
    credentials: false
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/pdf', pdfFetchRoute);

app.get('/api/health', (_: Request, res: Response) => {
    res.json({ status: 'ok' });
});

export const handler = serverless(app, {
    binary: ['application/pdf']
});
