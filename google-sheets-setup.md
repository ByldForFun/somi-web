# Google Sheets Setup for Email Collection

## Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Project Somi - Email Signups"
4. In cell A1, add the header "Email"
5. In cell B1, add the header "Date Added"

## Step 2: Create Google Apps Script
1. In your Google Sheet, go to Extensions → Apps Script
2. Delete the default code and paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add timestamp
    const timestamp = new Date();
    
    // Add data to sheet
    sheet.appendRow([data.email, timestamp]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy as Web App
1. Click "Deploy" → "New deployment"
2. Choose type "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Click "Deploy"
6. Copy the web app URL (you'll need this for the form)

## Step 4: Update the Form
Replace the GOOGLE_SHEETS_URL in script.js with your deployed web app URL.

## Security Note
This setup allows anyone to add emails to your sheet. For production use, consider adding authentication or rate limiting.
