import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import { getAppointments } from "../../services/appointmentService";

import { getPatients } from "../../services/patientService";

import { getDoctors } from "../../services/doctorService";

import PageHeader from "../../components/PageHeader";

import LoadingSpinner from "../../components/LoadingSpinner";

import ErrorAlert from "../../components/ErrorAlert";

import { formatDateTime } from "../../utils/timeUtils";

import { getAppointmentStatusClass } from "../../utils/appointmentUtils";

function AppointmentList() {
  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * URL query parameters are the
   * single source of truth for filters.
   *
   * Examples:
   *
   * /appointments?patientId=1
   * /appointments?doctorId=2
   * /appointments?status=CONFIRMED
   * /appointments?date=2026-10-20
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
   * Load appointments, patients,
   * and doctors once.
   *
   * This is the only useEffect required.
   */
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
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
  }, []);

  /*
   * Update a query parameter
   * immediately when a filter changes.
   *
   * Example:
   *
   * doctorId = 2
   *
   * URL becomes:
   *
   * /appointments?doctorId=2
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
   * Remove all filters.
   */
  const clearFilters = () => {
    setSearchParams({});
  };

  /*
   * Filter the appointments already
   * loaded from the backend.
   *
   * No second useEffect is needed.
   */
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      /*
       * Patient
       */
      if (patientId && String(appointment.patientId) !== patientId) {
        return false;
      }

      /*
       * Doctor
       */
      if (doctorId && String(appointment.doctorId) !== doctorId) {
        return false;
      }

      /*
       * Status
       */
      if (status && appointment.status !== status) {
        return false;
      }

      /*
       * Date
       *
       * startDateTime example:
       * 2026-10-20T09:00:00
       */
      if (date) {
        const appointmentDate = appointment.startDateTime?.split("T")[0];

        if (appointmentDate !== date) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, patientId, doctorId, status, date]);

  /*
   * Keep existing filters when
   * navigating to Book Appointment.
   *
   * Example:
   *
   * If patientId=5 is active,
   * booking will open with patient 5
   * already selected.
   */
  const bookingParams = new URLSearchParams();

  if (patientId) {
    bookingParams.set("patientId", patientId);
  }

  if (doctorId) {
    bookingParams.set("doctorId", doctorId);
  }

  const bookingUrl = bookingParams.toString()
    ? `/appointments/new?${bookingParams.toString()}`
    : "/appointments/new";

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="View and manage clinic appointments."
        action={
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
          {/* Patient filter */}

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

          {/* Doctor filter */}

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

          {/* Status filter */}

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

          {/* Date filter */}

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

        {/* Filter controls */}

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
          <p
            className="
              text-sm
              text-slate-500
            "
          >
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

          {(patientId || doctorId || status || date) && (
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
          <h2
            className="
              text-lg
              font-semibold
              text-slate-800
            "
          >
            No appointments found
          </h2>

          <p
            className="
              mt-2
              text-slate-500
            "
          >
            Try changing the filters or book a new appointment.
          </p>

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
        </div>
      ) : (
        /* Appointment table */

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

                    <td
                      className="
                          px-6
                          py-4
                        "
                    >
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
                    </td>

                    {/* Doctor */}

                    <td
                      className="
                          px-6
                          py-4
                        "
                    >
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
                      <p
                        className="
                            truncate
                          "
                        title={appointment.reason}
                      >
                        {appointment.reason}
                      </p>
                    </td>

                    {/* Status */}

                    <td
                      className="
                          px-6
                          py-4
                        "
                    >
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

                    {/* Actions */}

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
