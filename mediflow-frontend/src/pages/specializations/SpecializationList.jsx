import { useEffect, useState } from "react";

import {
  createSpecialization,
  getSpecializations,
} from "../../services/specializationService";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

function SpecializationList() {
  const [specializations, setSpecializations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    let cancelled = false;

    const loadSpecializations = async () => {
      try {
        const data = await getSpecializations();

        if (!cancelled) {
          setSpecializations(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Unable to load specializations.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSpecializations();

    return () => {
      cancelled = true;
    };
  }, []);

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
      const saved = await createSpecialization(formData);

      setSpecializations((current) => [...current, saved]);

      setFormData({
        name: "",
        description: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to create specialization.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Specializations"
        description="Manage medical specializations used by doctors."
      />

      <ErrorAlert message={error} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Add Specialization */}

        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Add Specialization
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700">Name</label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
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
              disabled={saving}
              className="
                w-full
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                font-semibold
                text-white
                hover:bg-blue-700
                disabled:opacity-50
              "
            >
              {saving ? "Saving..." : "Add Specialization"}
            </button>
          </form>
        </div>

        {/* List */}

        <div
          className="
            lg:col-span-2
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          {loading ? (
            <LoadingSpinner />
          ) : specializations.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No specializations created yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {specializations.map((specialization) => (
                <div key={specialization.specializationId} className="p-6">
                  <h3 className="font-semibold text-slate-900">
                    {specialization.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {specialization.description || "No description provided."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpecializationList;
