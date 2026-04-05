import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAppointments, deleteAppointment, isSuperAdmin, type Appointment } from "../api";

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 2C12.5 2 10 3.5 8.5 5.5C7 7.5 6.5 10 7 13C7.5 16 8 18 8.5 20C9 22 9.5 24 10.5 26C11.5 28 12.5 29 13.5 29C14.5 29 15 28 15.5 26C16 24 16 22 16 22C16 22 16 24 16.5 26C17 28 17.5 29 18.5 29C19.5 29 20.5 28 21.5 26C22.5 24 23 22 23.5 20C24 18 24.5 16 25 13C25.5 10 25 7.5 23.5 5.5C22 3.5 19.5 2 16 2Z" />
    </svg>
  );
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 20;

  const load = async () => {
    const data = await listAppointments(page * limit, limit);
    setAppointments(data.items);
    setTotal(data.total);
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleDelete = async (id: string) => {
    await deleteAppointment(id);
    load();
  };

  const formatTime = (t: string) => t.slice(0, 5);

  return (
    <div className="min-h-screen bg-warm-50 p-4 pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-9 h-9 bg-clinic-800 rounded-lg flex items-center justify-center hover:bg-clinic-900 transition-colors"
              title="Назад"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                Напоминания
                <span className="text-gray-300 font-normal ml-1.5 text-base">{total}</span>
              </h1>
              <p className="text-[0.7rem] text-gray-400">Мой стоматолог</p>
            </div>
          </div>
          <Link
            to="/"
            className="bg-clinic-800 text-white px-4 py-2 rounded-lg text-[0.82rem] font-semibold hover:bg-clinic-900 active:scale-[0.97] transition-all flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Новое
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-16 animate-fade-up">
            <ToothIcon className="w-10 h-10 text-clinic-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Нет напоминаний</p>
            <p className="text-gray-300 text-sm mt-1">Создайте первое напоминание</p>
          </div>
        ) : (
          <div className="space-y-2.5 animate-fade-up">
            {appointments.map((a, i) => (
              <div
                key={a.id}
                className="bg-white rounded-xl p-4 shadow-[0_1px_8px_-2px_rgba(13,91,154,0.08)] border border-clinic-50 flex items-center justify-between hover:border-clinic-200 transition-colors"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="min-w-0 flex items-center gap-3.5">
                  {/* Date badge */}
                  <div className="shrink-0 w-11 h-11 bg-clinic-50 border border-clinic-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-[0.55rem] text-clinic-500 uppercase font-medium leading-none">
                      {new Date(a.appointment_date + "T00:00:00").toLocaleDateString("ru-RU", { month: "short" })}
                    </span>
                    <span className="text-sm font-bold text-clinic-800 leading-none mt-0.5">
                      {new Date(a.appointment_date + "T00:00:00").getDate()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 text-[0.9rem] truncate">{a.patient_name}</div>
                    <div className="text-[0.78rem] text-gray-400 mt-0.5">
                      Др. {a.doctor_name} &middot; {formatTime(a.appointment_time)}
                    </div>
                    <div className="flex items-center gap-2.5 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[0.68rem] text-gray-300">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        {a.page_views}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[0.68rem] text-gray-300">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {a.calendar_clicks_google + a.calendar_clicks_ics}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-3 shrink-0">
                  <a
                    href={`/r/${a.short_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-clinic-500 hover:text-clinic-800 hover:bg-clinic-50 rounded-lg transition-all"
                    title="Открыть"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                  {isSuperAdmin() && <button
                    onClick={() => handleDelete(a.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    title="Удалить"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {total > limit && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="px-3 py-2 text-[0.82rem] text-gray-400 tabular-nums">
              {page + 1} / {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * limit >= total}
              className="px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
