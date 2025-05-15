const fs = require('fs');
const path = require('path');

/**
 * Extracts the filename from a URL path
 * @param {string} url URL path like /uploads/properties/filename.jpg
 * @returns {string|null} Filename or null if invalid
 */
const getFilenameFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  // Check if URL starts with /uploads/properties
  if (!url.startsWith('/uploads/properties/')) return null;
  
  // Extract filename from the URL
  return url.split('/').pop();
};

/**
 * Delete a file from the server filesystem
 * @param {string} url URL path of the file to delete
 * @returns {Promise<boolean>} True if deleted, false if not
 */
const deleteFile = async (url) => {
  try {
    const filename = getFilenameFromUrl(url);
    if (!filename) return false;
    
    const filePath = path.join(process.cwd(), 'uploads/properties', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found for deletion: ${filePath}`);
      return false;
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    console.log(`Deleted file: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${url}:`, error);
    return false;
  }
};

/**
 * Delete multiple files from the server filesystem
 * @param {string[]} urls Array of URL paths to delete
 * @returns {Promise<{deleted: number, failed: number}>} Count of deleted and failed files
 */
const deleteFiles = async (urls = []) => {
  if (!Array.isArray(urls)) return { deleted: 0, failed: 0 };
  
  let deleted = 0;
  let failed = 0;
  
  for (const url of urls) {
    const success = await deleteFile(url);
    if (success) {
      deleted++;
    } else {
      failed++;
    }
  }
  
  return { deleted, failed };
};

module.exports = {
  getFilenameFromUrl,
  deleteFile,
  deleteFiles
}; 