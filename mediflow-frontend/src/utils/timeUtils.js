export const formatTime = (time) => {
  if (!time) return "";

  const [hourString, minute] = time.split(":");

  let hour = Number(hourString);

  const period = hour >= 12 ? "pm" : "am";

  hour = hour % 12 || 12;

  return `${hour.toString().padStart(2, "0")}:${minute}${period}`;
};
