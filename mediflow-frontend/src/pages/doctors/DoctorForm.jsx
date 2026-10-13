import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  createDoctor,
  getDoctorById,
  updateDoctor,
} from "../../services/doctorService";

import { getSpecializations } from "../../services/specializationService";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

function DoctorForm() {
  const { id } = useParams();

  const navigate = useNavigate();

  const editing = Boolean(id);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [specializations, setSpecializations] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",

    email: "",
    phoneNumber: "",

    firstName: "",
    lastName: "",

    licenseNumber: "",
    bio: "",

    specializationId: "",
  });

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const specializationData = await getSpecializations();

        if (cancelled) {
          return;
        }

        setSpecializations(specializationData);

        if (editing) {
          const doctor = await getDoctorById(id);

          if (cancelled) {
            return;
          }

          setFormData({
            username: doctor.username || "",

            password: "",

            email: doctor.email || "",

            phoneNumber: doctor.phoneNumber || "",

            firstName: doctor.firstName || "",

            lastName: doctor.lastName || "",

            licenseNumber: doctor.licenseNumber || "",

            bio: doctor.bio || "",

            specializationId: doctor.specializationId?.toString() || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load doctor data.",
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

          licenseNumber: formData.licenseNumber,

          bio: formData.bio,

          specializationId: Number(formData.specializationId),
        };

        await updateDoctor(id, updatePayload);

        navigate(`/doctors/${id}`);
      } else {
        const createPayload = {
          ...formData,

          specializationId: Number(formData.specializationId),
        };

        await createDoctor(createPayload);

        navigate("/doctors");
      }
    } catch (err) {
      const response = err.response?.data;

      if (response?.details) {
        setError(Object.values(response.details).join(", "));
      } else {
        setError(response?.message || "Unable to save doctor.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const inputClass = `
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
  `;

  return (
    <div>
      <PageHeader
        title={editing ? "Edit Doctor" : "Register Doctor"}
        description={
          editing
            ? "Update doctor information."
            : "Create a new doctor account."
        }
      />

      <ErrorAlert message={error} />

      <form
        onSubmit={handleSubmit}
        className="
          max-w-4xl
          rounded-xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        {!editing && (
          <section className="mb-8">
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
                  className={inputClass}
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
                  className={inputClass}
                />
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Professional Information
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
                className={inputClass}
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
                className={inputClass}
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
                className={inputClass}
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
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                License Number
              </label>

              <input
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Specialization
              </label>

              <select
                name="specializationId"
                value={formData.specializationId}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select specialization</option>

                {specializations.map((specialization) => (
                  <option
                    key={specialization.specializationId}
                    value={specialization.specializationId}
                  >
                    {specialization.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Biography
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className={inputClass}
              />
            </div>
          </div>
        </section>

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
              disabled:opacity-50
            "
          >
            {saving
              ? "Saving..."
              : editing
                ? "Update Doctor"
                : "Register Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DoctorForm;
