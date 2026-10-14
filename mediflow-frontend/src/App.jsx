import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";

import PatientList from "./pages/patients/PatientList";
import PatientForm from "./pages/patients/PatientForm";
import PatientDetails from "./pages/patients/PatientDetails";

import DoctorList from "./pages/doctors/DoctorList";
import DoctorForm from "./pages/doctors/DoctorForm";
import DoctorDetails from "./pages/doctors/DoctorDetails";

import SpecializationList from "./pages/specializations/SpecializationList";

import AppointmentList from "./pages/appointments/AppointmentList";

import AppointmentForm from "./pages/appointments/AppointmentForm";

import AppointmentDetails from "./pages/appointments/AppointmentDetails";

import RescheduleAppointment from "./pages/appointments/RescheduleAppointment";

import ConsultationForm from "./pages/consultations/ConsultationForm";

import ConsultationDetails from "./pages/consultations/ConsultationDetails";

import PrescriptionForm from "./pages/prescriptions/PrescriptionForm";

import PrescriptionList from "./pages/prescriptions/PrescriptionList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Patients */}

          <Route path="/patients" element={<PatientList />} />

          <Route path="/patients/new" element={<PatientForm />} />

          <Route path="/patients/:id" element={<PatientDetails />} />

          <Route path="/patients/:id/edit" element={<PatientForm />} />

          {/* Doctors */}

          <Route path="/doctors" element={<DoctorList />} />

          <Route path="/doctors/new" element={<DoctorForm />} />

          <Route path="/doctors/:id" element={<DoctorDetails />} />

          <Route path="/doctors/:id/edit" element={<DoctorForm />} />

          {/* Specializations */}

          <Route path="/specializations" element={<SpecializationList />} />

          {/* Appointments */}

          <Route path="/appointments" element={<AppointmentList />} />

          <Route path="/appointments/new" element={<AppointmentForm />} />

          <Route path="/appointments" element={<AppointmentList />} />

          <Route path="/appointments/new" element={<AppointmentForm />} />

          <Route path="/appointments/:id" element={<AppointmentDetails />} />

          <Route
            path="/appointments/:id/reschedule"
            element={<RescheduleAppointment />}
          />
        </Route>

        <Route
          path="/appointments/:appointmentId/consultation/new"
          element={<ConsultationForm />}
        />

        <Route
          path="/appointments/:appointmentId/consultation"
          element={<ConsultationDetails />}
        />

        <Route
          path="/appointments/:appointmentId/consultation/prescriptions/new"
          element={<PrescriptionForm />}
        />

        <Route
          path="/patients/:patientId/prescriptions"
          element={<PrescriptionList />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
