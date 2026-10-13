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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
