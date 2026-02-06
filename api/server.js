// Backend API for Discord File Uploader
// This server handles file uploads and securely sends them to Discord
const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Maximum file size (25MB)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Configure multer for file upload handling
// Files are stored in memory temporarily and not saved to disk
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
    fileFilter: (req, file, cb) => {
        // Discord has file size limits, we validate here
        // Allow all file types but limit size
        cb(null, true);
    }
});

// Serve static files from public directory
app.use(express.static('public'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

/**
 * Main upload endpoint
 * POST /api/upload
 * Accepts multipart/form-data with a file field
 */
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        // Validate Discord webhook URL is configured
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        
        if (!webhookUrl) {
            console.error('DISCORD_WEBHOOK_URL is not set in environment variables');
            return res.status(500).json({
                error: 'Server configuration error. Please contact the administrator.'
            });
        }
        
        // Validate file was uploaded
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded. Please select a file.'
            });
        }
        
        const file = req.file;
        
        // Additional validation
        if (file.size === 0) {
            return res.status(400).json({
                error: 'File is empty. Please upload a valid file.'
            });
        }
        
        if (file.size > MAX_FILE_SIZE) {
            return res.status(400).json({
                error: 'File size exceeds 25MB limit.'
            });
        }
        
        console.log(`Uploading file: ${file.originalname} (${file.size} bytes)`);
        
        // Create FormData for Discord webhook
        const formData = new FormData();
        
        // Add the file to the form data
        formData.append('file', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
        });
        
        // Optional: Add a message with the upload
        const uploadMessage = {
            content: `📁 New file uploaded: **${file.originalname}**`,
            username: 'File Uploader Bot'
        };
        
        formData.append('payload_json', JSON.stringify(uploadMessage));
        
        // Send file to Discord webhook
        const discordResponse = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });
        
        // Check Discord response
        if (!discordResponse.ok) {
            const errorText = await discordResponse.text();
            console.error('Discord webhook error:', discordResponse.status, errorText);
            
            // Check for common Discord errors
            if (discordResponse.status === 413) {
                return res.status(400).json({
                    error: 'File is too large for Discord (max 25MB for free servers, 500MB for boosted).'
                });
            }
            
            if (discordResponse.status === 404) {
                return res.status(500).json({
                    error: 'Discord webhook not found. Please check webhook configuration.'
                });
            }
            
            return res.status(500).json({
                error: 'Failed to send file to Discord. Please try again.'
            });
        }
        
        console.log(`File uploaded successfully: ${file.originalname}`);
        
        // Success response
        res.json({
            success: true,
            message: `File "${file.originalname}" uploaded successfully!`,
            fileName: file.originalname,
            fileSize: file.size
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        
        // Handle specific multer errors
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File size exceeds 25MB limit.'
            });
        }
        
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                error: 'Invalid file upload. Please try again.'
            });
        }
        
        // Generic error response
        res.status(500).json({
            error: 'An error occurred while uploading the file. Please try again.'
        });
    }
});

// Handle 404s - serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error. Please try again later.'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);
    
    // Warn if webhook URL is not configured
    if (!process.env.DISCORD_WEBHOOK_URL) {
        console.warn('⚠️  WARNING: DISCORD_WEBHOOK_URL is not set!');
        console.warn('   Please create a .env file with your Discord webhook URL');
    }
});
