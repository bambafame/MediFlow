import { useState } from "react";

import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";

import ErrorAlert from "../../components/ErrorAlert";

function Login() {
  const { login, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * Already logged in:
   * do not show login again.
   */
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(username, password);

      /*
       * If user originally tried to open
       * a protected page, return there.
       *
       * Otherwise Dashboard.
       */
      const destination = location.state?.from?.pathname || "/";

      navigate(destination, {
        replace: true,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError(err.response?.data?.message || "Unable to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-100
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-lg
        "
      >
        <div className="text-center">
          <h1
            className="
              text-3xl
              font-bold
              text-blue-700
            "
          >
            MediFlow
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Clinic Management System
          </p>
        </div>

        <div className="mt-8">
          <h2
            className="
              text-xl
              font-semibold
              text-slate-900
            "
          >
            Sign in
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Enter your MediFlow account credentials.
          </p>
        </div>

        <div className="mt-6">
          <ErrorAlert message={error} />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              autoComplete="username"
              className="
                mt-2
                w-full
                rounded-lg
                border
                border-slate-300
                px-4
                py-2.5
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="
                text-sm
                font-medium
                text-slate-700
              "
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="
                mt-2
                w-full
                rounded-lg
                border
                border-slate-300
                px-4
                py-2.5
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              font-semibold
              text-white
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
