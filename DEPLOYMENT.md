# Deployment Guide for ALLAInOne

This guide covers deploying ALLAInOne to various platforms.

## Prerequisites

- Firebase project created and configured
- Firebase CLI installed (`npm install -g firebase-tools`)
- Environment variables configured

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest platform for deploying Next.js applications.

### Steps:

1. **Push your code to GitHub** (already done in this case)

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Add New Project"
   - Import your `yaegerbomb42/allainone` repository

3. **Configure Environment Variables**
   In Vercel's project settings, add these environment variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - You'll get a URL like `https://allainone.vercel.app`

5. **Configure Firebase Auth**
   - In Firebase Console, go to Authentication → Settings
   - Add your Vercel domain to "Authorized domains"

## Option 2: Deploy to Netlify

### Steps:

1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in and click "Add new site"
   - Import from GitHub

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Add Environment Variables**
   Same Firebase variables as above

4. **Deploy**
   - Netlify will build and deploy automatically

## Option 3: Self-Hosted (VPS/Cloud)

### Requirements:
- Node.js 18+
- PM2 or similar process manager

### Steps:

1. **Clone and Install**
   ```bash
   git clone https://github.com/yaegerbomb42/allainone.git
   cd allainone
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase credentials
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "allainone" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx (optional)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Firebase Configuration

### 1. Firestore Security Rules

Deploy the security rules from your project:

```bash
firebase login
firebase init firestore
# Select your project
# Use the default firestore.rules file
firebase deploy --only firestore:rules
```

### 2. Create Firestore Indexes (if needed)

If you encounter index errors in production:
- Firebase will provide a link in the error message
- Click the link to auto-create the required index
- Or manually create composite indexes in Firebase Console

### 3. Configure Authentication

In Firebase Console:
1. Go to Authentication → Sign-in method
2. Enable Email/Password provider
3. Add authorized domains (your deployment URL)

### 4. (Optional) Storage Rules

If you add file upload features later, deploy storage rules:

```bash
firebase deploy --only storage
```

## Post-Deployment Checklist

- [ ] Test login and signup flows
- [ ] Create a test account and add items
- [ ] Test the AI prompt interface
- [ ] Verify all navigation links work
- [ ] Test theme toggle
- [ ] Test data export
- [ ] Check mobile responsiveness
- [ ] Verify Firestore security rules are working
- [ ] Monitor Firebase usage quotas

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain | `my-app.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID | `my-app-12345` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket | `my-app.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | `1:123:web:abc` |

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Firebase configuration is correct
- Run `npm run build` locally first

### Authentication Not Working
- Verify authorized domains in Firebase Console
- Check that environment variables are correctly set
- Ensure Firebase Auth is enabled

### Firestore Permission Denied
- Deploy the latest firestore.rules
- Verify rules in Firebase Console
- Check that users are authenticated

### Slow Performance
- Enable Firebase caching
- Use Vercel's Edge Network
- Optimize image assets
- Consider Firebase Performance Monitoring

## Monitoring and Analytics

### Firebase Console
- Monitor authentication activity
- Check Firestore usage
- Review error logs

### Vercel Analytics (if using Vercel)
- Enable Web Analytics in project settings
- Monitor Core Web Vitals
- Track visitor metrics

## Costs

### Firebase (Free Tier)
- 50K reads/day
- 20K writes/day
- 20K deletes/day
- 1GB storage
- 10GB/month transfer

Typical usage for 100 active users: ~$0-5/month

### Vercel (Free Tier)
- 100GB bandwidth
- Unlimited deployments
- Automatic SSL

For hobby projects, free tier is sufficient!

## Support

For issues:
1. Check Firebase Console logs
2. Check Vercel deployment logs
3. Review browser console for client errors
4. Consult Firebase documentation
5. Check Next.js documentation

## Updates

To deploy updates:
1. Push changes to your GitHub repository
2. Vercel/Netlify will automatically redeploy
3. Or run deployment commands manually for self-hosted

## Backup

Firebase automatically backs up Firestore data, but you can:
1. Use the data export feature in Settings
2. Set up scheduled Firestore exports
3. Use Firebase's managed export service
