# Render Backend Deployment Checklist

## Pre-Deployment

- [ ] Code pushed to GitHub (main branch)
- [ ] Backend builds locally: `cd POS && npm run build`
- [ ] Database migrations are up-to-date: `npm run migration:run`
- [ ] Supabase database URL confirmed in `.env`
- [ ] Generated secure JWT secrets (using `openssl rand -hex 32`)

## Render Setup

- [ ] Render account created (https://render.com)
- [ ] GitHub repository connected
- [ ] New Web Service created with:
  - Name: `comma-pos-backend`
  - Root Directory: `POS`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm run start:prod`

## Environment Variables (in Render)

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `API_PREFIX` = `api/v1`
- [ ] `DATABASE_URL` = Supabase connection string
- [ ] `JWT_ACCESS_SECRET` = [random 32-byte hex]
- [ ] `JWT_REFRESH_SECRET` = [random 32-byte hex]
- [ ] `JWT_ACCESS_EXPIRATION` = `30m`
- [ ] `JWT_REFRESH_EXPIRATION` = `7d`
- [ ] `FRONTEND_URL` = Vercel frontend URL
- [ ] `CORS_ORIGINS` = Vercel URL + localhost (for testing)
- [ ] Restaurant config variables set

## Post-Deployment

- [ ] Service shows "Live" status in Render dashboard
- [ ] Test health check: `curl https://comma-pos-backend.onrender.com/api/v1/health`
- [ ] Test API docs: Open `https://comma-pos-backend.onrender.com/api/v1/docs`
- [ ] Database migrations run (via Render shell or dashboard)
- [ ] Logs show no errors
- [ ] Update frontend `.env.local`:
  ```
  NEXT_PUBLIC_API_URL=https://comma-pos-backend.onrender.com
  ```
- [ ] Redeploy frontend to Vercel (git push)
- [ ] Test login on frontend: Use credentials from demo accounts
- [ ] Test dashboard loads data from backend
- [ ] Test menu page with real backend data (if desired)

## Monitoring

- [ ] Set up Render alerts for deployment failures
- [ ] Monitor database connection health
- [ ] Watch for CORS errors in browser console
- [ ] Check backend response times
- [ ] Verify free tier service doesn't spin down unexpectedly

## Troubleshooting

If deployment fails:
1. Check Render Logs tab for errors
2. Verify all environment variables are set
3. Confirm DATABASE_URL syntax is correct
4. Test locally: `npm run build && npm run start:prod`
5. Check Supabase IP whitelist allows Render IPs

If connection fails after deployment:
1. Test: `curl -H "Authorization: Bearer [token]" https://comma-pos-backend.onrender.com/api/v1/users`
2. Check CORS configuration in environment variables
3. Verify frontend is sending requests to correct URL
4. Check browser DevTools Network tab for exact error
