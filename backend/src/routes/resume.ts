import express, { Request, Response } from 'express';
import AWS from 'aws-sdk';

const router = express.Router();
const s3 = new AWS.S3();

router.get('/resume', async (_: Request, res: Response) => {
    try {
        if (!process.env.S3_BUCKET) {
            return res.status(500).json({ error: 'S3_BUCKET not configured' });
        }
        const params: AWS.s3.GetObjectRequest = {
            Bucket: process.env.S3_BUCKET,
            Key: 'resume.pdf'
        };

        const data = await s3.getObject(params).promise();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
        res.send(data.Body);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
});

export default router;
