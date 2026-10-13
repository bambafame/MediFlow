import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { getDoctorById } from "../../services/doctorService";

import { getDoctorAvailability } from "../../services/availabilityService";

import PageHeader from "../../components/PageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorAlert from "../../components/ErrorAlert";
import DetailItem from "../../components/DetailItem";

import AvailabilityList from "./AvailabilityList";
import AvailabilityForm from "./AvailabilityForm";

function DoctorDetails() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);

  const [availability, setAvailability] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [doctorData, availabilityData] = await Promise.all([
          getDoctorById(id),
          getDoctorAvailability(id),
        ]);

        if (!cancelled) {
          setDoctor(doctorData);

          setAvailability(availabilityData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Unable to load doctor.");
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
  }, [id]);

  const handleAvailabilityCreated = (slot) => {
    setAvailability((current) => [...current, slot]);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!doctor) {
    return <ErrorAlert message={error || "Doctor not found."} />;
  }

  return (
    <div>
      <PageHeader
        title={`Dr. ${doctor.firstName} ${doctor.lastName}`}
        description={doctor.specializationName || "Doctor"}
        action={
          <Link
            to={`/doctors/${id}/edit`}
            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              hover:bg-blue-700
            "
          >
            Edit Doctor
          </Link>
        }
      />

      <ErrorAlert message={error} />

      {/* Doctor details */}

      <section
        className="
          rounded-xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <div className="mb-8 flex items-center gap-5">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-blue-100
              text-xl
              font-bold
              text-blue-700
            "
          >
            {doctor.firstName?.[0]}
            {doctor.lastName?.[0]}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Dr. {doctor.firstName} {doctor.lastName}
            </h2>

            <p className="text-slate-500">@{doctor.username}</p>
          </div>
        </div>

        <dl className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <DetailItem label="Email" value={doctor.email} />

          <DetailItem label="Phone Number" value={doctor.phoneNumber} />

          <DetailItem label="License Number" value={doctor.licenseNumber} />

          <DetailItem
            label="Specialization"
            value={doctor.specializationName}
          />

          <DetailItem
            label="Status"
            value={doctor.enabled ? "Active" : "Inactive"}
          />
        </dl>

        {doctor.bio && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="text-sm font-medium text-slate-500">Biography</h3>

            <p className="mt-2 text-slate-700">{doctor.bio}</p>
          </div>
        )}
      </section>

      {/* Availability */}

      <section
        className="
          mt-8
          rounded-xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <h2 className="text-xl font-semibold text-slate-900">
          Doctor Availability
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure the days and times when this doctor accepts appointments.
        </p>

        <div className="mt-6">
          <AvailabilityForm
            doctorId={id}
            onCreated={handleAvailabilityCreated}
          />
        </div>

        <div className="mt-8">
          <AvailabilityList availability={availability} />
        </div>
      </section>

      <div className="mt-6">
        <Link
          to="/doctors"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Doctors
        </Link>
      </div>
    </div>
  );
}

export default DoctorDetails;
