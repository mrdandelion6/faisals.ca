import express, { Request, Response } from 'express';
import AWS from 'aws-sdk';

if (process.env.NODE_ENV === 'dev') {
    console.log('PDF ROUTES MODULE LOADING')
}

const router = express.Router();
const s3 = new AWS.S3();

async function fetch_pdf(pdf_name: string, res: Response) {
    try {
        if (process.env.NODE_ENV === 'dev') {
            console.log('PDF fetch endpoint hit!');
        }

        if (!process.env.S3_PDF_BUCKET) {
            return res.status(500).json({ error: 'S3_PDF_BUCKET not configured' });
        }

        const params: AWS.S3.GetObjectRequest = {
            Bucket: process.env.S3_PDF_BUCKET,
            Key: pdf_name
        };


        if (process.env.NODE_ENV === 'dev') {
            console.log(`Fetching from S3 bucket: ${process.env.S3_PDF_BUCKET}`);
        }

        // set headers before piping
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${pdf_name}`);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Content-Transfer-Encoding', 'binary');

        // create s3 stream and pipe directly to response
        const s3Stream = s3.getObject(params).createReadStream();

        // handle stream errors
        s3Stream.on('error', (error) => {
            console.error('S3 stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    error: 'Failed to fetch PDF',
                    details: process.env.NODE_ENV === 'dev' ? error.message : undefined
                });
            }
        });

        try {
            const headData = await s3.headObject(params).promise();
            if (headData.ContentLength) {
                res.setHeader('Content-Length', headData.ContentLength.toString());
            }
            if (process.env.NODE_ENV === 'dev') {
                console.log('Content-Length set to:', headData.ContentLength);
            }

        } catch (headError) {
            console.warn('Could not get content length:', headError);
        }

        if (process.env.NODE_ENV === 'dev') {
            console.log('=== STREAMING RESPONSE ===');
            console.log('Piping S3 stream directly to response');
        }

        // pipe s3 stream directly to response
        s3Stream.pipe(res);

    } catch (error: unknown) {
        console.error('Error fetching PDF:', error);
        const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';

        if (!res.headersSent) {
            res.status(500).json({
                error: 'Failed to fetch PDF',
                details: process.env.NODE_ENV === 'dev' ? errorMessage : undefined
            });
        }
    }
}

router.get('/gpu-resume', async (_: Request, res: Response) => {
    if (process.env.NODE_ENV === 'dev') {
        console.log('=== GPU RESUME ENDPOINT HIT ===');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('S3_PDF_BUCKET:', process.env.S3_PDF_BUCKET);
    }
    fetch_pdf('gpu-resume.pdf', res);
});

router.get('/ta-resume', async (_: Request, res: Response) => {
    if (process.env.NODE_ENV === 'dev') {
        console.log('=== TA RESUME ENDPOINT HIT ===');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('S3_PDF_BUCKET:', process.env.S3_PDF_BUCKET);
    }
    fetch_pdf('ta-resume.pdf', res);
});

export default router;
