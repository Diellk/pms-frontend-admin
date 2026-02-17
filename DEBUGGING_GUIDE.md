# Debugging Guide

## Overview
This guide explains the debugging features added to help diagnose API issues in production.

## What Was Added

### 1. API Configuration Logger
**Location:** `components/debug/api-config-logger.tsx`

Logs the API configuration on app startup:
- `NEXT_PUBLIC_API_BASE_URL` - The API base URL being used
- `environment` - Current environment (development/production)
- `timestamp` - When the app loaded

**Console Output:**
```
🔧 API Configuration: {
  NEXT_PUBLIC_API_BASE_URL: "https://your-api.com",
  environment: "production",
  timestamp: "2026-02-17T..."
}
```

### 2. Request Logging
All API calls now log their requests with the 🚀 emoji:

**Examples:**
```
🚀 POST /api/auth/login { username: "admin" }
🚀 GET https://your-api.com/api/admin/users { filters: {...} }
🚀 POST /api/admin/users/:id/activate { id: 5 }
```

### 3. Error Logging
All API errors now log detailed information with the ❌ emoji:

**Example:**
```
❌ API Error: {
  status: 400,
  statusText: "Bad Request",
  url: "https://your-api.com/api/admin/users/statistics",
  errorData: {
    error: "The string did not match the expected pattern"
  }
}
```

## How to Use

### In Development
1. Open your browser's Developer Console (F12)
2. Navigate through the app
3. Watch the console for:
   - 🔧 Configuration on page load
   - 🚀 Request logs when actions are performed
   - ❌ Error logs when something fails

### In Production (Netlify)
1. Open the deployed site
2. Open Developer Console (F12)
3. Reproduce the error
4. Check the console for:
   - Is the correct API URL being used?
   - What request is failing?
   - What's the exact error message from the backend?

## Common Issues to Look For

### Issue 1: Wrong API URL
**Symptom:** API calls go to localhost or wrong URL
**Console Check:** Look at the 🔧 API Configuration log
**Solution:** Update `NEXT_PUBLIC_API_BASE_URL` in Netlify environment variables

### Issue 2: ngrok Browser Warning (MOST COMMON)
**Symptom:** "The string did not match the expected pattern" when using ngrok
**Cause:** ngrok's free tier shows a browser warning page that returns HTML instead of JSON
**Solution:** ✅ FIXED - Added `ngrok-skip-browser-warning: true` header to all API calls
**How to verify:** Check the ❌ error log - if you see HTML in the response, this was the issue

### Issue 3: Backend Validation Error
**Symptom:** "The string did not match the expected pattern" (after ngrok fix)
**Console Check:** Look at the ❌ API Error log for the URL and errorData
**Likely Causes:**
- Email format validation failing
- Phone number format validation failing
- Missing required fields
- Invalid enum values

### Issue 4: CORS Issues
**Symptom:** Network errors, blocked requests
**Console Check:** Look for CORS-related errors in the console
**Solution:** Configure CORS on the backend to allow your Netlify domain

### Issue 5: Authentication Issues
**Symptom:** 401 Unauthorized errors
**Console Check:** Look at the Authorization header in the request
**Solution:** Check if token is being stored and sent correctly

## Files Modified

### API Files (with logging and ngrok headers):
- `lib/api/auth-api.ts` - Authentication endpoints
  - ✅ Added request logging
  - ✅ Added error logging
  - ✅ Added `ngrok-skip-browser-warning` header
- `lib/api/user-api.ts` - User management endpoints
  - ✅ Added request logging
  - ✅ Added error logging
  - ✅ Added `ngrok-skip-browser-warning` header
- `lib/api/financial-api.ts` - Financial endpoints
  - ✅ Added error logging
  - ✅ Added `ngrok-skip-browser-warning` header
- `lib/api/property-api.ts` - Property/room endpoints
  - ✅ Added error logging
  - ✅ Added `ngrok-skip-browser-warning` header

### Layout Files:
- `app/layout.tsx` - Added ApiConfigLogger component
- `components/debug/api-config-logger.tsx` - New debug component with ngrok detection

## Next Steps

When you see an error in production:

1. **Check the console** - Open DevTools and look for 🚀 and ❌ logs
2. **Identify the failing request** - Note the URL and request data
3. **Check the error response** - Look at the errorData object
4. **Verify configuration** - Ensure NEXT_PUBLIC_API_BASE_URL is correct
5. **Test the endpoint directly** - Use Postman/curl to test the backend endpoint
6. **Check backend logs** - Look at your backend server logs for more details

## Removing Debug Logs

When you want to remove debug logs in production:

1. Remove or comment out console.log statements in API files
2. Remove the `<ApiConfigLogger />` component from `app/layout.tsx`
3. Or, wrap logs in a condition:
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     console.log('...')
   }
   ```

## Additional Debugging Tips

### Check Network Tab
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Click on failed requests to see:
   - Request headers (should include `ngrok-skip-browser-warning: true`)
   - Request payload
   - Response headers
   - Response body (should be JSON, not HTML)

### Check Application Tab
1. Open DevTools → Application tab
2. Check Local Storage for:
   - `authToken` - Should contain JWT token
   - `authUser` - Should contain user data

### Test Backend Directly with ngrok
```bash
# Test user statistics endpoint with ngrok header
curl -H "Authorization: Bearer YOUR_TOKEN" \
  -H "ngrok-skip-browser-warning: true" \
  https://your-ngrok-id.ngrok-free.app/api/admin/users/statistics

# Test get all users endpoint with ngrok header
curl -H "Authorization: Bearer YOUR_TOKEN" \
  -H "ngrok-skip-browser-warning: true" \
  https://your-ngrok-id.ngrok-free.app/api/admin/users
```

### ngrok-Specific Tips
1. **Always use HTTPS** - ngrok provides both HTTP and HTTPS, use HTTPS
2. **Check ngrok dashboard** - Visit http://localhost:4040 to see all requests
3. **Free tier limitations** - ngrok free tier has request limits and requires the skip header
4. **CORS configuration** - Your backend must allow CORS from your Netlify domain

## Support

If you're still experiencing issues after checking the logs:
1. Copy the console logs (🔧, 🚀, and ❌ messages)
2. Copy the Network tab request/response details
3. Share with your backend developer for investigation
