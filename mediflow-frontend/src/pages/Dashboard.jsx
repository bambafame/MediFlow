import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getDashboard } from "../services/dashboardService";

import { useAuth } from "../context/useAuth";

import { formatDateTime } from "../utils/timeUtils";

import { getAppointmentStatusClass } from "../utils/appointmentUtils";

import LoadingSpinner from "../components/LoadingSpinner";

import ErrorAlert from "../components/ErrorAlert";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const { auth } = useAuth();

  /*
   * Roles
   */
  const isAdmin = auth?.role === "ADMIN";

  const isReceptionist = auth?.role === "RECEPTIONIST";

  const isDoctor = auth?.role === "DOCTOR";

  const isPatient = auth?.role === "PATIENT";

  const isClinicStaff = isAdmin || isReceptionist;

  /*
   * Load role-aware dashboard.
   *
   * The backend decides which data
   * the authenticated user may see.
   */
  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        const data = await getDashboard();

        if (!cancelled) {
          setDashboard(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Unable to load dashboard.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!dashboard) {
    return <ErrorAlert message={error || "Unable to load dashboard."} />;
  }

  /*
   * Role-specific page content
   */
  const pageTitle = isPatient
    ? "My Dashboard"
    : isDoctor
      ? "Doctor Dashboard"
      : "Dashboard";

  const pageDescription = isPatient
    ? "View your appointments and upcoming care."
    : isDoctor
      ? "View your assigned appointments and clinical schedule."
      : "Clinic activity and upcoming appointments.";

  const todayTitle = isPatient
    ? "Today's Appointments"
    : isDoctor
      ? "Today's Schedule"
      : "Today's Clinic Schedule";

  const todayDescription = isPatient
    ? "Your appointments scheduled for today."
    : isDoctor
      ? "Appointments assigned to you today."
      : "Appointments scheduled for today.";

  const upcomingTitle = isPatient
    ? "My Upcoming Appointments"
    : isDoctor
      ? "Upcoming Assigned Appointments"
      : "Upcoming Appointments";

  const upcomingDescription = isPatient
    ? "Your next scheduled appointments."
    : isDoctor
      ? "Your next assigned appointments."
      : "Next scheduled clinic visits.";

  return (
    <div>
      {/* Header */}

      <div
        className="
          mb-8
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
              text-slate-900
            "
          >
            {pageTitle}
          </h1>

          <p
            className="
              mt-2
              text-slate-500
            "
          >
            {pageDescription}
          </p>
        </div>

        {/* Quick Actions */}

        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >
          {/* ADMIN / RECEPTIONIST */}

          {isClinicStaff && (
            <>
              <Link
                to="/patients/new"
                className="
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                + Patient
              </Link>

              <Link
                to="/doctors/new"
                className="
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:bg-slate-50
                "
              >
                + Doctor
              </Link>

              <Link
                to="/appointments/new"
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
                + Book Appointment
              </Link>
            </>
          )}

          {/* PATIENT */}

          {isPatient && (
            <Link
              to="/appointments/new"
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
              + Book Appointment
            </Link>
          )}

          {/* DOCTOR */}

          {isDoctor && (
            <Link
              to="/appointments"
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
              View My Schedule
            </Link>
          )}
        </div>
      </div>

      <ErrorAlert message={error} />

      {/* Statistics */}

      <div
        className="
          grid
          gap-5
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* Clinic-wide statistics:
            ADMIN / RECEPTIONIST only */}

        {isClinicStaff && (
          <>
            <StatCard
              title="Patients"
              value={dashboard.totalPatients ?? 0}
              description="Registered patients"
              link="/patients"
            />

            <StatCard
              title="Doctors"
              value={dashboard.totalDoctors ?? 0}
              description="Medical staff"
              link="/doctors"
            />
          </>
        )}

        {/* Appointment total */}

        <StatCard
          title={isClinicStaff ? "Appointments" : "My Appointments"}
          value={dashboard.totalAppointments ?? 0}
          description={
            isPatient
              ? "Your total appointments"
              : isDoctor
                ? "Appointments assigned to you"
                : "Total appointments"
          }
          link="/appointments"
        />

        {/* Today */}

        <StatCard
          title="Today"
          value={dashboard.todayAppointments?.length || 0}
          description={
            isPatient
              ? "Your appointments today"
              : isDoctor
                ? "Assigned appointments today"
                : "Appointments today"
          }
          link="/appointments"
        />

        {/* For doctor/patient, add useful
            personal statistics so the top
            section still contains four cards */}

        {!isClinicStaff && (
          <>
            <StatCard
              title="Upcoming"
              value={dashboard.upcomingAppointments?.length || 0}
              description={
                isPatient
                  ? "Your upcoming appointments"
                  : "Your upcoming schedule"
              }
              link="/appointments"
            />

            <StatCard
              title="Completed"
              value={dashboard.completedAppointments ?? 0}
              description={
                isPatient ? "Completed appointments" : "Completed consultations"
              }
              link="/appointments?status=COMPLETED"
            />
          </>
        )}
      </div>

      {/* Appointment Status */}

      <section
        className="
          mt-8
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
          {isClinicStaff ? "Appointment Status" : "My Appointment Status"}
        </h2>

        <div
          className="
            mt-5
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <StatusCard
            label="Scheduled"
            value={dashboard.scheduledAppointments ?? 0}
            status="SCHEDULED"
          />

          <StatusCard
            label="Confirmed"
            value={dashboard.confirmedAppointments ?? 0}
            status="CONFIRMED"
          />

          <StatusCard
            label="Completed"
            value={dashboard.completedAppointments ?? 0}
            status="COMPLETED"
          />

          <StatusCard
            label="Cancelled"
            value={dashboard.cancelledAppointments ?? 0}
            status="CANCELLED"
          />
        </div>
      </section>

      {/* Today's Schedule + Recent Patients */}

      <div
        className={`
          mt-8
          grid
          gap-8
          ${isClinicStaff ? "xl:grid-cols-3" : "grid-cols-1"}
        `}
      >
        {/* Today's Schedule */}

        <section
          className={`
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
            ${isClinicStaff ? "xl:col-span-2" : ""}
          `}
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-200
              p-6
            "
          >
            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-900
                "
              >
                {todayTitle}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                {todayDescription}
              </p>
            </div>

            <Link
              to="/appointments"
              className="
                text-sm
                font-medium
                text-blue-600
                hover:text-blue-800
              "
            >
              View all
            </Link>
          </div>

          {dashboard.todayAppointments?.length === 0 ? (
            <div
              className="
                p-10
                text-center
                text-slate-500
              "
            >
              No appointments scheduled for today.
            </div>
          ) : (
            <div
              className="
                divide-y
                divide-slate-100
              "
            >
              {dashboard.todayAppointments?.map((appointment) => (
                <AppointmentRow
                  key={appointment.appointmentId}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Patients:
            ADMIN / RECEPTIONIST only */}

        {isClinicStaff && (
          <section
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >
            <div
              className="
                border-b
                border-slate-200
                p-6
              "
            >
              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-900
                "
              >
                Recent Patients
              </h2>
            </div>

            {dashboard.recentPatients?.length === 0 ? (
              <div
                className="
                  p-8
                  text-center
                  text-sm
                  text-slate-500
                "
              >
                No patients yet.
              </div>
            ) : (
              <div
                className="
                  divide-y
                  divide-slate-100
                "
              >
                {dashboard.recentPatients?.map((patient) => (
                  <Link
                    key={patient.id}
                    to={`/patients/${patient.id}`}
                    className="
                        block
                        p-5
                        transition
                        hover:bg-slate-50
                      "
                  >
                    <div
                      className="
                          flex
                          items-center
                          gap-3
                        "
                    >
                      <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-100
                            font-semibold
                            text-blue-700
                          "
                      >
                        {patient.firstName?.[0]}

                        {patient.lastName?.[0]}
                      </div>

                      <div>
                        <div
                          className="
                              font-medium
                              text-slate-900
                            "
                        >
                          {patient.firstName} {patient.lastName}
                        </div>

                        <div
                          className="
                              text-sm
                              text-slate-500
                            "
                        >
                          {patient.email}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Upcoming Appointments */}

      <section
        className="
          mt-8
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            p-6
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-semibold
                text-slate-900
              "
            >
              {upcomingTitle}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              {upcomingDescription}
            </p>
          </div>

          <Link
            to="/appointments"
            className="
              text-sm
              font-medium
              text-blue-600
              hover:text-blue-800
            "
          >
            View all
          </Link>
        </div>

        {dashboard.upcomingAppointments?.length === 0 ? (
          <div
            className="
              p-10
              text-center
              text-slate-500
            "
          >
            No upcoming appointments.
          </div>
        ) : (
          <div
            className="
              divide-y
              divide-slate-100
            "
          >
            {dashboard.upcomingAppointments?.map((appointment) => (
              <AppointmentRow
                key={appointment.appointmentId}
                appointment={appointment}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/*
 * Main dashboard statistics card
 */
function StatCard({ title, value, description, link }) {
  return (
    <Link
      to={link}
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition
        hover:border-blue-300
        hover:shadow-md
      "
    >
      <p
        className="
          text-sm
          font-medium
          text-slate-500
        "
      >
        {title}
      </p>

      <p
        className="
          mt-3
          text-3xl
          font-bold
          text-slate-900
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-sm
          text-slate-500
        "
      >
        {description}
      </p>
    </Link>
  );
}

/*
 * Appointment status statistics
 */
function StatusCard({ label, value, status }) {
  return (
    <div
      className="
        rounded-lg
        border
        border-slate-200
        p-4
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
          ${getAppointmentStatusClass(status)}
        `}
      >
        {label}
      </span>

      <p
        className="
          mt-3
          text-2xl
          font-bold
          text-slate-900
        "
      >
        {value}
      </p>
    </div>
  );
}

/*
 * Reusable appointment row for
 * today/upcoming dashboard sections.
 */
function AppointmentRow({ appointment }) {
  return (
    <Link
      to={`/appointments/${appointment.appointmentId}`}
      className="
        flex
        flex-col
        gap-4
        p-5
        transition
        hover:bg-slate-50
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div>
        <p
          className="
            font-semibold
            text-slate-900
          "
        >
          {appointment.patientName}
        </p>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Dr. {appointment.doctorName}
          {" • "}
          {appointment.specialization}
        </p>
      </div>

      <div
        className="
          flex
          items-center
          gap-5
        "
      >
        <div className="text-right">
          <p
            className="
              text-sm
              font-medium
              text-slate-800
            "
          >
            {formatDateTime(appointment.startDateTime)}
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            {appointment.reason}
          </p>
        </div>

        <span
          className={`
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
      </div>
    </Link>
  );
}

export default Dashboard;
