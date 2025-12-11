# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## Issue 1: "Failed to encrypt data" Error

### Symptoms
- Error message appears when submitting ideas
- Encryption error in server logs
- Ideas still generate but encryption is skipped

### Cause
- Encryption key is not exactly 32 bytes (64 hex characters)
- Invalid key format

### Solution
The system automatically handles this by skipping encryption. Your ideas are still generated and stored safely.

**To fix permanently:**
```bash
# Set proper encryption key (32 bytes = 64 hex chars)
export ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
npm start
```

---

## Issue 2: "Failed to connect wallet"

### Symptoms
- Can't connect MetaMask or Phantom
- Connection button doesn't work
- Browser console shows errors

### Cause
- MetaMask/Phantom not installed
- Wrong wallet type
- Network issues

### Solution

**Step 1: Install MetaMask**
- Go to https://metamask.io
- Install the browser extension
- Create or import a wallet

**Step 2: Try again**
- Refresh the page
- Click "Connect Wallet"
- Approve the connection request

**Step 3: Check browser console**
- Press F12 to open DevTools
- Check Console tab for errors
- Report any errors

---

## Issue 3: "No token provided" Error

### Symptoms
- Error when trying to submit ideas
- Can't generate token branding
- "Unauthorized" messages

### Cause
- Wallet not connected
- Token expired (30 days)
- Browser cache issues

### Solution

**Step 1: Disconnect and reconnect**
```
1. Click "Disconnect" button
2. Click "Connect Wallet" again
3. Approve in MetaMask
```

**Step 2: Clear browser cache**
```
1. Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. Select "All time"
3. Check "Cookies and other site data"
4. Click "Clear data"
5. Refresh page
```

**Step 3: Try incognito mode**
```
1. Open incognito/private window
2. Go to http://localhost:5000
3. Try connecting wallet
```

---

## Issue 4: Server Won't Start

### Symptoms
- "Port 5000 already in use"
- "Cannot find module" errors
- Server crashes immediately

### Solution

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=3000 npm start
```

**Missing dependencies:**
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
npm start
```

**Environment variables not set:**
```bash
# Set all required variables
PORT=5000 \
NODE_ENV=development \
OPENAI_API_KEY=disabled \
JWT_SECRET=test_secret_key_at_least_32_characters_long \
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef \
npm start
```

---

## Issue 5: PDF Download Not Working

### Symptoms
- Download button doesn't work
- PDF file is empty or corrupted
- "Failed to generate PDF" error

### Solution

**Step 1: Check idea was generated**
- Make sure token branding was generated successfully
- Check "Your Previous Ideas" section

**Step 2: Try again**
- Click "Download Idea Kit PDF" button
- Wait for download to complete

**Step 3: Check browser settings**
- Allow downloads from localhost
- Check Downloads folder
- Try different browser

---

## Issue 6: Custom AI Not Generating Results

### Symptoms
- Results show empty values
- Token name is undefined
- Colors not displaying

### Cause
- Custom AI module not loaded
- API response format issue
- Frontend parsing error

### Solution

**Step 1: Check server logs**
```bash
# Look for errors in terminal where server is running
# Check for "Custom AI Error" messages
```

**Step 2: Verify API response**
```bash
# Test API directly
curl -X POST http://localhost:5000/api/ideas/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"projectIdea": "Test idea"}'
```

**Step 3: Check browser console**
- Press F12
- Go to Console tab
- Look for JavaScript errors
- Check Network tab for API responses

---

## Issue 7: Reddit Trends Not Showing

### Symptoms
- "redditInsights" is empty
- No trending topics displayed
- API still works but no insights

### Cause
- Reddit API rate limited
- Network connectivity issue
- Reddit scraping disabled

### Solution

**This is optional** - the platform works fine without Reddit trends.

**To enable:**
1. Check internet connection
2. Verify Reddit is accessible
3. Wait a few minutes and try again

---

## Issue 8: Wallet Address Shows as "undefined"

### Symptoms
- Connected wallet shows "undefined"
- Can't see wallet address
- Can't perform actions

### Cause
- Wallet connection incomplete
- Token not properly stored
- Browser storage disabled

### Solution

**Step 1: Enable browser storage**
- Check if localStorage is enabled
- Check privacy settings
- Try different browser

**Step 2: Reconnect wallet**
```
1. Disconnect wallet
2. Clear browser cache
3. Reconnect wallet
4. Approve all prompts
```

**Step 3: Check browser console**
```
Open DevTools (F12)
Type: localStorage.getItem('authToken')
Should return a long token string
```

---

## Issue 9: Colors Not Displaying Correctly

### Symptoms
- Color boxes are white or blank
- Colors don't match description
- Color palette section empty

### Cause
- CSS not loaded
- Color format issue
- Browser compatibility

### Solution

**Step 1: Hard refresh**
```
Windows: Ctrl+Shift+R
Mac: Cmd+Shift+R
```

**Step 2: Check CSS**
- Open DevTools (F12)
- Go to Elements tab
- Look for color-box elements
- Check computed styles

**Step 3: Try different browser**
- Chrome, Firefox, Safari, Edge
- Check if issue persists

---

## Issue 10: "Invalid wallet address format"

### Symptoms
- Can't connect certain wallet types
- "Invalid wallet address" error
- Solana wallet not working

### Cause
- Wallet address format not recognized
- Solana addresses are different format
- Address validation too strict

### Solution

**For Ethereum wallets:**
- Use MetaMask
- Address should start with "0x"
- Should be 42 characters long

**For Solana wallets:**
- Use Phantom
- Address format is different
- May need code update

**Workaround:**
- Use test wallet address
- Contact support for Solana support

---

## Issue 11: Server Crashes After Generating Ideas

### Symptoms
- Server crashes after first generation
- "Cannot read property" errors
- Server needs restart

### Cause
- Memory leak in idea storage
- Unhandled error in generation
- Database connection issue

### Solution

**Step 1: Check error logs**
```bash
# Look at terminal output for error messages
# Check logs/ directory for error.log
```

**Step 2: Restart server**
```bash
# Kill old process
pkill -f "node server.js"

# Start fresh
npm start
```

**Step 3: Clear memory**
```bash
# Ideas are stored in memory
# Restarting clears them
# This is normal for MVP
```

---

## Issue 12: CORS Errors

### Symptoms
- "CORS policy" errors in browser console
- API calls blocked
- "Access-Control-Allow-Origin" errors

### Cause
- Frontend and backend on different origins
- CORS not properly configured
- Browser security restrictions

### Solution

**Step 1: Verify URLs match**
```
Frontend: http://localhost:5000
API: http://localhost:5000/api
Should be same origin
```

**Step 2: Check CORS configuration**
```javascript
// In server.js, should have:
app.use(cors());
```

**Step 3: Try different approach**
- Use same origin for frontend and API
- Don't use different ports
- Use proxy if needed

---

## Issue 13: Rate Limiting Errors

### Symptoms
- "Too many requests" error
- "429" status code
- Can't generate after multiple tries

### Cause
- Rate limit exceeded (100 req/15 min)
- Too many rapid requests
- Testing with many requests

### Solution

**Wait and retry:**
```
Rate limit: 100 requests per 15 minutes
Wait 15 minutes and try again
```

**For testing:**
```bash
# Modify rate limit in server.js
# Change windowMs or max values
# Restart server
```

---

## Issue 14: Ideas Not Saving

### Symptoms
- Generate idea, then it disappears
- "Your Previous Ideas" is empty
- Can't view past ideas

### Cause
- In-memory storage (MVP limitation)
- Server restart clears ideas
- Wallet not properly connected

### Solution

**This is expected for MVP:**
- Ideas are stored in RAM
- Restarting server clears them
- Use MongoDB for persistence

**To persist ideas:**
1. Follow DEPLOYMENT.md
2. Set up MongoDB
3. Update database code
4. Restart server

---

## Issue 15: PDF Download Fails

### Symptoms
- PDF file is corrupted
- PDF is empty
- Download button does nothing

### Cause
- PDFKit not installed
- Idea data incomplete
- File system permissions

### Solution

**Step 1: Verify PDFKit**
```bash
npm list pdfkit
# Should show pdfkit version
```

**Step 2: Check idea data**
```bash
# Make sure idea was generated successfully
# Check "Your Previous Ideas" section
```

**Step 3: Check file permissions**
```bash
# Ensure uploads/ directory exists and is writable
ls -la uploads/
chmod 755 uploads/
```

---

## General Troubleshooting Steps

### 1. Check Server Status
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"Server is running"}
```

### 2. Check Frontend
```bash
curl http://localhost:5000/
# Should return HTML
```

### 3. Check Logs
```bash
# Server logs in terminal
# Browser console (F12)
# File logs in logs/ directory
```

### 4. Restart Everything
```bash
# Kill server
pkill -f "node server.js"

# Clear cache
rm -rf logs/*

# Start fresh
npm start
```

### 5. Check Environment
```bash
# Verify all env vars are set
echo $PORT
echo $JWT_SECRET
echo $ENCRYPTION_KEY
```

---

## Getting Help

### Documentation
- **README.md** - Main documentation
- **QUICKSTART.md** - Setup guide
- **CUSTOM_AI_GUIDE.md** - AI details
- **ARCHITECTURE.md** - System design

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm start
```

### Check Logs
```bash
# View error logs
tail -f logs/error.log

# View all logs
tail -f logs/*.log
```

### Test API
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test with sample data
bash /tmp/test_submit2.sh
```

---

## Still Having Issues?

1. **Check documentation** - Most issues are covered
2. **Review error messages** - They usually tell you what's wrong
3. **Check browser console** - F12 → Console tab
4. **Check server logs** - Terminal output
5. **Restart everything** - Often fixes issues
6. **Try different browser** - Rules out browser issues
7. **Try incognito mode** - Rules out cache issues

---

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Port 5000 in use" | Another process using port | Kill process or use different port |
| "Cannot find module" | Missing dependency | Run `npm install` |
| "Invalid token" | Token expired or invalid | Reconnect wallet |
| "Wallet not connected" | No wallet selected | Click "Connect Wallet" |
| "Failed to encrypt" | Invalid encryption key | Use proper 32-byte key |
| "CORS error" | Different origin | Use same localhost:5000 |
| "Rate limited" | Too many requests | Wait 15 minutes |
| "PDF failed" | Missing PDFKit | Run `npm install` |

---

**Status**: ✅ Troubleshooting Guide Complete

**Last Updated**: December 11, 2025

**Version**: 1.0.0
