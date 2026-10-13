import { useState } from "react";

import { createAvailability } from "../../services/availabilityService";

import ErrorAlert from "../../components/ErrorAlert";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function AvailabilityForm({ doctorId, onCreated }) {
  const [formData, setFormData] = useState({
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "17:00",
  });

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const saved = await createAvailability(doctorId, formData);

      onCreated?.(saved);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create availability.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = `
    w-full
    rounded-lg
    border
    border-slate-300
    px-3
    py-2.5
    outline-none
    focus:border-blue-500
  `;

  return (
    <div>
      <ErrorAlert message={error} />

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Day
          </label>

          <select
            name="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
            className={inputClass}
          >
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Start Time
          </label>

          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End Time
          </label>

          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="
              w-full
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              font-semibold
              text-white
              hover:bg-blue-700
              disabled:opacity-50
            "
          >
            {saving ? "Adding..." : "Add Availability"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AvailabilityForm;
