# Sell Any Car Fast CRM

A powerful, cloud-synced CRM for managing vehicle purchase leads.

## 🚀 Live App

**https://centralshub.github.io/sacf-crm/crm.html**

## ✨ Features

### Lead Management
- 📊 **Kanban Board**: Visual pipeline (To Do → Offer Made → Declined → Purchased)
- 📸 **Photo Galleries**: View all vehicle photos with lightbox
- 📱 **Quick Actions**: Call, text, email directly from cards
- 🗑️ **Soft Delete**: Remove leads from view (preserves in GitHub)
- 📈 **Performance Stats**: Conversion rates, total leads, pipeline metrics

### Data Sync
- ☁️ **GitHub Cloud Storage**: Free, unlimited storage via GitHub API
- 🔄 **Auto-Sync**: Changes save automatically every 2 seconds
- 💾 **Offline Backup**: Falls back to localStorage when offline
- 🌐 **Cross-Device**: Access from any browser/device with same token
- ⚡ **Real-Time Status**: See sync status indicator

### Lead Details
- ✏️ **Editable Vehicle Info**: Update year, make, model, badge
- 💰 **Pricing**: Track offers, counter-offers, estimated retail
- 📝 **Notes**: Add private notes to any lead
- 📄 **PDF Export**: Generate full or safe (no PII) PDFs
- 📧 **Email Templates**: Copy HTML emails for Spark

### Smart Features
- 🎨 **Beautiful UI**: Modern dark theme with Tailwind CSS
- 🔍 **Postcode Mapping**: Auto-converts QLD postcodes to suburbs
- 📅 **Brisbane Timezone**: All dates in AEST/AEDT
- 🖼️ **Photo Compression**: Optimized PDF generation
- 💾 **iCloud Integration**: Save PDFs directly to iCloud Drive

## 🛠️ Setup

### 1. First Time Setup

1. Open the CRM: https://centralshub.github.io/sacf-crm/crm.html
2. Click **"Setup GitHub Sync"** (top right)
3. Follow the prompt to create a GitHub Personal Access Token
4. Done! Your data now syncs to GitHub

See [GITHUB-SYNC-SETUP.md](./GITHUB-SYNC-SETUP.md) for detailed setup instructions.

### 2. Use on Multiple Devices

1. Open the CRM on your new device
2. Click **"Setup GitHub Sync"**
3. Enter the **same token** you created before
4. Your data will load automatically!

## 📊 Data Storage

### GitHub Storage
- File: `crm-data.json` in this repo
- Contains: Lead statuses, offers, notes, vehicle edits, deleted IDs
- Updates: Auto-synced every 2 seconds after changes

### localStorage (Backup)
- Used as fallback when GitHub unavailable
- Same data structure as GitHub file
- Syncs to GitHub when connection restored

## 🔒 Security

- ✅ GitHub token stored locally (never in code)
- ✅ Token has full repo access (needed for file writes)
- ✅ Data stored in public repo (no sensitive PII by default)
- ⚠️ **Safe PDFs** remove name, email, phone for sharing

## 🧪 Tech Stack

- **Frontend**: Vanilla JS, Tailwind CSS, Font Awesome
- **Data Source**: Jotform API
- **Storage**: GitHub API + localStorage
- **PDF**: jsPDF
- **Hosting**: GitHub Pages

## 📝 API Configuration

### Jotform API
```javascript
const API_KEY = "6eff91999757e6e8e604ee539547a7fa";
const FORM_ID = "250941024894055";
```

### GitHub API
```javascript
const GITHUB_CONFIG = {
  owner: 'CentralsHub',
  repo: 'sacf-crm',
  branch: 'main',
  dataFile: 'crm-data.json'
};
```

## 🚀 Development

### Local Development
```bash
# Clone the repo
git clone https://github.com/CentralsHub/sacf-crm.git
cd sacf-crm

# Open in browser
open crm.html
```

### Deploy to GitHub Pages
```bash
git add .
git commit -m "Update CRM"
git push

# GitHub Pages auto-deploys from main branch
```

## 📄 License

Private - Sell Any Car Fast © 2025

## 🤝 Support

For issues or questions, check the browser console (F12) for sync logs.
