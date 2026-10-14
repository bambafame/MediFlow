import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getDashboard } from "../services/dashboardService";

import { formatDateTime } from "../utils/timeUtils";

import { getAppointmentStatusClass } from "../utils/appointmentUtils";

import LoadingSpinner from "../components/LoadingSpinner";

import ErrorAlert from "../components/ErrorAlert";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

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
            Dashboard
          </h1>

          <p
            className="
              mt-2
              text-slate-500
            "
          >
            Clinic activity and upcoming appointments.
          </p>
        </div>

        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >
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
        <StatCard
          title="Patients"
          value={dashboard.totalPatients}
          description="Registered patients"
          link="/patients"
        />

        <StatCard
          title="Doctors"
          value={dashboard.totalDoctors}
          description="Medical staff"
          link="/doctors"
        />

        <StatCard
          title="Appointments"
          value={dashboard.totalAppointments}
          description="Total appointments"
          link="/appointments"
        />

        <StatCard
          title="Today"
          value={dashboard.todayAppointments?.length || 0}
          description="Appointments today"
          link="/appointments"
        />
      </div>

      {/* Status */}

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
          Appointment Status
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
            value={dashboard.scheduledAppointments}
            status="SCHEDULED"
          />

          <StatusCard
            label="Confirmed"
            value={dashboard.confirmedAppointments}
            status="CONFIRMED"
          />

          <StatusCard
            label="Completed"
            value={dashboard.completedAppointments}
            status="COMPLETED"
          />

          <StatusCard
            label="Cancelled"
            value={dashboard.cancelledAppointments}
            status="CANCELLED"
          />
        </div>
      </section>

      <div
        className="
          mt-8
          grid
          gap-8
          xl:grid-cols-3
        "
      >
        {/* Today's Schedule */}

        <section
          className="
            xl:col-span-2
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
                Today's Schedule
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Appointments scheduled for today.
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

          {dashboard.todayAppointments.length === 0 ? (
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
              {dashboard.todayAppointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.appointmentId}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Patients */}

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

          {dashboard.recentPatients.length === 0 ? (
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
              {dashboard.recentPatients.map((patient) => (
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
      </div>

      {/* Upcoming */}

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
              Upcoming Appointments
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Next scheduled clinic visits.
            </p>
          </div>
        </div>

        {dashboard.upcomingAppointments.length === 0 ? (
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
            {dashboard.upcomingAppointments.map((appointment) => (
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
        <div
          className="
            text-right
          "
        >
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
