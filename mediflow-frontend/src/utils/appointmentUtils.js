export const getAppointmentStatusClass = (status) => {
  switch (status) {
    case "SCHEDULED":
      return "bg-blue-100 text-blue-700";

    case "CONFIRMED":
      return "bg-green-100 text-green-700";

    case "COMPLETED":
      return "bg-slate-200 text-slate-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    case "NO_SHOW":
      return "bg-amber-100 text-amber-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
};
