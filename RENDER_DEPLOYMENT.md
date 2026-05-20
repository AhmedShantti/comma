# Deploying Backend to Render

This guide walks through deploying the NestJS backend to Render.

## Prerequisites

- GitHub repository with the code pushed (already have this)
- Render account (create at https://render.com)
- Supabase database (already configured)
- Vercel frontend URL (from frontend deployment)

## Step 1: Create Render Account & Login

1. Go to https://render.com
2. Sign up with GitHub (recommended for easier integration)
3. Grant permission to access your repositories

## Step 2: Create a New Web Service

1. Click "New +" → "Web Service"
2. Select your GitHub repository (comma)
3. Set the following:
   - **Name**: `comma-pos-backend`
   - **Root Directory**: `POS`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: Free (to start) or Starter+ ($7/month)
   - **Region**: Select closest to your users

## Step 3: Configure Environment Variables

In the Render dashboard for your service, go to **Environment** tab and add:

```
NODE_ENV=production
PORT=3000
API_PREFIX=api/v1
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.gynfpdtkkuhoylgadujt.supabase.co:5432/postgres
REDIS_HOST=                          # (leave empty if not using Redis)
REDIS_PORT=6379
JWT_ACCESS_SECRET=[generate-random]   # Use: openssl rand -hex 32
JWT_ACCESS_EXPIRATION=30m
JWT_REFRESH_SECRET=[generate-random]  # Use: openssl rand -hex 32
JWT_REFRESH_EXPIRATION=7d
CORS_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:3001
FRONTEND_URL=https://your-vercel-app.vercel.app
THROTTLE_TTL=60
THROTTLE_LIMIT=100
RESTAURANT_NAME=COMMA Café & Lounge
RESTAURANT_NAME_AR=كوما كافيه ولاونج
ADDRESS=Cairo, Egypt
PHONE=+20123456789
VAT_RATE=15
TIMEZONE=Africa/Cairo
```

## Step 4: Generate Secure Secrets

Generate strong JWT secrets on your local machine:

```bash
# Generate JWT_ACCESS_SECRET (copy output)
openssl rand -hex 32

# Generate JWT_REFRESH_SECRET (copy output)
openssl rand -hex 32
```

Paste these values in the Render environment variables.

## Step 5: Handle Database Connection

### Option A: Use Existing Supabase Database (Recommended)

Your `DATABASE_URL` is already configured in `.env`:
```
DATABASE_URL=postgresql://postgres:Comma2026$$@db.gynfpdtkkuhoylgadujt.supabase.co:5432/postgres
```

Just add this to Render environment variables. The connection includes IPv4 support from `data-source.ts`.

### Option B: Create New Postgres Database on Render

1. In Render dashboard, click "New +" → "PostgreSQL"
2. Set name: `comma-postgres-db`
3. Render will provide a connection string automatically
4. Paste the provided connection string as `DATABASE_URL` environment variable

## Step 6: Update Frontend Environment

After backend is deployed, update the frontend to point to Render:

1. In `comma/` folder, update `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://comma-pos-backend.onrender.com/api/v1
```

2. Redeploy frontend to Vercel (git push triggers auto-redeploy)

## Step 7: Monitor Deployment

In Render dashboard:
- Watch the **Logs** tab during deployment
- Check for build errors or runtime issues
- Verify service is running (green status)
- Test API at: `https://comma-pos-backend.onrender.com/api/v1/docs` (Swagger)

## Step 8: Run Database Migrations

After successful deployment, run migrations:

```bash
# SSH into Render service and run:
npm run migration:run
```

Or manually via Render dashboard shell:
1. Go to your service page
2. Click "Shell" tab
3. Run: `cd POS && npm run migration:run`

## Troubleshooting

### Build Fails
- Check logs for specific error
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Database Connection Errors
- Check `DATABASE_URL` is correct
- Verify IP whitelist on Supabase (allow all: `0.0.0.0/0`)
- Test connection: `psql [DATABASE_URL]`

### CORS Errors
- Add frontend URL to `CORS_ORIGINS` environment variable
- Include both `http://localhost:3001` and production URL

### Port Issues
- Render assigns port dynamically; must listen on `process.env.PORT || 3000`
- Already configured in `main.ts`

## Helpful Commands

```bash
# Generate secure random string for JWT secrets
openssl rand -hex 32

# Test backend locally with production-like environment
NODE_ENV=production npm run build
npm run start:prod

# View logs in Render
# Use dashboard Logs tab or SSH into service shell
```

## Cost

- **Free Tier**: $0/month
  - Web services auto-spin down after 15 min inactivity
  - ~550 free compute hours/month
  - Good for dev/testing

- **Starter+**: $7/month
  - Always running
  - Recommended for production

- **Postgres**: $15/month
  - If creating new DB on Render
  - Or use existing Supabase (included in your plan)

## Next Steps

1. Deploy backend to Render
2. Test API: `curl https://comma-pos-backend.onrender.com/api/v1/docs`
3. Update frontend `.env.local` with backend URL
4. Redeploy frontend
5. Test full integration
6. Remove mock data from MenuClient when backend is stable
