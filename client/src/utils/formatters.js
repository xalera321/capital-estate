/**
 * Formats a number as Russian Ruble currency
 * @param {number} value - The number to format
 * @param {boolean} showCurrency - Whether to show the currency symbol
 * @returns {string} Formatted currency string
 */
export const formatRUB = (value, showCurrency = true) => {
  if (value === null || value === undefined) return '';
  
  // Format the number with thousand separators
  const formattedValue = new Intl.NumberFormat('ru-RU', {
    style: showCurrency ? 'currency' : 'decimal',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
  
  return formattedValue;
};

/**
 * Formats a number as square meters
 * @param {number} value - The number to format
 * @returns {string} Formatted area string
 */
export const formatArea = (value) => {
  if (value === null || value === undefined) return '';
  return `${value} м²`;
};

/**
 * Formats a date string to localized format
 * @param {string} dateString - ISO date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat('ru-RU', { ...defaultOptions, ...options }).format(date);
};

export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Otherwise, prepend the API base URL (stripping out the /api part)
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const serverUrl = baseUrl.replace(/\/api$/, '');
  
  // Remove any leading slash from the path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  return `${serverUrl}/${cleanPath}`;
};
