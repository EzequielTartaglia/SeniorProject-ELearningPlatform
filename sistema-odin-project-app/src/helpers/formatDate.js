export default function formatDate(dateString, format = "dd/MM/yyyy") {
  if (!dateString) return '';

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (format === "yyyy-MM-dd") {
    return `${year}-${month}-${day}`;
  }

  return `${day}/${month}/${year}`;
}
