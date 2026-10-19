import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/useAuth";

function Navbar() {
  const { auth, logout } = useAuth();

  const isAdmin = auth?.role === "ADMIN";

  const isReceptionist = auth?.role === "RECEPTIONIST";

  const isDoctor = auth?.role === "DOCTOR";

  const isPatient = auth?.role === "PATIENT";

  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
    }`;

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <nav
      className="
        border-b
        border-slate-200
        bg-white
      "
    >
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
        <NavLink
          to="/"
          className="
            text-xl
            font-bold
            text-blue-700
          "
        >
          MediFlow
        </NavLink>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <NavLink to="/" className={linkClass} end>
            Dashboard
          </NavLink>

          {(isAdmin || isReceptionist || isDoctor) && (
            <NavLink to="/patients" className={linkClass}>
              Patients
            </NavLink>
          )}

          {(isAdmin || isReceptionist || isDoctor || isPatient) && (
            <NavLink to="/doctors" className={linkClass}>
              Doctors
            </NavLink>
          )}

          {(isAdmin || isReceptionist) && (
            <NavLink to="/specializations" className={linkClass}>
              Specializations
            </NavLink>
          )}

          <NavLink to="/appointments" className={linkClass}>
            Appointments
          </NavLink>

          {auth?.role === "ADMIN" && (
            <NavLink to="/admin/users" className={linkClass}>
              User Management
            </NavLink>
          )}
        </div>

        <div
          className="
            flex
            items-center
            gap-4
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
              {auth?.username}
            </p>

            <p
              className="
                text-xs
                text-slate-500
              "
            >
              {auth?.role}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="
              rounded-lg
              border
              border-slate-300
              px-3
              py-2
              text-sm
              font-medium
              text-slate-700
              hover:bg-slate-100
            "
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
