# Google Apps Script Fix

## Update Your Google Apps Script Code

Replace your current Google Apps Script code with this improved version:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add timestamp
    const timestamp = new Date();
    
    // Add data to sheet
    sheet.appendRow([data.email, timestamp]);
    
    // Return proper CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
```

## Steps to Fix:

1. Go to your Google Apps Script project
2. Replace the existing code with the code above
3. Save the project
4. Click "Deploy" → "Manage deployments"
5. Click the pencil icon to edit your existing deployment
6. Click "Deploy" to update it
7. Test your form again

## Alternative: Test the URL Directly

You can test if your Google Apps Script is working by visiting this URL in your browser:
```
https://script.google.com/macros/s/AKfycbzlk9SfRy29sEGTkdXo-k7yw89OUQUOg5hh7iUo-Yse5rluznw93CWooYcDoY3CgavZ/exec
```

If it returns `{"success":true}` or similar, the script is working.
