export function getFormattedDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // Months are zero-based, so we add 1
  const year = today.getFullYear().toString().slice(-2); // Get the last two digits of the year

  return `${day}/${month}/${year}`;
}
