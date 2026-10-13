import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="MediFlow Dashboard"
        description="Patient Appointment and Clinic Management System"
      />

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          lg:grid-cols-3
        "
      >
        <Link
          to="/patients"
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            transition
            hover:-translate-y-1
            hover:shadow-md
          "
        >
          <h2 className="text-lg font-semibold text-slate-900">Patients</h2>

          <p className="mt-2 text-sm text-slate-500">
            View, register, update, and manage patients.
          </p>
        </Link>

        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-6
            opacity-60
          "
        >
          <h2 className="text-lg font-semibold text-slate-900">Doctors</h2>

          <p className="mt-2 text-sm text-slate-500">
            Doctor management will be added next.
          </p>
        </div>

        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-6
            opacity-60
          "
        >
          <h2 className="text-lg font-semibold text-slate-900">Appointments</h2>

          <p className="mt-2 text-sm text-slate-500">
            Appointment scheduling will be added later.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
