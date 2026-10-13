import { formatTime } from "../../utils/timeUtils";

function AvailabilityList({ availability }) {
  if (!availability || availability.length === 0) {
    return (
      <div
        className="
          rounded-lg
          border
          border-dashed
          border-slate-300
          p-6
          text-center
          text-sm
          text-slate-500
        "
      >
        No availability configured.
      </div>
    );
  }

  const orderedDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const sorted = [...availability].sort(
    (a, b) =>
      orderedDays.indexOf(a.dayOfWeek) - orderedDays.indexOf(b.dayOfWeek),
  );

  return (
    <div className="space-y-3">
      {sorted.map((slot) => (
        <div
          key={slot.availabilityId}
          className="
            flex
            items-center
            justify-between
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            px-4
            py-3
          "
        >
          <div>
            <div className="font-medium text-slate-900">
              {slot.dayOfWeek.charAt(0) + slot.dayOfWeek.slice(1).toLowerCase()}
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {formatTime(slot.startTime)}
              {" → "}
              {formatTime(slot.endTime)}
            </div>
          </div>

          <span
            className={
              slot.available
                ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                : "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
            }
          >
            {slot.available ? "Available" : "Unavailable"}
          </span>
        </div>
      ))}
    </div>
  );
}

export default AvailabilityList;
