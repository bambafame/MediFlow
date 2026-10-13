import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  getDoctors,
  searchDoctorsBySpecialization,
} from "../../services/doctorService";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDoctors = async () => {
      try {
        const data = await getDoctors();

        if (!cancelled) {
          setDoctors(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Unable to load doctors.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDoctors();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    setError("");

    try {
      if (!search.trim()) {
        const data = await getDoctors();

        setDoctors(data);

        return;
      }

      const data = await searchDoctorsBySpecialization(search.trim());

      setDoctors(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to search doctors.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Doctors"
        description="Manage doctors, specializations, and schedules."
        action={
          <Link
            to="/doctors/new"
            className="
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              hover:bg-blue-700
            "
          >
            + Add Doctor
          </Link>
        }
      />

      <ErrorAlert message={error} />

      <form
        onSubmit={handleSearch}
        className="
          mb-6
          flex
          max-w-xl
          gap-3
        "
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by specialization..."
          className="
            flex-1
            rounded-lg
            border
            border-slate-300
            px-4
            py-2.5
            outline-none
            focus:border-blue-500
          "
        />

        <button
          type="submit"
          className="
            rounded-lg
            bg-slate-900
            px-5
            py-2.5
            text-white
            hover:bg-slate-800
          "
        >
          Search
        </button>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : doctors.length === 0 ? (
        <div
          className="
            rounded-xl
            border
            border-dashed
            border-slate-300
            bg-white
            p-12
            text-center
          "
        >
          <h2 className="text-lg font-semibold text-slate-800">
            No doctors found
          </h2>

          <p className="mt-2 text-slate-500">
            Add a doctor or change the search criteria.
          </p>
        </div>
      ) : (
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Doctor
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Specialization
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    License
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </div>

                      <div className="text-sm text-slate-500">
                        @{doctor.username}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {doctor.specializationName || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {doctor.licenseNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {doctor.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={
                          doctor.enabled
                            ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                            : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500"
                        }
                      >
                        {doctor.enabled ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/doctors/${doctor.id}`}
                          className="
                            rounded-md
                            border
                            border-slate-300
                            px-3
                            py-1.5
                            text-sm
                            text-slate-700
                            hover:bg-slate-100
                          "
                        >
                          View
                        </Link>

                        <Link
                          to={`/doctors/${doctor.id}/edit`}
                          className="
                            rounded-md
                            bg-blue-50
                            px-3
                            py-1.5
                            text-sm
                            text-blue-700
                            hover:bg-blue-100
                          "
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorList;
