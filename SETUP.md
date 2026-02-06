# Quick Setup Guide 🚀

Follow these steps to get your Discord File Uploader running in 5 minutes!

## Step 1: Get Your Discord Webhook URL

1. Open Discord and navigate to your server
2. Right-click on the channel where you want files to appear
3. Select **Edit Channel** → **Integrations** → **Webhooks**
4. Click **New Webhook** (or copy an existing one)
5. Click **Copy Webhook URL**
6. Save this URL - you'll need it in Step 3!

## Step 2: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages (Express, Multer, etc.)

## Step 3: Configure Your Webhook

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in a text editor

3. Replace the placeholder with your actual webhook URL:
   ```env
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ACTUAL_WEBHOOK_URL
   ```

4. Save the file

## Step 4: Start the Server

Run the development server:

```bash
npm run dev
```

Or production mode:

```bash
npm start
```

## Step 5: Test It Out!

1. Open your browser to `http://localhost:3000`
2. Drag and drop a file or click "Browse Files"
3. Click "Upload to Discord"
4. Check your Discord channel - your file should appear! 🎉

## 🔧 Troubleshooting

**Server won't start?**
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

**Upload fails?**
- Check that your `.env` file has the correct webhook URL
- Verify the webhook still exists in Discord
- Check that the file is under 25MB

**Can't see the files in Discord?**
- Verify you're looking at the correct channel
- Check the webhook is pointing to the right channel

## 🌐 Ready to Deploy?

Check the main README.md for deployment instructions to:
- Vercel (recommended - free & easy)
- Heroku
- Railway
- Render
- Or any Node.js hosting platform

---

Need help? Check the full README.md for detailed documentation!
