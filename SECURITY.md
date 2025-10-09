# Security Guide for Project Somi Landing Page

## The Reality: URLs Can Always Be Found

**Important:** Even with obfuscation, determined users can always find your Google Apps Script URL by:
- Inspecting network requests in browser DevTools
- Decompiling/beautifying JavaScript
- Monitoring network traffic

**The good news:** This is actually okay! Here's why and how to properly secure it.

## ✅ Recommended Security Approach

### 1. **Accept That the URL Will Be Public**
Instead of hiding the URL, make the endpoint itself secure.

### 2. **Implement Server-Side Validation (BEST)**

Update your Google Apps Script with these security measures:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Get email from request
    let email;
    if (e.postData && e.postData.contents) {
      try {
        const data = JSON.parse(e.postData.contents);
        email = data.email;
      } catch (parseError) {
        email = e.parameter.email;
      }
    } else {
      email = e.parameter.email;
    }
    
    // 1. VALIDATE EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return ContentService
        .createTextOutput('Invalid email')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // 2. CHECK FOR DUPLICATE EMAILS
    const existingEmails = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
    const emailExists = existingEmails.some(row => row[0] === email);
    
    if (emailExists) {
      return ContentService
        .createTextOutput('Email already registered')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // 3. RATE LIMITING (simple version)
    const lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - 1);
    
    const recentEntries = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
    const recentCount = recentEntries.filter(row => new Date(row[0]) > lastHour).length;
    
    // Limit to 100 submissions per hour (adjust as needed)
    if (recentCount > 100) {
      return ContentService
        .createTextOutput('Too many requests. Please try again later.')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // 4. ADD DATA
    const timestamp = new Date();
    sheet.appendRow([email, timestamp]);
    
    return ContentService
      .createTextOutput('Success')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    return ContentService
      .createTextOutput('Error')
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
```

### 3. **Additional Protection Layers**

#### A. Make Google Sheet View-Only
1. Right-click on the sheet tab
2. Select "Protect sheet"
3. Set permissions so only you can edit
4. The script will still work, but users can't directly access the sheet

#### B. Use Script Properties for Sensitive Data
Store the Sheet ID in script properties instead of hardcoding:

```javascript
function doPost(e) {
  // Get sheet ID from script properties
  const scriptProperties = PropertiesService.getScriptProperties();
  const sheetId = scriptProperties.getProperty('SHEET_ID');
  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  
  // ... rest of your code
}
```

To set this up:
1. In Apps Script: File → Project properties → Script properties
2. Add property: `SHEET_ID` = `your-actual-sheet-id`

#### C. Implement Honeypot Field (Spam Protection)
Add a hidden field that bots will fill but humans won't:

```html
<!-- Add to your form -->
<input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
```

Then in Google Apps Script:
```javascript
// Reject if honeypot is filled
if (e.parameter.website) {
  return ContentService.createTextOutput('Invalid request');
}
```

## 🔒 What We've Implemented

### Basic Obfuscation (config.js)
- URL is base64 encoded
- Slightly harder to find (but not secure)
- More of a "don't make it obvious" approach

### Why This is Acceptable
1. **Validation**: Email format validation prevents garbage data
2. **Duplicate Check**: Prevents spam from same email
3. **Rate Limiting**: Prevents mass abuse
4. **No Sensitive Data**: You're only collecting emails (public info)
5. **Easy to Monitor**: You can see spam in your sheet and delete it

## 📊 Monitoring & Maintenance

### Check Your Sheet Regularly
- Look for suspicious patterns
- Delete obvious spam entries
- Monitor submission frequency

### If You Get Spammed
1. **Deploy a new version** of the Apps Script with stricter rate limits
2. **Add CAPTCHA** using Google reCAPTCHA (more complex)
3. **Use a paid service** like Formspree or Netlify Forms

## 🎯 Bottom Line

**For an email collection landing page, the current setup is sufficient:**
- ✅ Validates emails
- ✅ Prevents duplicates
- ✅ Has basic rate limiting
- ✅ URL is slightly obfuscated
- ✅ Easy to maintain

The risk is low because:
- You're only collecting emails (not sensitive data)
- Worst case: someone adds fake emails (easy to spot and delete)
- The Google Apps Script validation prevents most abuse

**For production at scale**, consider:
- Cloudflare workers as a proxy
- Serverless functions (Vercel, Netlify)
- Third-party form services (Formspree, Basin, etc.)

But for a landing page collecting early access signups, this is perfectly fine! 🎉
