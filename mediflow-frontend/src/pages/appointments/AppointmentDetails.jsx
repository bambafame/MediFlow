import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  cancelAppointment,
  confirmAppointment,
  getAppointmentById,
} from "../../services/appointmentService";

import { formatDateTime } from "../../utils/timeUtils";

import { getAppointmentStatusClass } from "../../utils/appointmentUtils";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import DetailItem from "../../components/DetailItem";
import { useAuth } from "../../context/useAuth";

function AppointmentDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);

  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");

  const { auth } = useAuth();

  const isAdmin = auth?.role === "ADMIN";

  const isReceptionist = auth?.role === "RECEPTIONIST";

  const isDoctor = auth?.role === "DOCTOR";

  const isPatient = auth?.role === "PATIENT";

  const canConfirm =
    (isAdmin || isReceptionist) && appointment?.status === "SCHEDULED";

  const isAppointmentPatient =
    isPatient && Number(appointment?.patientId) === Number(auth?.userId);

  const canReschedule =
    (isAdmin || isReceptionist || isAppointmentPatient) &&
    (appointment?.status === "SCHEDULED" ||
      appointment?.status === "CONFIRMED");

  const canCancel =
    (isAdmin || isReceptionist || isAppointmentPatient) &&
    (appointment?.status === "SCHEDULED" ||
      appointment?.status === "CONFIRMED");

  const isAssignedDoctor =
    isDoctor && Number(appointment?.doctorId) === Number(auth?.userId);

  const canStartConsultation =
    (isAdmin || isAssignedDoctor) && appointment?.status === "CONFIRMED";

  const canViewConsultation = appointment?.status === "COMPLETED";

  useEffect(() => {
    let cancelled = false;

    const loadAppointment = async () => {
      try {
        const data = await getAppointmentById(id);

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
  }, [id]);

  const handleConfirm = async () => {
    setProcessing(true);
    setError("");

    try {
      const updated = await confirmAppointment(id);

      setAppointment(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to confirm appointment.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) {
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const updated = await cancelAppointment(id);

      setAppointment(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel appointment.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!appointment) {
    return <ErrorAlert message={error || "Appointment not found."} />;
  }

  return (
    <div>
      <PageHeader
        title="Appointment Details"
        description={`Appointment #${appointment.appointmentId}`}
        action={
          <div className="flex flex-wrap gap-3">
            {canConfirm && (
              <button
                onClick={handleConfirm}
                disabled={processing}
                className="
                  rounded-lg
                  bg-green-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-green-700
                  disabled:opacity-50
                "
              >
                Confirm
              </button>
            )}

            {canReschedule && (
              <Link
                to={`/appointments/${appointment.appointmentId}/reschedule`}
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
                Reschedule
              </Link>
            )}

            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={processing}
                className="
                  rounded-lg
                  bg-red-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-red-700
                  disabled:opacity-50
                "
              >
                Cancel
              </button>
            )}

            {canStartConsultation && (
              <Link
                to={`/appointments/${appointment.appointmentId}/consultation/new`}
                className="
                  rounded-lg
                  bg-purple-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-purple-700
                "
              >
                Start Consultation
              </Link>
            )}

            {canViewConsultation && (
              <Link
                to={`/appointments/${appointment.appointmentId}/consultation`}
                className="
                  rounded-lg
                  bg-slate-700
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-slate-800
                "
              >
                View Consultation
              </Link>
            )}
          </div>
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
        <div
          className="
            mb-8
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
              {appointment.patientName}
            </h2>

            <p className="mt-1 text-slate-500">
              with Dr. {appointment.doctorName}
            </p>
          </div>

          <span
            className={`
              rounded-full
              px-4
              py-1.5
              text-sm
              font-semibold
              ${getAppointmentStatusClass(appointment.status)}
            `}
          >
            {appointment.status}
          </span>
        </div>

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

          <DetailItem
            label="Start"
            value={formatDateTime(appointment.startDateTime)}
          />

          <DetailItem
            label="End"
            value={formatDateTime(appointment.endDateTime)}
          />

          <DetailItem label="Status" value={appointment.status} />
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
            Reason for Visit
          </h3>

          <p
            className="
              mt-2
              text-slate-800
            "
          >
            {appointment.reason}
          </p>
        </div>
      </section>

      <div
        className="
          mt-6
          flex
          justify-between
        "
      >
        <button
          onClick={() => navigate(-1)}
          className="
            text-sm
            font-medium
            text-blue-600
            hover:text-blue-800
          "
        >
          ← Back
        </button>

        <Link
          to="/appointments"
          className="
            text-sm
            font-medium
            text-blue-600
            hover:text-blue-800
          "
        >
          All Appointments
        </Link>
      </div>
    </div>
  );
}

export default AppointmentDetails;
