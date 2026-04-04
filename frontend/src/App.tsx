import { Routes, Route } from "react-router-dom";
import AdminForm from "./pages/AdminForm";
import AppointmentList from "./pages/AppointmentList";
import PatientPage from "./pages/PatientPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminForm />} />
      <Route path="/list" element={<AppointmentList />} />
      <Route path="/r/:shortCode" element={<PatientPage />} />
    </Routes>
  );
}
