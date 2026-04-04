import { useState } from "react";
import { login } from "../api";

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 2C12.5 2 10 3.5 8.5 5.5C7 7.5 6.5 10 7 13C7.5 16 8 18 8.5 20C9 22 9.5 24 10.5 26C11.5 28 12.5 29 13.5 29C14.5 29 15 28 15.5 26C16 24 16 22 16 22C16 22 16 24 16.5 26C17 28 17.5 29 18.5 29C19.5 29 20.5 28 21.5 26C22.5 24 23 22 23.5 20C24 18 24.5 16 25 13C25.5 10 25 7.5 23.5 5.5C22 3.5 19.5 2 16 2Z" />
    </svg>
  );
}

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    try {
      const ok = await login(password);
      if (ok) {
        onLogin();
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-[0_2px_24px_-4px_rgba(13,91,154,0.10)] border border-clinic-100/60 p-8 max-w-xs w-full animate-fade-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-clinic-800 rounded-xl mb-4">
            <ToothIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">Мой стоматолог</h1>
          <p className="text-[0.78rem] text-gray-400 mt-0.5">Панель администратора</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className={`w-full border rounded-lg px-3.5 py-2.5 text-[0.9rem] outline-none transition-all placeholder:text-gray-300 ${
                error
                  ? "border-red-300 focus:ring-2 focus:ring-red-100"
                  : "border-gray-200 focus:ring-2 focus:ring-clinic-200 focus:border-clinic-400"
              }`}
              placeholder="Пароль"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-[0.78rem] mt-1.5">Неверный пароль</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-clinic-800 text-white py-3 rounded-lg font-semibold hover:bg-clinic-900 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Вход...
              </span>
            ) : (
              "Войти"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
