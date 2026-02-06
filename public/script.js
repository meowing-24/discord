// File upload handling with drag-and-drop support
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const selectedFileDiv = document.getElementById('selectedFile');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileBtn = document.getElementById('removeFile');
const uploadButton = document.getElementById('uploadButton');
const uploadForm = document.getElementById('uploadForm');
const statusMessage = document.getElementById('statusMessage');
const buttonText = document.getElementById('buttonText');
const spinner = document.getElementById('spinner');

// Maximum file size (25MB in bytes)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

let selectedFile = null;

// Format file size for display
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Validate file
function validateFile(file) {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }
    
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'File size exceeds 25MB limit' };
    }
    
    if (file.size === 0) {
        return { valid: false, error: 'File is empty' };
    }
    
    return { valid: true };
}

// Display selected file
function displayFile(file) {
    const validation = validateFile(file);
    
    if (!validation.valid) {
        showStatus(validation.error, 'error');
        return;
    }
    
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    selectedFileDiv.style.display = 'flex';
    dropZone.style.display = 'none';
    uploadButton.disabled = false;
    hideStatus();
}

// Remove selected file
function removeFile() {
    selectedFile = null;
    fileInput.value = '';
    selectedFileDiv.style.display = 'none';
    dropZone.style.display = 'block';
    uploadButton.disabled = true;
    hideStatus();
}

// Show status message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
}

// Hide status message
function hideStatus() {
    statusMessage.style.display = 'none';
}

// Set loading state
function setLoading(isLoading) {
    if (isLoading) {
        uploadButton.disabled = true;
        buttonText.textContent = 'Uploading...';
        spinner.style.display = 'block';
    } else {
        uploadButton.disabled = !selectedFile;
        buttonText.textContent = 'Upload to Discord';
        spinner.style.display = 'none';
    }
}

// Handle file selection via input
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        displayFile(file);
    }
});

// Handle file removal
removeFileBtn.addEventListener('click', removeFile);

// Drag and drop handlers
dropZone.addEventListener('click', () => {
    fileInput.click();
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        // Update file input with dropped file
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        displayFile(file);
    }
});

// Handle form submission
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
        showStatus('Please select a file first', 'error');
        return;
    }
    
    // Validate file again before upload
    const validation = validateFile(selectedFile);
    if (!validation.valid) {
        showStatus(validation.error, 'error');
        return;
    }
    
    // Create FormData and append file
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    setLoading(true);
    hideStatus();
    
    try {
        // Send file to backend API
        // IMPORTANT: The webhook URL is NOT exposed here - it's stored securely on the server
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showStatus(result.message || 'File uploaded successfully!', 'success');
            // Clear the file after successful upload
            setTimeout(() => {
                removeFile();
            }, 2000);
        } else {
            showStatus(result.error || 'Upload failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showStatus('Network error. Please check your connection and try again.', 'error');
    } finally {
        setLoading(false);
    }
});
