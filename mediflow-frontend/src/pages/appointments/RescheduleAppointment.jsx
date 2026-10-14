import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  getAppointmentById,
  rescheduleAppointment,
} from "../../services/appointmentService";

import { getDoctorAvailability } from "../../services/availabilityService";

import { formatDateTime, formatTime } from "../../utils/timeUtils";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

const DAY_NAMES = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function RescheduleAppointment() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);

  const [availability, setAvailability] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    appointmentDate: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const appointmentData = await getAppointmentById(id);

        if (cancelled) {
          return;
        }

        const availabilityData = await getDoctorAvailability(
          appointmentData.doctorId,
        );

        if (cancelled) {
          return;
        }

        setAppointment(appointmentData);

        setAvailability(availabilityData);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load appointment.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const selectedDayOfWeek = useMemo(() => {
    if (!formData.appointmentDate) {
      return null;
    }

    const date = new Date(`${formData.appointmentDate}T00:00:00`);

    return DAY_NAMES[date.getDay()];
  }, [formData.appointmentDate]);

  const availabilityForDay = useMemo(() => {
    if (!selectedDayOfWeek) {
      return [];
    }

    return availability.filter(
      (slot) => slot.dayOfWeek === selectedDayOfWeek && slot.available,
    );
  }, [availability, selectedDayOfWeek]);

  const isInsideAvailability = () => {
    if (!formData.startTime || !formData.endTime) {
      return false;
    }

    return availabilityForDay.some(
      (slot) =>
        formData.startTime >= slot.startTime &&
        formData.endTime <= slot.endTime,
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.appointmentDate) {
      setError("Please select a date.");

      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setError("Please select start and end times.");

      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError("Start time must be before end time.");

      return;
    }

    if (availabilityForDay.length === 0) {
      setError(`Doctor is not available on ${selectedDayOfWeek}.`);

      return;
    }

    if (!isInsideAvailability()) {
      setError("Requested time is outside the doctor availability.");

      return;
    }

    setSaving(true);

    try {
      const payload = {
        startDateTime: `${formData.appointmentDate}T${formData.startTime}:00`,

        endDateTime: `${formData.appointmentDate}T${formData.endTime}:00`,
      };

      const updated = await rescheduleAppointment(id, payload);

      navigate(`/appointments/${updated.appointmentId}`);
    } catch (err) {
      const response = err.response?.data;

      setError(response?.message || "Unable to reschedule appointment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!appointment) {
    return <ErrorAlert message={error || "Appointment not found."} />;
  }

  const inputClass = `
    mt-2
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-4
    py-2.5
    outline-none
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
  `;

  return (
    <div>
      <PageHeader
        title="Reschedule Appointment"
        description={`Appointment #${appointment.appointmentId}`}
      />

      <ErrorAlert message={error} />

      <div
        className="
          mb-6
          max-w-3xl
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          p-5
        "
      >
        <p
          className="
            text-sm
            font-medium
            text-slate-600
          "
        >
          Current Appointment
        </p>

        <p
          className="
            mt-2
            font-semibold
            text-slate-900
          "
        >
          {formatDateTime(appointment.startDateTime)}
        </p>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Dr. {appointment.doctorName}
          {" — "}
          {appointment.specialization}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="
          max-w-3xl
          rounded-xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <div
          className="
            grid
            gap-6
            md:grid-cols-3
          "
        >
          <div>
            <label
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              New Date
            </label>

            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Start Time
            </label>

            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              End Time
            </label>

            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        {formData.appointmentDate && (
          <div
            className="
              mt-6
              rounded-lg
              border
              border-slate-200
              bg-slate-50
              p-4
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Doctor Availability for{" "}
              {selectedDayOfWeek?.charAt(0) +
                selectedDayOfWeek?.slice(1).toLowerCase()}
            </p>

            {availabilityForDay.length === 0 ? (
              <p
                className="
                  mt-2
                  text-sm
                  text-red-600
                "
              >
                Doctor is not available on this day.
              </p>
            ) : (
              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {availabilityForDay.map((slot) => (
                  <span
                    key={slot.availabilityId}
                    className="
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-green-700
                      "
                  >
                    {formatTime(slot.startTime)}

                    {" → "}

                    {formatTime(slot.endTime)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className="
            mt-8
            flex
            justify-end
            gap-3
            border-t
            border-slate-200
            pt-6
          "
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              rounded-lg
              border
              border-slate-300
              px-5
              py-2.5
              font-medium
              text-slate-700
              hover:bg-slate-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              font-semibold
              text-white
              hover:bg-blue-700
              disabled:opacity-50
            "
          >
            {saving ? "Rescheduling..." : "Reschedule Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RescheduleAppointment;
