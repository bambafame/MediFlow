export const formatTime = (time) => {
  if (!time) {
    return "";
  }

  const parts = time.split(":");

  const hourNumber = Number(parts[0]);

  const minute = parts[1] || "00";

  const period = hourNumber >= 12 ? "PM" : "AM";

  const displayHour = hourNumber % 12 || 12;

  return `${displayHour.toString().padStart(2, "0")}:` + `${minute}${period}`;
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) {
    return "";
  }

  const date = new Date(dateTime);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};
