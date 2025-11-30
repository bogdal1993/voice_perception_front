/**
 * Formats a date string or Date object to DD.MM.YYYY HH:MM:SS format
 * @param date - Date string in ISO format or Date object
 * @returns Formatted date string in DD.MM.YYYY HH:MM:SS format
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) {
    return '';
  }

  // Create a Date object from the input
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  // Extract date components
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = dateObj.getFullYear();
  
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  // Format as DD.MM.YYYY with line break followed by HH:MM:SS
  return `${day}.${month}.${year}\n${hours}:${minutes}:${seconds}`;
};

/**
 * Formats a date string or Date object to DD.MM.YYYY HH:MM format (without seconds)
 * Used for date pickers and input fields
 * @param date - Date string in ISO format or Date object
 * @returns Formatted date string in DD.MM.YYYY HH:MM format
 */
export const formatDateTimeWithoutSeconds = (date: string | Date | null | undefined): string => {
  if (!date) {
    return '';
  }

  // Create a Date object from the input
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  // Extract date components
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = dateObj.getFullYear();
  
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  // Format as DD.MM.YYYY HH:MM
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};