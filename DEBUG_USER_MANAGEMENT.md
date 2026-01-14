# Debug User Management Page

## Steps to Debug:

1. **Open Browser Console (F12)**
   - Look for console.log messages:
     - "Initial load - existing users:"
     - "Loaded Azure AD users:"
   - Check for any red error messages

2. **Check Network Tab**
   - See if any API calls are being made
   - Check response times

3. **Verify Data:**
   - The service should return:
     - 8 existing users
     - 12 Azure AD users

4. **Check Template:**
   - Make sure Angular Material table is rendering
   - Check if *ngIf conditions are preventing display

5. **Test in Console:**
   - Open browser console
   - Type: `ng.probe($0).componentInstance.existingUsers`
   - This will show the current component state
