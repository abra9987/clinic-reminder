import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicAppointment, trackView, trackGoogle, type Appointment } from "../api";

const WEEKDAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];

function formatDate(d: string) {
  const date = new Date(d + "T00:00:00");
  const day = date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const weekday = WEEKDAYS[date.getDay()];
  return `${day}, ${weekday}`;
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

function buildGoogleUrl(appt: Appointment) {
  const dateStr = appt.appointment_date.replace(/-/g, "");
  const [h, m] = appt.appointment_time.split(":");
  const startMin = parseInt(h) * 60 + parseInt(m);
  const endMin = startMin + appt.duration_minutes;
  const endH = String(Math.floor(endMin / 60)).padStart(2, "0");
  const endM = String(endMin % 60).padStart(2, "0");
  const start = `${dateStr}T${h}${m}00`;
  const end = `${dateStr}T${endH}${endM}00`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Стоматолог — Др. ${appt.doctor_name}`,
    dates: `${start}/${end}`,
    ctz: "Asia/Yekaterinburg",
    location: "г. Уфа, ул. Достоевского, 73",
    details: appt.notes ? `Примечание: ${appt.notes}\nТел: +7 917 422 33 84` : "Тел: +7 917 422 33 84",
  });
  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`;
}

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 2C12.5 2 10 3.5 8.5 5.5C7 7.5 6.5 10 7 13C7.5 16 8 18 8.5 20C9 22 9.5 24 10.5 26C11.5 28 12.5 29 13.5 29C14.5 29 15 28 15.5 26C16 24 16 22 16 22C16 22 16 24 16.5 26C17 28 17.5 29 18.5 29C19.5 29 20.5 28 21.5 26C22.5 24 23 22 23.5 20C24 18 24.5 16 25 13C25.5 10 25 7.5 23.5 5.5C22 3.5 19.5 2 16 2Z" />
    </svg>
  );
}

export default function PatientPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [appt, setAppt] = useState<Appointment | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shortCode) return;
    getPublicAppointment(shortCode)
      .then(setAppt)
      .catch(() => setError(true));
    trackView(shortCode);
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
        <div className="text-center animate-fade-up">
          <ToothIcon className="w-12 h-12 text-clinic-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Напоминание не найдено</p>
          <p className="text-gray-400 text-sm mt-1">Возможно, ссылка устарела</p>
        </div>
      </div>
    );
  }

  if (!appt) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-clinic-200 border-t-clinic-600 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  const handleGoogle = () => {
    if (shortCode) trackGoogle(shortCode);
    window.open(buildGoogleUrl(appt), "_blank");
  };

  const icsUrl = `/api/r/${shortCode}/ics`;

  return (
    <div className="min-h-screen bg-warm-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grain" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-clinic-100/60 to-transparent rounded-full blur-3xl -mt-80" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-5 py-10">
        <div className="max-w-[380px] w-full">

          {/* Clinic header */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="inline-flex items-center justify-center w-[52px] h-[52px] bg-clinic-800 rounded-xl mb-4 shadow-lg shadow-clinic-800/20">
              <ToothIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-[1.15rem] font-bold text-clinic-900 tracking-tight">Мой стоматолог</h1>
            <p className="text-[0.8rem] text-gray-400 mt-0.5 tracking-wide uppercase">Напоминание о визите</p>
          </div>

          {/* Main card */}
          <div
            className="bg-white rounded-2xl shadow-[0_2px_24px_-4px_rgba(13,91,154,0.10)] border border-clinic-100/60 overflow-hidden animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            {/* Header strip */}
            <div className="bg-gradient-to-r from-clinic-800 to-clinic-700 px-6 py-4">
              <p className="text-clinic-200 text-[0.7rem] uppercase tracking-widest mb-0.5">Ваш визит</p>
              <p className="text-white text-lg font-semibold tracking-tight">Др. {appt.doctor_name}</p>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Duration */}
              <div>
                <p className="text-[0.7rem] text-gray-400 uppercase tracking-wider mb-1">Длительность</p>
                <p className="font-medium text-gray-800 text-[0.95rem]">{appt.duration_minutes} мин</p>
              </div>

              {/* Date/Time — hero block */}
              <div className="bg-clinic-50 border border-clinic-100 rounded-xl p-4 flex items-center gap-4">
                <div className="shrink-0 w-[52px] h-[52px] bg-clinic-800 rounded-lg flex flex-col items-center justify-center text-white shadow-sm">
                  <span className="text-[0.6rem] uppercase leading-none font-medium tracking-wide">
                    {new Date(appt.appointment_date + "T00:00:00").toLocaleDateString("ru-RU", { month: "short" })}
                  </span>
                  <span className="text-xl font-bold leading-none mt-0.5">
                    {new Date(appt.appointment_date + "T00:00:00").getDate()}
                  </span>
                </div>
                <div>
                  <p className="text-clinic-900 font-bold text-xl tracking-tight">{formatTime(appt.appointment_time)}</p>
                  <p className="text-clinic-700 text-[0.82rem]">{formatDate(appt.appointment_date)}</p>
                </div>
              </div>

              {/* Notes */}
              {appt.notes && (
                <div className="flex gap-2.5 items-start bg-cream-100 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <p className="text-gray-700 text-[0.85rem] leading-snug">{appt.notes}</p>
                </div>
              )}

              {/* Reminder notice */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <svg className="w-3.5 h-3.5 text-clinic-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <p className="text-[0.75rem] text-gray-400">Напомним за 24 часа и за 2 часа</p>
              </div>
            </div>
          </div>

          {/* Calendar buttons */}
          <div
            className="mt-5 space-y-3 animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            <button
              onClick={() => { window.location.href = icsUrl; }}
              className="group w-full flex items-center justify-center gap-2.5 bg-clinic-800 text-white py-4 rounded-xl font-semibold text-[0.95rem] hover:bg-clinic-900 active:scale-[0.98] transition-all shadow-lg shadow-clinic-800/20 cursor-pointer"
            >
              <svg className="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              Добавить в календарь
            </button>

            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-200 text-gray-600 py-3.5 rounded-xl font-medium text-[0.9rem] hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
              </svg>
              Google Calendar
            </button>
          </div>

          {/* Footer */}
          <div
            className="mt-8 text-center animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            <a href="tel:+79174223384" className="inline-flex items-center gap-1.5 text-clinic-700 text-[0.82rem] font-medium hover:text-clinic-900 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              +7 917 422 33 84
            </a>
            <p className="text-gray-400 text-[0.75rem] mt-1">г. Уфа, ул. Достоевского, 73</p>
          </div>
        </div>
      </div>
    </div>
  );
}
