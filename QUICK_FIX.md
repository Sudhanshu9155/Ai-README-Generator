# ⚡ QUICK FIX - AI API 404 Error

## 🚨 The Problem
```
Status: 404 Not Found
Error: Failed to generate chat response
```

## 🔧 The Solution (3 Steps - 2 Minutes)

### Step 1️⃣: Get New API Key
```
Go to: https://aistudio.google.com/app/apikey
Click: Create new API key
Copy: The generated key
```

### Step 2️⃣: Update .env File
```bash
# File: backend/.env
GEMINI_API_KEY=YOUR_NEW_KEY_HERE
```
**⚠️ NO SPACES around = sign!**

### Step 3️⃣: Restart Backend
```bash
# Stop current server (Ctrl+C)
cd backend
npm run dev
```

## ✅ Test It
Send a message in Chat page → Should work!

---

## ❓ Still Not Working?

| Error | Fix |
|-------|-----|
| Same 404 error | Verify new key is in .env |
| 503 MISSING_API_KEY | Check .env file exists |
| Can't access file | `cat backend/.env` to see content |
| Frontend can't reach backend | Restart both services |

## 📞 Need Help?
Check: `ERROR_FIX_GUIDE.md` for detailed troubleshooting

---
**Created:** February 16, 2026
**Status:** Ready for deployment after API key update
