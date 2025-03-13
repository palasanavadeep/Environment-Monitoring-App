export default function dateFormatter(dateString) {
    const date = new Date(dateString);
  
    // Extract the components of the date
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
  
    // Return the date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
}