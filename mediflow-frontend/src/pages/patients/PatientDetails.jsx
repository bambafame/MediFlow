import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { deletePatient, getPatientById } from "../../services/patientService";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import DetailItem from "../../components/DetailItem";

function PatientDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const data = await getPatientById(id);

        setPatient(data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load patient.");
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete ${patient.firstName} ${patient.lastName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePatient(id);

      navigate("/patients");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete patient.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!patient) {
    return <ErrorAlert message={error || "Patient not found."} />;
  }

  return (
    <div>
      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        description={`Patient ID: ${patient.id}`}
        action={
          <div className="flex gap-3">
            <Link
              to={`/patients/${id}/edit`}
              className="
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-blue-700
              "
            >
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="
                rounded-lg
                bg-red-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-red-700
              "
            >
              Delete
            </button>
          </div>
        }
      />

      <ErrorAlert message={error} />

      <div
        className="
          rounded-xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <div className="mb-8 flex items-center gap-5">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-blue-100
              text-xl
              font-bold
              text-blue-700
            "
          >
            {patient.firstName?.[0]}
            {patient.lastName?.[0]}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {patient.firstName} {patient.lastName}
            </h2>

            <p className="text-slate-500">@{patient.username}</p>
          </div>
        </div>

        <dl className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Email" value={patient.email} />

          <DetailItem label="Phone Number" value={patient.phoneNumber} />

          <DetailItem label="Date of Birth" value={patient.dateOfBirth} />

          <DetailItem label="Age" value={`${patient.age} years`} />

          <DetailItem label="Mailing Address" value={patient.mailingAddress} />

          <DetailItem
            label="Status"
            value={patient.enabled ? "Active" : "Inactive"}
          />
        </dl>
      </div>

      <div className="mt-6">
        <Link
          to="/patients"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Patients
        </Link>
      </div>
    </div>
  );
}

export default PatientDetails;
