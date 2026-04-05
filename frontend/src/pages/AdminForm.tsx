import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createAppointment, listDoctors, type Appointment, type Doctor } from "../api";
import { Link } from "react-router-dom";

const DURATIONS = [
  { label: "30 мин", value: 30 },
  { label: "1 час", value: 60 },
  { label: "1.5 ч", value: 90 },
  { label: "2 часа", value: 120 },
];

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 2C12.5 2 10 3.5 8.5 5.5C7 7.5 6.5 10 7 13C7.5 16 8 18 8.5 20C9 22 9.5 24 10.5 26C11.5 28 12.5 29 13.5 29C14.5 29 15 28 15.5 26C16 24 16 22 16 22C16 22 16 24 16.5 26C17 28 17.5 29 18.5 29C19.5 29 20.5 28 21.5 26C22.5 24 23 22 23.5 20C24 18 24.5 16 25 13C25.5 10 25 7.5 23.5 5.5C22 3.5 19.5 2 16 2Z" />
    </svg>
  );
}

export default function AdminForm() {
  const [form, setForm] = useState({
    patient_name: "",
    doctor_name: "",
    appointment_date: "",
    appointment_time: "",
    duration_minutes: 60,
    notes: "",
  });
  const [result, setResult] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    listDoctors().then(setDoctors);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        notes: form.notes || undefined,
      };
      const appt = await createAppointment(data);
      setResult(appt);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setForm({
      patient_name: "",
      doctor_name: form.doctor_name,
      appointment_date: "",
      appointment_time: "",
      duration_minutes: 60,
      notes: "",
    });
  };

  const patientUrl = result ? `${window.location.origin}/r/${result.short_code}` : "";

  if (result) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-[0_2px_24px_-4px_rgba(13,91,154,0.10)] border border-clinic-100/60 p-8 max-w-md w-full text-center animate-scale-in">
          <div className="inline-flex items-center justify-center w-11 h-11 bg-green-50 rounded-full mb-4">
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Напоминание создано</h2>
          <p className="text-gray-400 text-sm mb-6">
            {result.patient_name} &mdash; {new Date(result.appointment_date + "T00:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
          </p>

          <div className="bg-white p-5 rounded-xl inline-block mb-4 border-2 border-dashed border-clinic-200">
            <QRCodeSVG
              value={patientUrl}
              size={260}
              level="M"
              bgColor="transparent"
              fgColor="#0a4170"
            />
          </div>

          <p className="text-[0.7rem] text-gray-400 uppercase tracking-wider mb-1.5">Ссылка для пациента</p>
          <a
            href={patientUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-clinic-700 text-sm font-medium break-all hover:text-clinic-900 transition-colors"
          >
            {patientUrl}
          </a>

          <button
            onClick={reset}
            className="mt-6 w-full bg-clinic-800 text-white py-3 rounded-lg font-semibold hover:bg-clinic-900 active:scale-[0.98] transition-all cursor-pointer"
          >
            Новое напоминание
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-[0_2px_24px_-4px_rgba(13,91,154,0.10)] border border-clinic-100/60 p-7 max-w-md w-full animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-clinic-800 rounded-lg flex items-center justify-center">
              <ToothIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Новое напоминание</h1>
              <p className="text-[0.7rem] text-gray-400">Мой стоматолог</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/settings"
              className="text-gray-300 hover:text-clinic-700 transition-colors"
              title="Настройки"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </Link>
            <Link
              to="/list"
              className="text-[0.8rem] text-clinic-700 hover:text-clinic-900 font-medium transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Список
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[0.78rem] font-medium text-gray-600 mb-1.5">Пациент</label>
            <input
              type="text"
              required
              value={form.patient_name}
              onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[0.9rem] focus:ring-2 focus:ring-clinic-200 focus:border-clinic-400 outline-none transition-all placeholder:text-gray-300"
              placeholder="Иванов Иван"
            />
          </div>

          {/* Doctor select */}
          <div>
            <label className="block text-[0.78rem] font-medium text-gray-600 mb-1.5">Врач</label>
            {doctors.length > 0 ? (
              <div className="grid grid-cols-2 gap-1.5">
                {doctors.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setForm({ ...form, doctor_name: d.name })}
                    className={`px-3 py-2.5 rounded-lg text-[0.85rem] font-medium transition-all cursor-pointer text-left truncate ${
                      form.doctor_name === d.name
                        ? "bg-clinic-800 text-white shadow-sm"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            ) : (
              <Link
                to="/settings"
                className="block text-center py-3 border border-dashed border-clinic-200 rounded-lg text-[0.82rem] text-clinic-600 hover:bg-clinic-50 transition-colors"
              >
                Добавьте врачей в настройках
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[0.78rem] font-medium text-gray-600 mb-1.5">Дата</label>
              <input
                type="date"
                required
                value={form.appointment_date}
                onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[0.9rem] focus:ring-2 focus:ring-clinic-200 focus:border-clinic-400 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[0.78rem] font-medium text-gray-600 mb-1.5">Время</label>
              <input
                type="time"
                required
                value={form.appointment_time}
                onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[0.9rem] focus:ring-2 focus:ring-clinic-200 focus:border-clinic-400 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.78rem] font-medium text-gray-600 mb-1.5">Длительность</label>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setForm({ ...form, duration_minutes: d.value })}
                  className={`py-2.5 rounded-lg text-[0.82rem] font-medium transition-all cursor-pointer ${
                    form.duration_minutes === d.value
                      ? "bg-clinic-800 text-white shadow-sm"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[0.78rem] font-medium text-gray-600 mb-1.5">
              Примечание <span className="text-gray-300 font-normal">(опционально)</span>
            </label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[0.9rem] focus:ring-2 focus:ring-clinic-200 focus:border-clinic-400 outline-none transition-all placeholder:text-gray-300"
              placeholder="Взять снимки"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !form.doctor_name}
            className="w-full bg-clinic-800 text-white py-3 rounded-lg font-semibold hover:bg-clinic-900 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Создаю...
              </span>
            ) : (
              "Создать напоминание"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
