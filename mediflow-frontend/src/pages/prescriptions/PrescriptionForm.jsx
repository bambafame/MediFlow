import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getConsultationByAppointment } from "../../services/consultationService";

import { createPrescription } from "../../services/prescriptionService";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

function PrescriptionForm() {
  const { appointmentId } = useParams();

  const navigate = useNavigate();

  const [consultation, setConsultation] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    medicationName: "",
    dosage: "",
    instructions: "",
  });

  useEffect(() => {
    let cancelled = false;

    const loadConsultation = async () => {
      try {
        const data = await getConsultationByAppointment(appointmentId);

        if (!cancelled) {
          setConsultation(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load consultation.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadConsultation();

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
        consultationId: consultation.consultationId,

        medicationName: formData.medicationName.trim(),

        dosage: formData.dosage.trim(),

        instructions: formData.instructions.trim(),
      };

      await createPrescription(payload);

      navigate(`/appointments/${appointmentId}/consultation`);
    } catch (err) {
      const response = err.response?.data;

      if (response?.details) {
        setError(Object.values(response.details).join(", "));
      } else {
        setError(response?.message || "Unable to create prescription.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!consultation) {
    return <ErrorAlert message={error || "Consultation not found."} />;
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
        title="Add Prescription"
        description={`Consultation #${consultation.consultationId}`}
      />

      <ErrorAlert message={error} />

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
        <div>
          <label
            className="
              text-sm
              font-medium
              text-slate-700
            "
          >
            Medication Name
          </label>

          <input
            name="medicationName"
            value={formData.medicationName}
            onChange={handleChange}
            required
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
            Dosage
          </label>

          <input
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="e.g. 500 mg twice daily"
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
            Instructions
          </label>

          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows="5"
            placeholder="Enter prescription instructions..."
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
            {saving ? "Saving..." : "Save Prescription"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PrescriptionForm;
