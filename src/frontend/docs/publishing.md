# Publishing Guide

This guide explains how to publish changes from Draft to Live in your Caffeine project and troubleshoot common issues.

## Understanding Draft vs Live

Your Caffeine project has two environments:

- **Draft**: Your working environment where you make and test changes. This is where you develop and preview your application before making it public.
- **Live**: The published version that your visitors see. This is the production environment accessible via your public URL.

## Prerequisites

Before publishing, ensure you have:

- Access to your Caffeine project dashboard
- Tested your changes thoroughly in the Draft environment
- Verified that the backend canister is running and has sufficient cycles
- Confirmed that authentication and all features work correctly in Draft

## Publishing Checklist

Follow these steps to publish your changes:

1. **Test in Draft**
   - Open your Draft preview in the Caffeine dashboard
   - Test all functionality, especially:
     - User authentication (login/logout)
     - Data loading and display
     - Forms and user interactions
     - Any new features you've added

2. **Verify Backend Status**
   - Ensure the backend canister is running
   - Check that Draft can successfully connect to the backend
   - Confirm there are no "canister stopped" errors in Draft

3. **Publish to Live**
   - In the Caffeine dashboard, locate the "Publish" or "Promote to Live" button
   - Click the button to start the deployment
   - Wait for the deployment to complete (typically 1-2 minutes)
   - Do not close the browser during deployment

4. **Verify Live Deployment**
   - Open your Live URL in a new browser tab
   - Test the same functionality you tested in Draft
   - Clear browser cache if you see old content (Ctrl+Shift+R or Cmd+Shift+R)
   - Verify that authentication works correctly

5. **Monitor for Issues**
   - Check for any error messages
   - Test with different browsers if possible
   - Verify that all images and assets load correctly

## Troubleshooting

### Issue: "The backend canister is currently stopped"

**Symptoms:**
- Orange error message: "The backend canister is currently stopped. Please reload the page after the canister has been restarted."
- Application shows a black screen after login
- Features work in Draft but not in Live

**Causes:**
- Live is pointing to an old backend canister that has been stopped
- The backend canister was redeployed with a new ID
- The canister ran out of cycles and stopped

**Solution:**

1. **Verify Draft works:**
   - Open Draft and test login and data loading
   - If Draft works, the backend is fine and Live just needs to be updated

2. **Check backend status:**
   - Ensure the backend canister is running
   - Verify it has sufficient cycles
   - Check the canister ID matches what Draft is using

3. **Republish to Live:**
   - Go to your Caffeine dashboard
   - Click "Publish" or "Promote to Live" again
   - This will update Live to point to the correct backend canister

4. **Clear browser cache:**
   - After republishing, clear your browser cache
   - Hard refresh the Live URL (Ctrl+Shift+R or Cmd+Shift+R)
   - Try opening in an incognito/private window

**Prevention:**
- Always test in Draft before publishing
- Ensure the backend is stable before promoting to Live
- Monitor canister cycles to prevent automatic stops

---

### Issue: Login popup shows blank page (about:blank)

**Symptoms:**
- Clicking "Login" opens a blank white window
- The URL shows "about:blank"
- Authentication never completes
- May see a black screen after the blank popup

**Causes:**
- Browser is blocking the Internet Identity popup window
- Browser extensions (AdBlock, VPN, privacy tools) are interfering
- Strict browser security settings

**Solution for Chrome:**

1. **Allow popups for your site:**
   - Look for a popup blocked icon in the address bar (right side)
   - Click the icon
   - Select "Always allow pop-ups and redirects from [your-site]"
   - Refresh the page and try logging in again

2. **Manual settings method:**
   - Open Chrome Settings
   - Go to Privacy and security → Site settings
   - Click "Pop-ups and redirects"
   - Under "Allowed to send pop-ups and use redirects", click "Add"
   - Enter your site URL (e.g., `https://your-project.caffeine.xyz`)
   - Save and refresh your site

3. **Test in Incognito mode:**
   - Open an incognito/private window (Ctrl+Shift+N or Cmd+Shift+N)
   - Navigate to your site
   - Try logging in
   - If it works, a browser extension is likely the cause

4. **Disable extensions temporarily:**
   - Disable AdBlock, uBlock, VPN extensions, and privacy tools
   - Refresh the page and try logging in
   - If it works, re-enable extensions one by one to find the culprit

**Solution for other browsers:**

- **Firefox**: Preferences → Privacy & Security → Permissions → Block pop-up windows → Exceptions
- **Safari**: Preferences → Websites → Pop-up Windows → Allow for your site
- **Edge**: Settings → Cookies and site permissions → Pop-ups and redirects → Allow

**Still not working?**
- Try a different browser (Firefox, Safari, Edge)
- Check if your antivirus software is blocking popups
- Ensure JavaScript is enabled
- Disable "Enhanced Tracking Prevention" or similar privacy features temporarily

---

### Issue: Live shows old content after publishing

**Symptoms:**
- Published changes don't appear on Live
- Live looks the same as before publishing
- Draft shows new content but Live doesn't

**Solution:**

1. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear cache manually in browser settings

2. **Wait for CDN propagation:**
   - Changes may take a few minutes to propagate
   - Wait 5-10 minutes and try again

3. **Try incognito/private mode:**
   - Open an incognito/private window
   - Navigate to your Live URL
   - This bypasses local cache

4. **Verify deployment completed:**
   - Check the Caffeine dashboard for deployment status
   - Ensure there were no errors during publishing

---

## Best Practices

1. **Always test in Draft first**
   - Never publish untested changes directly to Live
   - Verify all features work before promoting

2. **Publish during low-traffic periods**
   - If possible, publish when fewer users are active
   - This minimizes disruption if issues occur

3. **Keep Draft and Live in sync**
   - Don't let Draft get too far ahead of Live
   - Publish regularly to avoid large, risky deployments

4. **Monitor after publishing**
   - Check Live immediately after publishing
   - Watch for error messages or user reports
   - Be ready to roll back if needed

5. **Document your changes**
   - Keep notes on what you're publishing
   - This helps troubleshoot if issues arise

6. **Maintain backend health**
   - Monitor canister cycles regularly
   - Ensure the backend has sufficient resources
   - Keep the backend stable before publishing frontend changes

---

## Getting Help

If you encounter issues not covered in this guide:

1. **Check the Caffeine documentation**: [https://docs.caffeine.ai](https://docs.caffeine.ai)
2. **Review error messages carefully**: They often contain specific guidance
3. **Test in Draft**: If Draft works, the issue is likely with the Live deployment
4. **Contact Caffeine support**: Provide details about the error and steps you've tried

---

## Quick Reference

| Environment | Purpose | URL Pattern |
|-------------|---------|-------------|
| Draft | Development and testing | `[project]-draft.caffeine.xyz` |
| Live | Production (public) | `[project].caffeine.xyz` |

| Common Error | Quick Fix |
|--------------|-----------|
| Backend canister stopped | Republish Draft to Live |
| Login popup blank | Allow popups in browser settings |
| Old content showing | Hard refresh (Ctrl+Shift+R) |
| Changes not visible | Wait 5-10 minutes, clear cache |

---

**Remember**: Draft is your safe testing ground. Always verify everything works there before publishing to Live!
