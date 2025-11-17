# Environment Variables Setup for Deployment

## For Render Backend (evista-finance-app-backend)

Copy and paste these environment variables into your Render dashboard → Environment section:

### Required Variables:

**MONGODB_URI**
```
mongodb+srv://mern-stack:<YOUR_MONGODB_PASSWORD>@cluster0.bmdohpj.mongodb.net/evista-finance-app?retryWrites=true&w=majority
```
⚠️ Replace `<YOUR_MONGODB_PASSWORD>` with your actual MongoDB Atlas password

**JWT_SECRET**
```
your-super-secret-jwt-key-make-it-long-and-random-at-least-32-characters
```
✅ Use any strong random string (at least 32 characters recommended)

**FRONTEND_URL**
```
https://your-vercel-frontend-url.vercel.app
```
✅ Replace with your actual Vercel frontend URL (e.g., https://evista-finance-app.vercel.app)

**PORT**
```
4000
```
(Keep as is)

---

## For Vercel Frontend (evista-finance-app-frontend)

Copy and paste these environment variables into your Vercel dashboard → Settings → Environment Variables:

### Required Variables:

**VITE_API_URL**
```
https://evista-finance-app-backend.onrender.com
```
✅ This is your Render backend URL (already set in vercel.json, but good to have as env var)

**VITE_FRONTEND_URL**
```
https://your-vercel-frontend-url.vercel.app
```
✅ Replace with your actual Vercel frontend URL

---

## MongoDB Atlas Setup (Required First!)

Before deploying:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
3. Wait 1-2 minutes for Atlas to apply the whitelist
4. Go to Database Access and get your password for user `mern-stack`

---

## Deployment Checklist

- [ ] MongoDB Atlas IP whitelisted (0.0.0.0/0 or specific Render IP)
- [ ] MONGODB_URI set on Render with correct password
- [ ] JWT_SECRET set on Render (any strong random string)
- [ ] FRONTEND_URL set on Render (your Vercel URL)
- [ ] VITE_API_URL set on Vercel (your Render URL: https://evista-finance-app-backend.onrender.com)
- [ ] VITE_FRONTEND_URL set on Vercel (your Vercel URL)
- [ ] Render deploy triggered and "MongoDB Connected" shows in logs
- [ ] Vercel deploy triggered and shows "Build successful"
- [ ] Test /api/health endpoint returns OK

---

## Quick Copy-Paste Templates

### Render Environment Variables (copy these exact keys):
```
MONGODB_URI=mongodb+srv://mern-stack:PASSWORD@cluster0.bmdohpj.mongodb.net/evista-finance-app?retryWrites=true&w=majority
JWT_SECRET=your-strong-random-secret-key-here
FRONTEND_URL=https://your-vercel-url.vercel.app
PORT=4000
ALLOWED_ORIGIN=https://your-vercel-url.vercel.app
```

### Vercel Environment Variables (copy these exact keys):
```
VITE_API_URL=https://evista-finance-app-backend.onrender.com
VITE_FRONTEND_URL=https://your-vercel-url.vercel.app
```

---

## Support
If you need help with specific values or have questions about any variable, refer to:
- MongoDB password: Database Access in MongoDB Atlas
- Render URL: Found in Render dashboard (already provided)
- Vercel URL: Found in Vercel dashboard after first deploy
