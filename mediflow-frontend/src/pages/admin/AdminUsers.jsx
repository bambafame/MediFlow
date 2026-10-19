import { useEffect, useState } from "react";

import {
  getUsers,
  createReceptionist,
  updateUserEnabled,
} from "../../services/adminUserService";

import { useAuth } from "../../context/useAuth";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
  });

  const [saving, setSaving] = useState(false);

  const { auth } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        const data = await getUsers();

        if (!cancelled) {
          setUsers(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError("Failed to load users.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshUsers = async () => {
    try {
      const data = await getUsers();

      setUsers(data);
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to refresh users.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await createReceptionist(formData);

      setFormData({
        username: "",
        password: "",
        email: "",
        phoneNumber: "",
      });

      setShowForm(false);

      await refreshUsers();
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to create receptionist.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (user) => {
    try {
      setError("");

      await updateUserEnabled(user.userId, !user.enabled);

      await refreshUsers();
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Failed to update user.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage system users and receptionist accounts."
      />

      {error && <ErrorAlert message={error} />}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
            hover:bg-blue-700
          "
        >
          {showForm ? "Cancel" : "+ Add Receptionist"}
        </button>
      </div>

      {showForm && (
        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <h2
            className="
              mb-4
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Create Receptionist
          </h2>

          <form
            onSubmit={handleSubmit}
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >
            <div>
              <label
                className="
                  mb-1
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-1
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-1
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-1
                  block
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                Phone Number
              </label>

              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  px-3
                  py-2
                "
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="
                  rounded-lg
                  bg-green-600
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  hover:bg-green-700
                  disabled:opacity-50
                "
              >
                {saving ? "Creating..." : "Create Receptionist"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          shadow-sm
        "
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Username
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Email
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Phone
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Role
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Status
                </th>

                <th
                  className="
                    px-6
                    py-3
                    text-right
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody
              className="
                divide-y
                divide-gray-200
              "
            >
              {users.map((user) => {
                const isCurrentUser = auth?.userId === user.userId;

                return (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td
                      className="
                      px-6
                      py-4
                      text-sm
                      font-medium
                      text-gray-900
                    "
                    >
                      {user.username}
                    </td>

                    <td
                      className="
                      px-6
                      py-4
                      text-sm
                      text-gray-600
                    "
                    >
                      {user.email}
                    </td>

                    <td
                      className="
                      px-6
                      py-4
                      text-sm
                      text-gray-600
                    "
                    >
                      {user.phoneNumber || "—"}
                    </td>

                    <td
                      className="
                      px-6
                      py-4
                      text-sm
                      text-gray-600
                    "
                    >
                      {user.role}
                    </td>

                    <td
                      className="
                      px-6
                      py-4
                      text-sm
                    "
                    >
                      <span
                        className={
                          user.enabled
                            ? `
                            rounded-full
                            bg-green-100
                            px-2
                            py-1
                            text-xs
                            font-medium
                            text-green-700
                          `
                            : `
                            rounded-full
                            bg-red-100
                            px-2
                            py-1
                            text-xs
                            font-medium
                            text-red-700
                          `
                        }
                      >
                        {user.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>

                    <td
                      className="
                      px-6
                      py-4
                      text-right
                    "
                    >
                      {isCurrentUser && (
                        <span className="mr-2 text-xs text-gray-500">You</span>
                      )}

                      <button
                        type="button"
                        disabled={isCurrentUser && user.enabled}
                        onClick={() => handleToggleEnabled(user)}
                        className="
                        rounded-lg
                        border
                        border-gray-300
                        px-3
                        py-1.5
                        text-sm
                        font-medium
                        text-gray-700
                        hover:bg-gray-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                      >
                        {user.enabled ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div
            className="
              p-8
              text-center
              text-sm
              text-gray-500
            "
          >
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
