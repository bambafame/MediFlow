import { useEffect, useMemo, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { getPatients } from "../../services/patientService";

import { getDoctors } from "../../services/doctorService";

import { getDoctorAvailability } from "../../services/availabilityService";

import { useAuth } from "../../context/useAuth";

import { createAppointment } from "../../services/appointmentService";

import { formatTime } from "../../utils/timeUtils";

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

function AppointmentForm() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);

  const [doctors, setDoctors] = useState([]);

  const [availability, setAvailability] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const [saving, setSaving] = useState(false);

  const [searchParams] = useSearchParams();

  const doctorIdFromUrl = searchParams.get("doctorId") || "";

  const patientIdFromUrl = searchParams.get("patientId") || "";

  const [error, setError] = useState("");

  const { auth } = useAuth();

  const isPatient = auth?.role === "PATIENT";

  const [formData, setFormData] = useState(() => ({
    patientId: isPatient ? String(auth.userId) : patientIdFromUrl || "",
    doctorId: doctorIdFromUrl || "",
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
  }));

  /*
   * Load patients and doctors once
   */
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        /*
         * Patient only needs doctors.
         */
        if (isPatient) {
          const doctorData = await getDoctors();

          if (!cancelled) {
            setDoctors(doctorData);

            setPatients([]);
          }

          if (doctorIdFromUrl) {
            const availabilityData =
              await getDoctorAvailability(doctorIdFromUrl);

            if (!cancelled) {
              setAvailability(availabilityData);
            }
          }

          return;
        }

        /*
         * Admin / Receptionist
         */
        const [patientData, doctorData] = await Promise.all([
          getPatients(),
          getDoctors(),
        ]);

        if (!cancelled) {
          setPatients(patientData);

          setDoctors(doctorData);
        }

        if (doctorIdFromUrl) {
          const availabilityData = await getDoctorAvailability(doctorIdFromUrl);

          if (!cancelled) {
            setAvailability(availabilityData);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load appointment form data.",
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
  }, [isPatient, doctorIdFromUrl]);

  /*
   * Called when doctor changes.
   *
   * We fetch availability here instead of using
   * another effect.
   */
  const handleDoctorChange = async (event) => {
    const doctorId = event.target.value;

    setFormData((current) => ({
      ...current,

      doctorId,

      appointmentDate: "",
      startTime: "",
      endTime: "",
    }));

    setAvailability([]);
    setError("");

    if (!doctorId) {
      return;
    }

    setLoadingAvailability(true);

    try {
      const data = await getDoctorAvailability(doctorId);

      setAvailability(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load doctor availability.",
      );
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
   * Find the day of week selected by the user.
   *
   * Adding T00:00:00 avoids timezone surprises
   * when converting yyyy-MM-dd.
   */
  const selectedDayOfWeek = useMemo(() => {
    if (!formData.appointmentDate) {
      return null;
    }

    const date = new Date(`${formData.appointmentDate}T00:00:00`);

    return DAY_NAMES[date.getDay()];
  }, [formData.appointmentDate]);

  /*
   * Only show availability belonging
   * to the selected weekday.
   */
  const availabilityForSelectedDay = useMemo(() => {
    if (!selectedDayOfWeek) {
      return [];
    }

    return availability.filter(
      (slot) => slot.dayOfWeek === selectedDayOfWeek && slot.available,
    );
  }, [availability, selectedDayOfWeek]);

  /*
   * Frontend convenience validation.
   *
   * Backend AppointmentService still performs
   * the real authoritative validation.
   */
  const isInsideAvailability = () => {
    if (!formData.startTime || !formData.endTime) {
      return false;
    }

    return availabilityForSelectedDay.some((slot) => {
      return (
        formData.startTime >= slot.startTime && formData.endTime <= slot.endTime
      );
    });
  };

  const validateForm = () => {
    if (!formData.patientId) {
      return "Please select a patient.";
    }

    if (!formData.doctorId) {
      return "Please select a doctor.";
    }

    if (!formData.appointmentDate) {
      return "Please select an appointment date.";
    }

    if (!formData.startTime || !formData.endTime) {
      return "Please select start and end times.";
    }

    if (formData.startTime >= formData.endTime) {
      return "Start time must be before end time.";
    }

    if (availabilityForSelectedDay.length === 0) {
      return `The doctor has no availability on ${selectedDayOfWeek}.`;
    }

    if (!isInsideAvailability()) {
      return (
        "The requested appointment time is outside " +
        "the doctor's available hours."
      );
    }

    if (!formData.reason.trim()) {
      return "Please provide a reason for the appointment.";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    const patientIdForRequest = isPatient
      ? auth.userId
      : Number(formData.patientId);

    try {
      const payload = {
        patientId: Number(patientIdForRequest),

        doctorId: Number(formData.doctorId),

        startDateTime: `${formData.appointmentDate}T${formData.startTime}:00`,

        endDateTime: `${formData.appointmentDate}T${formData.endTime}:00`,

        reason: formData.reason.trim(),
      };

      const appointment = await createAppointment(payload);

      navigate(`/appointments/${appointment.appointmentId}`);
    } catch (err) {
      const response = err.response?.data;

      if (response?.details) {
        setError(Object.values(response.details).join(", "));
      } else {
        setError(response?.message || "Unable to book appointment.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
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
    text-slate-900
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
  `;

  return (
    <div>
      <PageHeader
        title="Book Appointment"
        description="Schedule a patient appointment with an available doctor."
      />

      <ErrorAlert message={error} />

      <form
        onSubmit={handleSubmit}
        className="
          max-w-4xl
          rounded-xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        {/* Patient and Doctor */}

        <section>
          <h2
            className="
              mb-5
              text-lg
              font-semibold
              text-slate-900
            "
          >
            Patient and Doctor
          </h2>

          <div
            className="
              grid
              gap-6
              md:grid-cols-2
            "
          >
            {isPatient ? (
              <div>
                <label
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Patient
                </label>

                <div
                  className="
                    mt-2
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-2.5
                    text-sm
                    text-slate-700
                  "
                >
                  Booking for your account
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="patientId"
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                  "
                >
                  Patient
                </label>

                <select
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                  className="
                    mt-2
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-2.5
                  "
                >
                  <option value="">Select patient</option>

                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Doctor
              </label>

              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleDoctorChange}
                required
                className={inputClass}
              >
                <option value="">Select doctor</option>

                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.firstName} {doctor.lastName}
                    {" — "}
                    {doctor.specializationName || "No specialization"}
                  </option>
                ))}
              </select>

              {doctorIdFromUrl && (
                <p
                  className="
                    mt-2
                    text-xs
                    text-blue-600
                  "
                >
                  Doctor preselected from the doctor profile.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Doctor Availability */}

        {formData.doctorId && (
          <section
            className="
              mt-8
              border-t
              border-slate-200
              pt-8
            "
          >
            <h2
              className="
                text-lg
                font-semibold
                text-slate-900
              "
            >
              Doctor Availability
            </h2>

            {loadingAvailability ? (
              <p
                className="
                  mt-4
                  text-sm
                  text-slate-500
                "
              >
                Loading availability...
              </p>
            ) : availability.length === 0 ? (
              <div
                className="
                  mt-4
                  rounded-lg
                  border
                  border-amber-200
                  bg-amber-50
                  px-4
                  py-3
                  text-sm
                  text-amber-800
                "
              >
                This doctor does not have any availability configured.
              </div>
            ) : (
              <div
                className="
                  mt-4
                  grid
                  gap-3
                  md:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {availability
                  .filter((slot) => slot.available)
                  .map((slot) => (
                    <div
                      key={slot.availabilityId}
                      className="
                        rounded-lg
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        py-3
                      "
                    >
                      <div
                        className="
                          font-medium
                          text-slate-900
                        "
                      >
                        {slot.dayOfWeek.charAt(0) +
                          slot.dayOfWeek.slice(1).toLowerCase()}
                      </div>

                      <div
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        {formatTime(slot.startTime)}

                        {" → "}

                        {formatTime(slot.endTime)}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* Appointment Date and Time */}

        <section
          className="
            mt-8
            border-t
            border-slate-200
            pt-8
          "
        >
          <h2
            className="
              mb-5
              text-lg
              font-semibold
              text-slate-900
            "
          >
            Appointment Date and Time
          </h2>

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
                Date
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

          {/* Availability for selected date */}

          {formData.appointmentDate && (
            <div
              className="
                mt-5
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                p-4
              "
            >
              <div
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Availability for{" "}
                {selectedDayOfWeek?.charAt(0) +
                  selectedDayOfWeek?.slice(1).toLowerCase()}
              </div>

              {availabilityForSelectedDay.length === 0 ? (
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
                  {availabilityForSelectedDay.map((slot) => (
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
        </section>

        {/* Reason */}

        <section
          className="
            mt-8
            border-t
            border-slate-200
            pt-8
          "
        >
          <h2
            className="
              mb-5
              text-lg
              font-semibold
              text-slate-900
            "
          >
            Visit Information
          </h2>

          <div>
            <label
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Reason for Appointment
            </label>

            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the reason for the visit..."
              className={inputClass}
            />
          </div>
        </section>

        {/* Buttons */}

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
            disabled={saving || loadingAvailability}
            className="
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              font-semibold
              text-white
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;
