export default function formatDate(date) {
  if (!date) return "";
  try {
    return new Date(date).toLocaleString();
  } catch {
    return String(date);
  }
}
