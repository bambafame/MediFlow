import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { getConsultationByAppointment } from "../../services/consultationService";

import { getConsultationPrescriptions } from "../../services/prescriptionService";

import { getAppointmentById } from "../../services/appointmentService";

import { useAuth } from "../../context/useAuth";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import DetailItem from "../../components/DetailItem";
import { formatDateTime } from "../../utils/timeUtils";

function ConsultationDetails() {
  const { appointmentId } = useParams();

  const [consultation, setConsultation] = useState(null);

  const [prescriptions, setPrescriptions] = useState([]);

  const [appointment, setAppointment] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const { auth } = useAuth();

  const isAdmin = auth?.role === "ADMIN";

  const isDoctor = auth?.role === "DOCTOR";

  const isPatient = auth?.role === "PATIENT";

  const isAssignedDoctor =
    isDoctor && Number(appointment?.doctorId) === Number(auth?.userId);

  const isAppointmentPatient =
    isPatient && Number(appointment?.patientId) === Number(auth?.userId);

  const canViewConsultation =
    isAdmin || isAssignedDoctor || isAppointmentPatient;

  const canAddPrescription = isAdmin || isAssignedDoctor;

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const consultationData =
          await getConsultationByAppointment(appointmentId);

        if (cancelled) {
          return;
        }

        const [appointmentData, prescriptionData] = await Promise.all([
          getAppointmentById(appointmentId),

          getConsultationPrescriptions(consultationData.consultationId),
        ]);

        if (!cancelled) {
          setConsultation(consultationData);

          setAppointment(appointmentData);

          setPrescriptions(prescriptionData);
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

    loadData();

    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!consultation || !appointment) {
    return <ErrorAlert message={error || "Consultation not found."} />;
  }

  if (!loading && !canViewConsultation) {
    return (
      <ErrorAlert message="You are not authorized to view this consultation." />
    );
  }

  return (
    <div>
      <PageHeader
        title="Consultation"
        description={`Appointment #${appointmentId}`}
        action={
          canAddPrescription && (
            <Link
              to={`/appointments/${appointmentId}/consultation/prescriptions/new`}
              className="
                rounded-lg
                bg-blue-600
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                hover:bg-blue-700
              "
            >
              + Add Prescription
            </Link>
          )
        }
      />

      <ErrorAlert message={error} />

      <section
        className="
          rounded-xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <dl
          className="
            grid
            gap-8
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          <DetailItem label="Patient" value={appointment.patientName} />

          <DetailItem label="Doctor" value={`Dr. ${appointment.doctorName}`} />

          <DetailItem
            label="Specialization"
            value={appointment.specialization}
          />

          <DetailItem label="Diagnosis" value={consultation.diagnosis} />

          <DetailItem
            label="Consultation ID"
            value={consultation.consultationId}
          />
        </dl>

        <div
          className="
            mt-8
            border-t
            border-slate-200
            pt-6
          "
        >
          <h3
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            Consultation Notes
          </h3>

          <p
            className="
              mt-3
              whitespace-pre-wrap
              text-slate-800
            "
          >
            {consultation.notes}
          </p>
        </div>
      </section>

      <section
        className="
          mt-8
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
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-semibold
                text-slate-900
              "
            >
              Prescriptions
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Medications prescribed during this consultation.
            </p>
          </div>

          <Link
            to={`/appointments/${appointmentId}/consultation/prescriptions/new`}
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
            + Add Prescription
          </Link>
        </div>

        {prescriptions.length === 0 ? (
          <div
            className="
              mt-6
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
            No prescriptions have been added.
          </div>
        ) : (
          <div
            className="
              mt-6
              grid
              gap-4
              md:grid-cols-2
            "
          >
            {prescriptions.map((prescription) => (
              <div
                key={prescription.prescriptionId}
                className="
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  p-5
                "
              >
                <h3
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  {prescription.medicationName}
                </h3>

                <div
                  className="
                    mt-4
                    space-y-3
                    text-sm
                  "
                >
                  <div>
                    <span
                      className="
                        font-medium
                        text-slate-500
                      "
                    >
                      Dosage
                    </span>

                    <p
                      className="
                        mt-1
                        text-slate-800
                      "
                    >
                      {prescription.dosage || "—"}
                    </p>
                  </div>

                  <div>
                    <span
                      className="
                        font-medium
                        text-slate-500
                      "
                    >
                      Instructions
                    </span>

                    <p
                      className="
                        mt-1
                        text-slate-800
                      "
                    >
                      {prescription.instructions || "—"}
                    </p>
                  </div>

                  <div>
                    <span
                      className="
                        font-medium
                        text-slate-500
                      "
                    >
                      Prescribed
                    </span>

                    <p
                      className="
                        mt-1
                        text-slate-800
                      "
                    >
                      {formatDateTime(prescription.prescribedDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6">
        <Link
          to={`/appointments/${appointmentId}`}
          className="
            text-sm
            font-medium
            text-blue-600
            hover:text-blue-800
          "
        >
          ← Back to Appointment
        </Link>
      </div>
    </div>
  );
}

export default ConsultationDetails;
