"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Переключатель между входом и регистрацией
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Простая валидация
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    // Здесь можно добавить запрос к API для входа или регистрации
    // В этом примере просто сохраняем статус аутентификации в localStorage
    if (isLogin) {
      // Логика входа
      // Например, проверка email и password
      if (email === "user@example.com" && password === "password") {
        localStorage.setItem("isAuthenticated", "true");
        router.push("/"); // Перенаправляем на главную страницу
      } else {
        setError("Неверный email или пароль.");
      }
    } else {
      // Логика регистрации
      // Например, сохранение нового пользователя
      localStorage.setItem("isAuthenticated", "true");
      router.push("/"); // Перенаправляем на главную страницу
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Вход" : "Регистрация"}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              className="w-full p-2 bg-gray-700 text-white rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">Пароль:</label>
            <input
              type="password"
              className="w-full p-2 bg-gray-700 text-white rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-400 text-white p-2 rounded transition"
          >
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(""); // Очищаем ошибку при переключении
            }}
            className="text-blue-500 hover:text-blue-400"
          >
            {isLogin ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );
}
