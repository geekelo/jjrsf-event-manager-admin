export const formatDate = (dateString) => {
  if (!dateString) return "";
  const normalizedDateString = dateString.replace(/-/g, "/");
  const date = new Date(normalizedDateString);
  if (isNaN(date)) return "Invalid date";

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
