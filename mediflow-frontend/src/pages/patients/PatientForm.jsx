import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  createPatient,
  getPatientById,
  updatePatient,
} from "../../services/patientService";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

function PatientForm() {
  const { id } = useParams();

  const navigate = useNavigate();

  const editing = Boolean(id);

  const [loading, setLoading] = useState(editing);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",

    firstName: "",
    lastName: "",

    email: "",
    phoneNumber: "",

    dateOfBirth: "",
    mailingAddress: "",
  });

  useEffect(() => {
    if (!editing) {
      return;
    }

    const loadPatient = async () => {
      try {
        const patient = await getPatientById(id);

        setFormData({
          username: patient.username || "",

          password: "",

          firstName: patient.firstName || "",

          lastName: patient.lastName || "",

          email: patient.email || "",

          phoneNumber: patient.phoneNumber || "",

          dateOfBirth: patient.dateOfBirth || "",

          mailingAddress: patient.mailingAddress || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load patient.");
      } finally {
        setLoading(false);
      }
    };

    loadPatient();
  }, [editing, id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (editing) {
        const updatePayload = {
          firstName: formData.firstName,

          lastName: formData.lastName,

          email: formData.email,

          phoneNumber: formData.phoneNumber,

          dateOfBirth: formData.dateOfBirth,

          mailingAddress: formData.mailingAddress,
        };

        await updatePatient(id, updatePayload);

        navigate(`/patients/${id}`);
      } else {
        await createPatient(formData);

        navigate("/patients");
      }
    } catch (err) {
      const response = err.response?.data;

      if (response?.details) {
        const messages = Object.values(response.details).join(", ");

        setError(messages);
      } else {
        setError(response?.message || "Unable to save patient.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const inputStyle = `
    mt-2
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-4
    py-2.5
    text-slate-900
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
  `;

  return (
    <div>
      <PageHeader
        title={editing ? "Edit Patient" : "Register Patient"}
        description={
          editing
            ? "Update patient information."
            : "Create a new patient account."
        }
      />

      <ErrorAlert message={error} />

      <form
        onSubmit={handleSubmit}
        className="
          max-w-3xl
          rounded-xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        {!editing && (
          <div className="mb-8">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Account Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Username
                </label>

                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                />
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Personal Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                First Name
              </label>

              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Last Name
              </label>

              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Phone Number
              </label>

              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Date of Birth
              </label>

              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Mailing Address
              </label>

              <textarea
                name="mailingAddress"
                value={formData.mailingAddress}
                onChange={handleChange}
                rows="3"
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        <div
          className="
            mt-8
            flex
            justify-end
            gap-3
            border-t
            border-slate-200
            pt-6
          "
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              rounded-lg
              border
              border-slate-300
              px-5
              py-2.5
              font-medium
              text-slate-700
              hover:bg-slate-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              font-semibold
              text-white
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving
              ? "Saving..."
              : editing
                ? "Update Patient"
                : "Register Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientForm;
