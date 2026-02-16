# GitHub Sync Setup Guide

Your CRM now has **cloud storage** using the GitHub API! 🎉

## 🔗 Your CRM URLs

- **Live CRM**: https://centralshub.github.io/sacf-crm/crm.html
- **GitHub Repo**: https://github.com/CentralsHub/sacf-crm

## 🚀 How to Setup (One-Time)

1. **Open your CRM**: https://centralshub.github.io/sacf-crm/crm.html

2. **Click "Setup GitHub Sync"** button (top right)

3. **Create a GitHub Personal Access Token**:
   - Click this link: https://github.com/settings/tokens/new
   - Token name: `SACF CRM Sync`
   - Expiration: `No expiration` (or 1 year)
   - Scopes: Check **✓ repo** (this gives full repo access)
   - Click **"Generate token"**
   - **COPY THE TOKEN** (you won't see it again!)

4. **Paste the token** into the prompt in your CRM

5. **Done!** Your data will now sync automatically to GitHub

## ✨ Features

- **Auto-sync**: Changes save to GitHub every 2 seconds (debounced)
- **Real-time status**: See sync status in top-right corner
- **Cross-device**: Access your data from any browser/device
- **Backup**: Falls back to localStorage if GitHub unavailable
- **Free**: Uses GitHub API (free tier, unlimited for public repos)
- **Secure**: Token stored locally, never shared

## 📊 How It Works

1. All your CRM data (leads, offers, notes, etc.) saves to:
   - **GitHub**: `crm-data.json` in your repo
   - **Local**: Browser localStorage (as backup)

2. Every change triggers auto-sync after 2 seconds

3. On page load, it fetches latest data from GitHub

4. Sync indicator shows:
   - 🔄 **Syncing...** - Saving to GitHub
   - ✅ **Synced [time]** - Successfully saved
   - ⚠️ **Error** - Something went wrong

## 🔧 Troubleshooting

### "GitHub API error: 404"
- The `crm-data.json` file doesn't exist yet
- Make a change in the CRM (add a note, update status, etc.)
- It will create the file automatically

### "GitHub API error: 401"
- Your token is invalid or expired
- Click "Force Sync" button and enter a new token

### Data not syncing between devices
- Make sure you're using the **same GitHub token** on all devices
- Click "Force Sync" to manually pull latest data

## 🎯 Best Practices

1. **Keep your token safe** - Don't share it with anyone
2. **Use the same token** on all your devices
3. **Check sync status** before closing the browser
4. **Backup your token** somewhere secure (like 1Password)

## 📝 Data Stored in GitHub

The `crm-data.json` file contains:
- Lead statuses (To Do, Offer Made, Declined, Purchased)
- Offer amounts & counter-offers
- Estimated retail prices
- Notes for each lead
- Cached lead data from Jotform
- Deleted lead IDs
- Vehicle detail edits (year, make, model, badge)

## 🔒 Security Note

Your GitHub token has **full access to your repositories**. Keep it secure and never commit it to code. It's stored only in your browser's localStorage.

---

**Need help?** Check the browser console (F12) for detailed sync logs.
