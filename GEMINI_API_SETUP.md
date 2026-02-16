# Gemini API Setup Guide

## Critical Issue: Exposed API Key

**⚠️ WARNING:** Your API key has been exposed in error logs and git history. You **MUST** regenerate it immediately.

## Getting a New Gemini API Key

Follow these steps to get a new API key:

### 1. Go to Google AI Studio
- Visit: https://aistudio.google.com/app/apikey
- Sign in with your Google account

### 2. Create or Copy API Key
- Click "Create new API key"
- Select your project (or let it create one)
- Copy the generated API key

### 3. Update Your .env File
In `backend/.env`, replace the old key:

```env
GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

❌ **DO NOT USE:**
```
GEMINI_API_KEY = AIzaSyCrKjWHKx_76kyaJ9Sk1J_eInKUbHwWQ9M  # ← This is disabled
```

### 4. Important Security Notes
1. **Never commit credentials to git** - Add `.env` to `.gitignore`
2. **Use environment variables in production** - Don't hardcode API keys
3. **Rotate keys regularly** - Regenerate keys if exposed
4. **Disable old keys** - In Google Cloud Console, disable the exposed key

### 5. Verify the Setup

#### Option A: Test via API
```bash
# In backend directory
npm run dev

# Send a request
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
```

#### Option B: Test via Frontend
1. Start backend: `npm run dev` (in `backend/`)
2. Start frontend: `npm run dev` (in `frontend/`)
3. Navigate to Chat page
4. Send a message to test

### 6. Expected Success Response

If configured correctly, you should see:
- ✅ No 404 errors
- ✅ AI responds with proper messages
- ✅ No "MISSING_API_KEY" errors

### 7. Common Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 Error | Invalid/expired key | Generate new key from aistudio.google.com |
| 503 Error | Missing API key | Add GEMINI_API_KEY to .env |
| "Limit exceeded" | Rate limited | Wait a moment, then retry |
| CORS errors | Frontend/backend mismatch | Verify FRONTEND_URL in .env |

### 8. API Rate Limits

Google's free tier has these limits:
- **Requests per minute:** 60
- **Tokens per minute:** 4,000,000
- **Daily limit:** No hard limit on free tier

For production use, consider upgrading to a paid plan.

## Alternative: Use OpenAI (Optional)

If you want to use OpenAI's API instead:

1. Update `GEMINI_API_KEY` to `OPENAI_API_KEY` in `.env`
2. Modify `backend/services/aiService.js` to use OpenAI endpoint
3. Install OpenAI SDK: `npm install openai`

## Need Help?

- **Google AI Documentation:** https://ai.google.dev/docs
- **Gemini API Reference:** https://ai.google.dev/api/rest
- **Community Support:** Stack Overflow, Reddit r/learnprogramming
