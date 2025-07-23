# Deployment Guide

This project is a personal website that serves PDF documents from an Express.js backend to a React frontend. The website is currently in development and may appear minimal , but it demonstrates a full-stack deployment architecture.

## Project Overview

**What it does:**
- **Frontend**: React website hosted on GitHub Pages with client-side routing
- **Backend**: Express.js API running on AWS Lambda that serves PDF files from S3
- **PDF Serving**: The backend fetches PDFs from an S3 bucket and streams them to the frontend for viewing/downloading

**Current Features:**
- Displays PDFs in the browser with download functionality
- Example endpoints: `/ta-resume` and `/gpu-resume` serve corresponding PDF files
- Responsive design with navigation

The website may look basic now since it's primarily a proof-of-concept for the deployment architecture , but it provides a solid foundation for a personal portfolio site. I'll add more stuff later.

## Project Structure

```
/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Express.js + Node.js + Serverless Framework
└── .github/workflows/ # GitHub Actions CI/CD
```

## Prerequisites

- **Node.js** (v22+)
- **npm**
- **AWS CLI** configured locally
- **Serverless Framework** CLI
- **GitHub repository**
- **Custom domain** (e.g., Namecheap)

## 1. Environment Variables Setup

### Backend Environment Variables

Create [`backend/.env`](backend/.env):
```bash
SERVERLESS_ACCESS_KEY=YOUR_KEY
S3_PDF_BUCKET=YOUR_BUCKET
```

**Getting these values:**
- **SERVERLESS_ACCESS_KEY**: You need a Serverless Framework v4 access key. If you don't have one , run `npm run deploy:dev` and it will prompt you to register (it's free).
- **S3_PDF_BUCKET**: Create an S3 bucket on AWS. See [AWS S3 Getting Started](https://aws.amazon.com/s3/getting-started/).

### Frontend Environment Variables

Create [`frontend/.env.development`](frontend/.env.development):
```bash
VITE_API_BASE_URL=https://your-dev-api-gateway-url.amazonaws.com/dev/
```

You'll get this dev API Gateway URL after running `npm run deploy:dev` for the first time. For production , you'll need a separate production API Gateway URL (configured later as a GitHub Secret).

### AWS CLI Configuration

Configure your AWS credentials locally:
```bash
aws configure
# enter your AWS access key id
# enter your AWS secret access key
# set region to us-east-1 (or your preferred region)
```

### AWS Lambda IAM Role (Optional)

Your Lambda function might need additional S3 permissions. The deployment may work without this , but if you encounter S3 permission errors , create an IAM role with this policy:

```json
{
   "Version": "2012-10-17",
   "Statement": [
      {
         "Effect": "Allow",
         "Action": [
            "s3:GetObject",
            "s3:GetObjectVersion"
         ],
         "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      },
      {
         "Effect": "Allow",
         "Action": "s3:ListBucket",
         "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
      }
   ]
}
```

Replace `YOUR_BUCKET_NAME` with your actual S3 bucket name. Attach this policy to your Lambda execution role if needed.

## 2. GitHub Secrets Configuration

Before setting up automated deployment , configure these secrets in your GitHub repository:

Go to **Settings** -> **Secrets and variables** -> **Actions** -> **Repository secrets**

Add these secrets:

**AWS Credentials:**
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret access key

**Backend Configuration:**
- `S3_PDF_BUCKET` - Your S3 bucket name for PDF storage
- `SERVERLESS_ACCESS_KEY` - Your Serverless Framework access token

**Frontend Configuration:**
- `VITE_API_BASE_URL_PROD` - Your production API Gateway URL (get this after first backend deployment)

## 3. Local Development Setup

### Backend Setup
```bash
cd backend
npm install

# deploy express.js app to AWS lambda dev environment
npm run deploy:dev
```

**Note the dev API Gateway URL** from the deployment output and update your [`frontend/.env.development`](frontend/.env.development) with this URL. Future runs won't generate a new endpoint , they should just update the existing one.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev # start development server
```

## 4. Production Deployment Setup

### GitHub Repository Configuration

#### Enable GitHub Actions Permissions
1. Go to **Settings** -> **Actions** -> **General**
2. Under "Workflow permissions" , select **"Read and write permissions"**
3. Check **"Allow GitHub Actions to create and approve pull requests"**
4. Save

### GitHub Pages Setup

#### Enable GitHub Pages
1. Go to **Settings** -> **Pages**
2. Set **Source** to **"Deploy from a branch"**
3. Select **`gh-pages` branch** and **`/ (root)`** folder
4. Save

#### Configure Custom Domain
1. In the **Custom domain** field , enter your domain (e.g., `faisals.ca`)
2. Save
3. **Check "Enforce HTTPS"** (after DNS propagates)

### DNS Configuration (Namecheap/Domain Provider)

Add these DNS records for your domain:

**A Records (point @ to GitHub Pages):**
- Host: `@` -> Value: `185.199.108.153`
- Host: `@` -> Value: `185.199.109.153`
- Host: `@` -> Value: `185.199.110.153`
- Host: `@` -> Value: `185.199.111.153`

**CNAME Record (www subdomain):**
- Host: `www` -> Value: `yourdomain.com`

### Required Project Files

This repository should already contain these files. If any are missing , create them:

- **[`frontend/public/CNAME`](frontend/public/CNAME)** - Contains your custom domain
- **[`frontend/public/404.html`](frontend/public/404.html)** - Handles client-side routing for GitHub Pages
- **[`frontend/index.html`](frontend/index.html)** - Should include SPA routing script in `<head>`
- **[`vite.config.js`](vite.config.js)** - Vite configuration with `base: '/'` for custom domain
- **[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)** - GitHub Actions workflow for automated deployment

## 5. Getting Your API Gateway URLs

### Development API URL
After your first backend dev deployment:
```bash
cd backend
npm run deploy:dev
```

**Note the dev API Gateway URL** from the output and update [`frontend/.env.development`](frontend/.env.development).

### Production API URL
After your first backend production deployment:
```bash
cd backend
npm run deploy:prod
```

**Note the production API Gateway URL** from the output (looks like: `https://abc123.execute-api.us-east-1.amazonaws.com/prod/`)

**Add this production URL as a GitHub Secret**:
- Go to **Settings** -> **Secrets and variables** -> **Actions** -> **Repository secrets**
- Add `VITE_API_BASE_URL_PROD` with your production API Gateway URL

## 6. Deployment Process

### Automatic Deployment (Recommended)
1. **Push to main branch**: `git push origin main`
2. **GitHub Actions will automatically**:
   - Deploy backend to AWS Lambda
   - Build and deploy frontend to GitHub Pages
3. **Monitor progress** in the **Actions** tab

### Manual Deployment
```bash
# backend only
cd backend
npm run deploy:prod # deploy express.js app to AWS lambda production

# frontend only (after backend is deployed)
cd frontend
npm run build
# manual upload to github pages or other hosting
```

## Verification Steps

### 1. Check DNS Propagation
```bash
nslookup yourdomain.com
# should return github pages ip addresses
```

### 2. Test URLs
- **Root**: `https://yourdomain.com`
- **API**: `https://your-api-gateway-url/prod/api/health`
- **Routes**: `https://yourdomain.com/your-routes`

### 3. Check GitHub Actions
- Go to **Actions** tab in your repository
- Verify both jobs completed successfully
- Check for any error messages

## Troubleshooting

### Common Issues

**Missing Environment Variables:**
- Ensure all `.env` files are created locally with correct values
- Verify all GitHub Secrets are configured
- Check that `VITE_API_BASE_URL_PROD` matches your actual API Gateway URL

**404 on Routes:**
- Ensure `404.html` and routing script are properly configured
- Verify GitHub Pages is set to deploy from `gh-pages` branch

**API Errors:**
- Check AWS credentials in GitHub Secrets
- Verify `VITE_API_BASE_URL_PROD` points to correct API Gateway URL
- Ensure CORS is properly configured in Express.js backend ([`backend/src/handler.ts`](backend/src/handler.ts))
- Check Express.js routes and middleware configuration
- If you get S3 permission errors , ensure your Lambda function has the proper IAM role (see AWS Lambda IAM Role section above)

**DNS Issues:**
- DNS propagation can take up to 24 hours
- Use online DNS checkers to verify propagation
- Ensure DNS records point to correct GitHub Pages IPs

**Build Failures:**
- Check GitHub Actions logs for detailed error messages
- Verify all required secrets are configured
- Ensure Node.js versions match between local and CI

### Support Commands

```bash
# check dns
dig yourdomain.com

# test api locally
curl https://your-api-gateway-url/prod/api/health

# view github actions logs
# go to actions tab -> click on failed workflow -> view logs
```

## Security Notes

- Never commit `.env` files containing secrets
- Use GitHub Secrets for all sensitive data
- Rotate AWS credentials periodically
- Enable HTTPS enforcement on GitHub Pages
- Don't add a GitHub Secret for dev API endpoint

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Serverless Framework Docs](https://www.serverless.com/framework/docs/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)

## Adding New PDF Endpoints

To add new PDF documents to your website:

### 1. Upload PDF to S3
```bash
# upload your new pdf with a descriptive name
aws s3 cp my-new-document.pdf s3://YOUR_BUCKET_NAME/my-new-document.pdf
```

### 2. Add Backend Route
In [`backend/src/routes/pdf.ts`](backend/src/routes/pdf.ts) , add a new route:
```javascript
router.get('/my-new-document', async (_: Request, res: Response) => {
   if (process.env.NODE_ENV === 'dev') {
      console.log('=== MY NEW DOCUMENT ENDPOINT HIT ===');
   }
   fetch_pdf('my-new-document.pdf', res);  // Must match S3 filename
});
```

### 3. Add Frontend Route
In [`frontend/src/App.tsx`](frontend/src/App.tsx) , add a new route:
```javascript
<Route path="/my-new-document" element={<PDFViewer pdf_endpoint="my-new-document" />} />
```

### 4. Add Navigation (Optional)
Add the new page to your navigation in [`frontend/src/App.tsx`](frontend/src/App.tsx):
```javascript
const leftButtons: NavBarButtonProps[] = [
   { children: "Home", href: "/" },
   { children: "My Document", href: "/my-new-document" },
   // ... other buttons
]
```

### 5. Deploy
```bash
# deploy backend changes
cd backend
npm run deploy:prod

# frontend will deploy automatically when you push to main
git add .
git commit -m "Add new PDF endpoint"
git push origin main
```

**Important Notes:**
- The S3 filename , backend route name , and frontend endpoint must all match
- PDF files should use descriptive , URL-friendly names (no spaces , use hyphens)
- Remember to redeploy both backend and frontend after making changes
- Test locally first with `npm run deploy:dev` and `npm run dev`

**Example naming convention:**
- S3 file: `project-portfolio.pdf`
- Backend route: `/project-portfolio`
- Frontend route: `/project-portfolio`
- Navigation: "Project Portfolio"
