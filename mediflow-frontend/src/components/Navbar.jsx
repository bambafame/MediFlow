import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div
        className="
          mx-auto
          flex
          max-w-7xl
          items-center
          justify-between
          px-6
          py-4
        "
      >
        <NavLink to="/" className="text-xl font-bold text-blue-700">
          MediFlow
        </NavLink>

        <div className="flex gap-2">
          <NavLink to="/" className={linkClass} end>
            Dashboard
          </NavLink>

          <NavLink to="/patients" className={linkClass}>
            Patients
          </NavLink>

          <NavLink to="/doctors" className={linkClass}>
            Doctors
          </NavLink>

          <NavLink to="/specializations" className={linkClass}>
            Specializations
          </NavLink>

          <NavLink to="/appointments" className={linkClass}>
            Appointments
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
