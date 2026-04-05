import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { isLoggedIn } from "./api";
import LoginPage from "./pages/LoginPage";
import AdminForm from "./pages/AdminForm";
import AppointmentList from "./pages/AppointmentList";
import SettingsPage from "./pages/SettingsPage";
import PatientPage from "./pages/PatientPage";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(isLoggedIn());

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminGuard><AdminForm /></AdminGuard>} />
      <Route path="/list" element={<AdminGuard><AppointmentList /></AdminGuard>} />
      <Route path="/settings" element={<AdminGuard><SettingsPage /></AdminGuard>} />
      <Route path="/r/:shortCode" element={<PatientPage />} />
    </Routes>
  );
}
