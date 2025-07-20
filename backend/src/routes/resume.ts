const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

router.get('/resume', async (_, res) => {
    try {
        const params = {
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

module.exports = router;
