import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";

import PatientList from "./pages/patients/PatientList";
import PatientForm from "./pages/patients/PatientForm";
import PatientDetails from "./pages/patients/PatientDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/patients" element={<PatientList />} />

          <Route path="/patients/new" element={<PatientForm />} />

          <Route path="/patients/:id" element={<PatientDetails />} />

          <Route path="/patients/:id/edit" element={<PatientForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
