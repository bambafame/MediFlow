import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getAppointmentById } from "../../services/appointmentService";

import { createConsultation } from "../../services/consultationService";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

import { formatDateTime } from "../../utils/timeUtils";

function ConsultationForm() {
  const { appointmentId } = useParams();

  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    notes: "",
    diagnosis: "",
  });

  useEffect(() => {
    let cancelled = false;

    const loadAppointment = async () => {
      try {
        const data = await getAppointmentById(appointmentId);

        if (!cancelled) {
          setAppointment(data);
        }
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

    loadAppointment();

    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

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
      const payload = {
        appointmentId: Number(appointmentId),

        notes: formData.notes.trim(),

        diagnosis: formData.diagnosis.trim(),
      };

      await createConsultation(payload);

      navigate(`/appointments/${appointmentId}/consultation`);
    } catch (err) {
      const response = err.response?.data;

      if (response?.details) {
        setError(Object.values(response.details).join(", "));
      } else {
        setError(response?.message || "Unable to create consultation.");
      }
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
        title="Create Consultation"
        description={`Appointment #${appointment.appointmentId}`}
      />

      <ErrorAlert message={error} />

      <div
        className="
          mb-6
          max-w-4xl
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          p-5
        "
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Patient</p>

            <p className="font-semibold text-slate-900">
              {appointment.patientName}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Doctor</p>

            <p className="font-semibold text-slate-900">
              Dr. {appointment.doctorName}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Appointment Date</p>

            <p className="font-medium text-slate-900">
              {formatDateTime(appointment.startDateTime)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Reason</p>

            <p className="font-medium text-slate-900">{appointment.reason}</p>
          </div>
        </div>
      </div>

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
        <div>
          <label
            className="
              text-sm
              font-medium
              text-slate-700
            "
          >
            Consultation Notes
          </label>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            required
            rows="8"
            placeholder="Enter examination findings, observations, and consultation notes..."
            className={inputClass}
          />
        </div>

        <div className="mt-6">
          <label
            className="
              text-sm
              font-medium
              text-slate-700
            "
          >
            Diagnosis
          </label>

          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            rows="4"
            placeholder="Enter diagnosis..."
            className={inputClass}
          />
        </div>

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
            {saving ? "Saving..." : "Save & Complete Consultation"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConsultationForm;
