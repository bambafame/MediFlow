import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";

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

import RoleRoute from "./components/RoleRoute";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route path="/login" element={<Login />} />

        {/* Protected application */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />

          {/* Patients */}

          <Route path="/patients" element={<PatientList />} />

          <Route path="/patients/new" element={<PatientForm />} />

          <Route path="/patients/:id" element={<PatientDetails />} />

          <Route path="/patients/:id/edit" element={<PatientForm />} />

          {/* Doctors */}

          <Route path="/doctors" element={<DoctorList />} />

          <Route
            path="/doctors/new"
            element={
              <RoleRoute allowedRoles={["ADMIN", "RECEPTIONIST"]}>
                <DoctorForm />
              </RoleRoute>
            }
          />

          <Route path="/doctors/:id" element={<DoctorDetails />} />

          <Route path="/doctors/:id/edit" element={<DoctorForm />} />

          {/* Specializations */}

          <Route
            path="/specializations"
            element={
              <RoleRoute allowedRoles={["ADMIN", "RECEPTIONIST"]}>
                <SpecializationList />
              </RoleRoute>
            }
          />

          {/* Appointments */}

          <Route path="/appointments" element={<AppointmentList />} />

          <Route
            path="/appointments/new"
            element={
              <RoleRoute allowedRoles={["ADMIN", "RECEPTIONIST", "PATIENT"]}>
                <AppointmentForm />
              </RoleRoute>
            }
          />

          <Route path="/appointments/:id" element={<AppointmentDetails />} />

          <Route
            path="/appointments/:id/reschedule"
            element={
              <RoleRoute allowedRoles={["ADMIN", "RECEPTIONIST", "PATIENT"]}>
                <RescheduleAppointment />
              </RoleRoute>
            }
          />

          {/* Consultations */}

          <Route
            path="/appointments/:appointmentId/consultation/new"
            element={
              <RoleRoute allowedRoles={["ADMIN", "DOCTOR"]}>
                <ConsultationForm />
              </RoleRoute>
            }
          />

          <Route
            path="/appointments/:appointmentId/consultation"
            element={
              <RoleRoute allowedRoles={["ADMIN", "DOCTOR", "PATIENT"]}>
                <ConsultationDetails />
              </RoleRoute>
            }
          />

          {/* Prescriptions */}

          <Route
            path="/appointments/:appointmentId/consultation/prescriptions/new"
            element={
              <RoleRoute allowedRoles={["ADMIN", "DOCTOR"]}>
                <PrescriptionForm />
              </RoleRoute>
            }
          />

          <Route
            path="/patients/:patientId/prescriptions"
            element={
              <RoleRoute allowedRoles={["ADMIN", "DOCTOR", "PATIENT"]}>
                <PrescriptionList />
              </RoleRoute>
            }
          />
        </Route>

        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminUsers />
            </RoleRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
