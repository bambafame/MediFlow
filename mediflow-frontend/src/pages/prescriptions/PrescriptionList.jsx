import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { getPatientById } from "../../services/patientService";

import { getPatientPrescriptions } from "../../services/prescriptionService";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import { formatDateTime } from "../../utils/timeUtils";

function PrescriptionList() {
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);

  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [patientData, prescriptionData] = await Promise.all([
          getPatientById(patientId),

          getPatientPrescriptions(patientId),
        ]);

        if (!cancelled) {
          setPatient(patientData);

          setPrescriptions(prescriptionData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load prescriptions.",
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
  }, [patientId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <PageHeader
        title="Prescriptions"
        description={
          patient
            ? `${patient.firstName} ${patient.lastName}`
            : "Patient prescriptions"
        }
      />

      <ErrorAlert message={error} />

      {prescriptions.length === 0 ? (
        <div
          className="
            rounded-xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-10
            text-center
            text-slate-500
          "
        >
          No prescriptions found.
        </div>
      ) : (
        <div
          className="
            grid
            gap-5
            md:grid-cols-2
          "
        >
          {prescriptions.map((prescription) => (
            <article
              key={prescription.prescriptionId}
              className="
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
            >
              <h2
                className="
                    text-lg
                    font-semibold
                    text-slate-900
                  "
              >
                {prescription.medicationName}
              </h2>

              <div className="mt-4 space-y-3">
                <div>
                  <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        text-slate-500
                      "
                  >
                    Dosage
                  </p>

                  <p className="mt-1 text-slate-800">
                    {prescription.dosage || "—"}
                  </p>
                </div>

                <div>
                  <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        text-slate-500
                      "
                  >
                    Instructions
                  </p>

                  <p className="mt-1 text-slate-800">
                    {prescription.instructions || "—"}
                  </p>
                </div>

                <div>
                  <p
                    className="
                        text-xs
                        font-semibold
                        uppercase
                        text-slate-500
                      "
                  >
                    Prescribed Date
                  </p>

                  <p className="mt-1 text-slate-800">
                    {formatDateTime(prescription.prescribedDate)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default PrescriptionList;
