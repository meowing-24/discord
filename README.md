# Discord File Uploader 📁

A modern, secure web application for uploading files to Discord via webhooks. Features a clean, dark-themed UI with drag-and-drop support.

## ✨ Features

- **Modern UI**: Clean, Discord-inspired dark theme
- **Drag & Drop**: Intuitive file upload with drag-and-drop support
- **Secure**: Webhook URL stored server-side (never exposed to clients)
- **File Validation**: Client and server-side validation (25MB limit)
- **Real-time Feedback**: Loading states and success/error messages
- **Responsive**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **File Handling**: Multer
- **Discord Integration**: Discord Webhooks API

## 📋 Prerequisites

- Node.js (v14 or higher)
- A Discord webhook URL
- npm or yarn

## 🚀 Quick Start

### 1. Clone or Download

```bash
# Navigate to the project directory
cd discord-file-uploader
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Discord Webhook

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Discord webhook URL:

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN
PORT=3000
```

**How to get a Discord webhook URL:**

1. Open Discord and go to your server
2. Right-click the channel where you want files uploaded
3. Click `Edit Channel` → `Integrations` → `Webhooks`
4. Click `New Webhook` (or use an existing one)
5. Copy the webhook URL
6. Paste it into your `.env` file

### 4. Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
discord-file-uploader/
├── api/
│   └── server.js          # Express server with upload endpoint
├── public/
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Modern dark theme styles
│   └── script.js          # Frontend JavaScript
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "api/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "public/$1"
       }
     ],
     "env": {
       "DISCORD_WEBHOOK_URL": "@discord-webhook-url"
     }
   }
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add your webhook URL as an environment variable in Vercel dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `DISCORD_WEBHOOK_URL` with your webhook URL
   - Redeploy

### Deploy to Heroku

1. **Create a Heroku app:**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variable:**
   ```bash
   heroku config:set DISCORD_WEBHOOK_URL="your-webhook-url"
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

### Deploy to Railway/Render

Both platforms support Node.js apps and environment variables. Simply:
1. Connect your GitHub repository
2. Add `DISCORD_WEBHOOK_URL` as an environment variable
3. Deploy

## 🔒 Security Features

- ✅ Webhook URL never exposed to frontend
- ✅ File size validation (client & server)
- ✅ File type checking
- ✅ CORS protection
- ✅ Environment variables for sensitive data
- ✅ Input sanitization
- ✅ Error handling without exposing server details

## ⚙️ Configuration

### File Size Limit

Default: 25MB (Discord's free tier limit)

To change, edit both files:

**`public/script.js`:**
```javascript
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
```

**`api/server.js`:**
```javascript
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
```

**Note:** Discord limits:
- Free servers: 25MB
- Boosted servers (Level 2): 50MB
- Boosted servers (Level 3): 100MB

### Customize Upload Message

Edit `api/server.js`:

```javascript
const uploadMessage = {
    content: `📁 New file uploaded: **${file.originalname}**`,
    username: 'File Uploader Bot'
};
```

## 🐛 Troubleshooting

### "Server configuration error"
- Make sure `.env` file exists
- Verify `DISCORD_WEBHOOK_URL` is set correctly

### "Discord webhook not found" (404)
- Check that your webhook URL is correct
- Verify the webhook hasn't been deleted in Discord

### "File too large for Discord"
- Files exceed Discord's limit for your server
- Reduce file size or boost your server

### Upload fails silently
- Check browser console for errors
- Verify server is running
- Check server logs for errors

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## ⚠️ Important Notes

- **Never commit your `.env` file** - it contains sensitive webhook URLs
- **Discord rate limits**: Webhooks have rate limits (~5 requests per 2 seconds)
- **File persistence**: Files are stored temporarily in memory, not saved to disk
- **Webhook security**: Anyone with your webhook URL can post to your channel

## 📚 Resources

- [Discord Webhooks Documentation](https://discord.com/developers/docs/resources/webhook)
- [Express.js Documentation](https://expressjs.com/)
- [Multer Documentation](https://github.com/expressjs/multer)

---

Made with ❤️ for the Discord community
