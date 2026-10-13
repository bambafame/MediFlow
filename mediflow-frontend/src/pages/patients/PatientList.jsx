import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { deletePatient, getPatients } from "../../services/patientService";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPatients = async () => {
      try {
        const data = await getPatients();

        if (!cancelled) {
          setPatients(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Unable to load patients.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPatients();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (patient) => {
    const confirmed = window.confirm(
      `Delete ${patient.firstName} ${patient.lastName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePatient(patient.id);

      setPatients((current) => current.filter((p) => p.id !== patient.id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete patient.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Patients"
        description="Manage registered MediFlow patients."
        action={
          <Link
            to="/patients/new"
            className="
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            + Add Patient
          </Link>
        }
      />

      <ErrorAlert message={error} />

      {loading ? (
        <LoadingSpinner />
      ) : patients.length === 0 ? (
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
            No patients found
          </h2>

          <p className="mt-2 text-slate-500">
            Register your first patient to get started.
          </p>

          <Link
            to="/patients/new"
            className="
              mt-5
              inline-block
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              text-white
            "
          >
            Add Patient
          </Link>
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
                    Patient
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-600">
                    Age
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
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {patient.firstName} {patient.lastName}
                      </div>

                      <div className="text-sm text-slate-500">
                        @{patient.username}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {patient.email}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {patient.phoneNumber || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {patient.age}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${
                            patient.enabled
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        {patient.enabled ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/patients/${patient.id}`}
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
                          to={`/patients/${patient.id}/edit`}
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

                        <button
                          onClick={() => handleDelete(patient)}
                          className="
                            rounded-md
                            bg-red-50
                            px-3
                            py-1.5
                            text-sm
                            text-red-700
                            hover:bg-red-100
                          "
                        >
                          Delete
                        </button>
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

export default PatientList;
