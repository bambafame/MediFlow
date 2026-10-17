import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import {
  getAppointments,
  getDoctorAppointments,
  getPatientAppointments,
} from "../../services/appointmentService";

import { getPatients } from "../../services/patientService";

import { getDoctors } from "../../services/doctorService";

import { useAuth } from "../../context/useAuth";

import PageHeader from "../../components/PageHeader";

import LoadingSpinner from "../../components/LoadingSpinner";

import ErrorAlert from "../../components/ErrorAlert";

import { formatDateTime } from "../../utils/timeUtils";

import { getAppointmentStatusClass } from "../../utils/appointmentUtils";

function AppointmentList() {
  const { auth } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * Roles
   */
  const isAdmin = auth?.role === "ADMIN";

  const isReceptionist = auth?.role === "RECEPTIONIST";

  const isDoctor = auth?.role === "DOCTOR";

  const isPatient = auth?.role === "PATIENT";

  const canViewAll = isAdmin || isReceptionist;

  const canBook = isAdmin || isReceptionist || isPatient;

  /*
   * URL filters
   */
  const patientId = searchParams.get("patientId") || "";

  const doctorId = searchParams.get("doctorId") || "";

  const status = searchParams.get("status") || "";

  const date = searchParams.get("date") || "";

  /*
   * API data
   */
  const [appointments, setAppointments] = useState([]);

  const [patients, setPatients] = useState([]);

  const [doctors, setDoctors] = useState([]);

  /*
   * UI state
   */
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /*
   * Load only data allowed for
   * the currently authenticated role.
   */
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        /*
         * ADMIN / RECEPTIONIST
         *
         * Can see all appointments,
         * all patients and all doctors.
         */
        if (canViewAll) {
          const [appointmentData, patientData, doctorData] = await Promise.all([
            getAppointments(),
            getPatients(),
            getDoctors(),
          ]);

          if (!cancelled) {
            setAppointments(appointmentData);

            setPatients(patientData);

            setDoctors(doctorData);
          }

          return;
        }

        /*
         * DOCTOR
         *
         * Only appointments assigned
         * to the logged-in doctor.
         *
         * Doctors may read patients,
         * therefore patient filtering
         * is available.
         */
        if (isDoctor) {
          const [appointmentData, patientData] = await Promise.all([
            getDoctorAppointments(auth.userId),

            getPatients(),
          ]);

          if (!cancelled) {
            setAppointments(appointmentData);

            setPatients(patientData);
          }

          return;
        }

        /*
         * PATIENT
         *
         * Only own appointments.
         *
         * Patients may read doctors,
         * therefore doctor filtering
         * remains available.
         */
        if (isPatient) {
          const [appointmentData, doctorData] = await Promise.all([
            getPatientAppointments(auth.userId),

            getDoctors(),
          ]);

          if (!cancelled) {
            setAppointments(appointmentData);

            setDoctors(doctorData);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load appointments.",
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
  }, [auth?.userId, canViewAll, isDoctor, isPatient]);

  /*
   * Change query-string filter.
   *
   * No second useEffect is required.
   */
  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    setSearchParams(params);
  };

  /*
   * Clear allowed filters.
   */
  const clearFilters = () => {
    setSearchParams({});
  };

  /*
   * Filter already-authorized
   * appointment data.
   */
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (
        !isPatient &&
        patientId &&
        String(appointment.patientId) !== patientId
      ) {
        return false;
      }

      if (!isDoctor && doctorId && String(appointment.doctorId) !== doctorId) {
        return false;
      }

      if (status && appointment.status !== status) {
        return false;
      }

      if (date) {
        const appointmentDate = appointment.startDateTime?.split("T")[0];

        if (appointmentDate !== date) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, patientId, doctorId, status, date, isDoctor, isPatient]);

  const bookingParams = new URLSearchParams();

  if (isPatient && auth?.userId) {
    bookingParams.set("patientId", String(auth.userId));
  } else {
    if (patientId) {
      bookingParams.set("patientId", patientId);
    }

    if (doctorId) {
      bookingParams.set("doctorId", doctorId);
    }
  }

  const bookingQuery = bookingParams.toString();

  const bookingUrl = bookingQuery
    ? `/appointments/new?${bookingQuery}`
    : "/appointments/new";

  const hasActiveFilters = Boolean(
    status || date || (!isPatient && patientId) || (!isDoctor && doctorId),
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <PageHeader
        title="Appointments"
        description={
          isDoctor
            ? "View your assigned appointments."
            : isPatient
              ? "View and manage your appointments."
              : "View and manage clinic appointments."
        }
        action={
          canBook ? (
            <Link
              to={bookingUrl}
              className="
                rounded-lg
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-blue-700
              "
            >
              + Book Appointment
            </Link>
          ) : null
        }
      />

      <ErrorAlert message={error} />

      {/* Filters */}

      <section
        className="
          mb-6
          rounded-xl
          border
          border-slate-200
          bg-white
          p-5
          shadow-sm
        "
      >
        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {/* Patient filter
              hidden for PATIENT */}

          {!isPatient && (
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
                value={patientId}
                onChange={handleFilterChange}
                className="
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
                "
              >
                <option value="">All patients</option>

                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Doctor filter
              hidden for DOCTOR */}

          {!isDoctor && (
            <div>
              <label
                htmlFor="doctorId"
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Doctor
              </label>

              <select
                id="doctorId"
                name="doctorId"
                value={doctorId}
                onChange={handleFilterChange}
                className="
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
                "
              >
                <option value="">All doctors</option>

                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status */}

          <div>
            <label
              htmlFor="status"
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={status}
              onChange={handleFilterChange}
              className="
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
              "
            >
              <option value="">All statuses</option>

              <option value="SCHEDULED">Scheduled</option>

              <option value="CONFIRMED">Confirmed</option>

              <option value="COMPLETED">Completed</option>

              <option value="CANCELLED">Cancelled</option>

              <option value="NO_SHOW">No Show</option>
            </select>
          </div>

          {/* Date */}

          <div>
            <label
              htmlFor="date"
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Date
            </label>

            <input
              id="date"
              type="date"
              name="date"
              value={date}
              onChange={handleFilterChange}
              className="
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
              "
            />
          </div>
        </div>

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            border-t
            border-slate-100
            pt-4
          "
        >
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span
              className="
                font-semibold
                text-slate-700
              "
            >
              {filteredAppointments.length}
            </span>{" "}
            appointment
            {filteredAppointments.length === 1 ? "" : "s"}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="
                rounded-lg
                border
                border-slate-300
                px-4
                py-2
                text-sm
                font-medium
                text-slate-700
                hover:bg-slate-50
              "
            >
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* Empty state */}

      {filteredAppointments.length === 0 ? (
        <div
          className="
            rounded-xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-12
            text-center
          "
        >
          <h2 className="text-lg font-semibold text-slate-800">
            No appointments found
          </h2>

          <p className="mt-2 text-slate-500">
            {hasActiveFilters
              ? "Try changing or clearing the filters."
              : "There are currently no appointments to display."}
          </p>

          {canBook && (
            <Link
              to={bookingUrl}
              className="
                mt-5
                inline-block
                rounded-lg
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                hover:bg-blue-700
              "
            >
              Book Appointment
            </Link>
          )}
        </div>
      ) : (
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      text-slate-600
                    "
                  >
                    Patient
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      text-slate-600
                    "
                  >
                    Doctor
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      text-slate-600
                    "
                  >
                    Date / Time
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      text-slate-600
                    "
                  >
                    Reason
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      text-slate-600
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      px-6
                      py-4
                      text-right
                      text-xs
                      font-semibold
                      uppercase
                      text-slate-600
                    "
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody
                className="
                  divide-y
                  divide-slate-100
                "
              >
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.appointmentId}
                    className="
                        transition
                        hover:bg-slate-50
                      "
                  >
                    {/* Patient */}

                    <td className="px-6 py-4">
                      {isPatient ? (
                        <span
                          className="
                              font-medium
                              text-slate-900
                            "
                        >
                          {appointment.patientName}
                        </span>
                      ) : (
                        <Link
                          to={`/patients/${appointment.patientId}`}
                          className="
                              font-medium
                              text-slate-900
                              hover:text-blue-600
                            "
                        >
                          {appointment.patientName}
                        </Link>
                      )}
                    </td>

                    {/* Doctor */}

                    <td className="px-6 py-4">
                      <Link
                        to={`/doctors/${appointment.doctorId}`}
                        className="
                            font-medium
                            text-slate-900
                            hover:text-blue-600
                          "
                      >
                        Dr. {appointment.doctorName}
                      </Link>

                      <div
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                          "
                      >
                        {appointment.specialization || "—"}
                      </div>
                    </td>

                    {/* Date */}

                    <td
                      className="
                          whitespace-nowrap
                          px-6
                          py-4
                          text-sm
                          text-slate-600
                        "
                    >
                      {formatDateTime(appointment.startDateTime)}
                    </td>

                    {/* Reason */}

                    <td
                      className="
                          max-w-xs
                          px-6
                          py-4
                          text-sm
                          text-slate-600
                        "
                    >
                      <p className="truncate" title={appointment.reason}>
                        {appointment.reason}
                      </p>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">
                      <span
                        className={`
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            ${getAppointmentStatusClass(appointment.status)}
                          `}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {/* Action */}

                    <td
                      className="
                          px-6
                          py-4
                          text-right
                        "
                    >
                      <Link
                        to={`/appointments/${appointment.appointmentId}`}
                        className="
                            rounded-md
                            border
                            border-slate-300
                            px-3
                            py-1.5
                            text-sm
                            font-medium
                            text-slate-700
                            hover:bg-slate-100
                          "
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
