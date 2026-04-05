const BASE = "/api";

export interface Appointment {
  id: string;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  notes: string | null;
  short_code: string;
  page_views: number;
  calendar_clicks_google: number;
  calendar_clicks_ics: number;
  created_at: string;
}

export interface CreateAppointment {
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  notes?: string;
}

function getPassword(): string {
  return sessionStorage.getItem("admin_password") || "";
}

export function setPassword(pw: string) {
  sessionStorage.setItem("admin_password", pw);
}

export function isLoggedIn(): boolean {
  return !!sessionStorage.getItem("admin_password");
}

export function logout() {
  sessionStorage.removeItem("admin_password");
}

function adminHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-admin-password": getPassword(),
  };
}

export async function login(password: string): Promise<boolean> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "x-admin-password": password },
  });
  if (res.ok) {
    setPassword(password);
    return true;
  }
  return false;
}

export async function createAppointment(data: CreateAppointment): Promise<Appointment> {
  const res = await fetch(`${BASE}/appointments`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(data),
  });
  if (res.status === 401) { logout(); window.location.reload(); }
  if (!res.ok) throw new Error("Failed to create appointment");
  return res.json();
}

export async function listAppointments(skip = 0, limit = 20): Promise<{ items: Appointment[]; total: number }> {
  const res = await fetch(`${BASE}/appointments?skip=${skip}&limit=${limit}`, {
    headers: { "x-admin-password": getPassword() },
  });
  if (res.status === 401) { logout(); window.location.reload(); }
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

export async function deleteAppointment(id: string): Promise<void> {
  const res = await fetch(`${BASE}/appointments/${id}`, {
    method: "DELETE",
    headers: { "x-admin-password": getPassword() },
  });
  if (res.status === 401) { logout(); window.location.reload(); }
  if (!res.ok) throw new Error("Failed to delete appointment");
}

// --- Doctors ---

export interface Doctor {
  id: string;
  name: string;
  created_at: string;
}

export async function listDoctors(): Promise<Doctor[]> {
  const res = await fetch(`${BASE}/doctors`, {
    headers: { "x-admin-password": getPassword() },
  });
  if (res.status === 401) { logout(); window.location.reload(); }
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

export async function createDoctor(name: string): Promise<Doctor> {
  const res = await fetch(`${BASE}/doctors`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({ name }),
  });
  if (res.status === 401) { logout(); window.location.reload(); }
  if (!res.ok) throw new Error("Failed to create doctor");
  return res.json();
}

export async function deleteDoctor(id: string): Promise<void> {
  const res = await fetch(`${BASE}/doctors/${id}`, {
    method: "DELETE",
    headers: { "x-admin-password": getPassword() },
  });
  if (res.status === 401) { logout(); window.location.reload(); }
  if (!res.ok) throw new Error("Failed to delete doctor");
}

// --- Public ---

export async function getPublicAppointment(shortCode: string): Promise<Appointment> {
  const res = await fetch(`${BASE}/r/${shortCode}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export async function trackView(shortCode: string): Promise<void> {
  await fetch(`${BASE}/r/${shortCode}/track`, { method: "POST" });
}

export async function trackGoogle(shortCode: string): Promise<void> {
  await fetch(`${BASE}/r/${shortCode}/track-google`, { method: "POST" });
}
