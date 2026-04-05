import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDoctors, createDoctor, deleteDoctor, type Doctor } from "../api";

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 2C12.5 2 10 3.5 8.5 5.5C7 7.5 6.5 10 7 13C7.5 16 8 18 8.5 20C9 22 9.5 24 10.5 26C11.5 28 12.5 29 13.5 29C14.5 29 15 28 15.5 26C16 24 16 22 16 22C16 22 16 24 16.5 26C17 28 17.5 29 18.5 29C19.5 29 20.5 28 21.5 26C22.5 24 23 22 23.5 20C24 18 24.5 16 25 13C25.5 10 25 7.5 23.5 5.5C22 3.5 19.5 2 16 2Z" />
    </svg>
  );
}

export default function SettingsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listDoctors().then(setDoctors);
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const doc = await createDoctor(newName.trim());
      setDoctors((prev) => [...prev, doc].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoctor(id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-warm-50 p-4 pb-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-9 h-9 bg-clinic-800 rounded-lg flex items-center justify-center hover:bg-clinic-900 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Настройки</h1>
              <p className="text-[0.7rem] text-gray-400">Мой стоматолог</p>
            </div>
          </div>
        </div>

        {/* Doctors section */}
        <div className="bg-white rounded-2xl shadow-[0_2px_24px_-4px_rgba(13,91,154,0.10)] border border-clinic-100/60 p-6 animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <ToothIcon className="w-4 h-4 text-clinic-600" />
            <h2 className="text-[0.95rem] font-bold text-gray-800">Врачи</h2>
          </div>

          {/* Add doctor form */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2.5 text-[0.9rem] focus:ring-2 focus:ring-clinic-200 focus:border-clinic-400 outline-none transition-all placeholder:text-gray-300"
              placeholder="ФИО врача"
            />
            <button
              onClick={handleAdd}
              disabled={loading || !newName.trim()}
              className="px-4 bg-clinic-800 text-white rounded-lg font-semibold hover:bg-clinic-900 active:scale-[0.97] transition-all cursor-pointer text-[0.82rem] disabled:opacity-50"
            >
              Добавить
            </button>
          </div>

          {/* Doctor list */}
          {doctors.length === 0 ? (
            <p className="text-[0.82rem] text-gray-300 text-center py-4">
              Добавьте врачей, чтобы они появились в форме напоминаний
            </p>
          ) : (
            <div className="space-y-1.5">
              {doctors.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between px-3.5 py-3 bg-gray-50 rounded-lg border border-gray-100 group"
                >
                  <span className="text-[0.9rem] font-medium text-gray-700">{d.name}</span>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="p-1 text-gray-300 hover:text-red-500 rounded transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Удалить"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
