import axios from "axios";
import { useState, useEffect, createContext } from "react";

import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [updated, setUpdated] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, [user]);

// Функция для входа пользователя в систему
const login = async ({ username, password }) => {
  try {
    // Устанавливаем состояние загрузки в true
    setLoading(true);

    // Отправляем POST-запрос на сервер для аутентификации пользователя
    // Передаем в запросе имя пользователя и пароль
    const res = await axios.post("/api/auth/login", {
      username,
      password,
    });

    // Проверяем, успешно ли выполнен вход (поле success в ответе сервера)
    if (res.data.success) {
      // Загружаем данные пользователя
      loadUser();
      // Устанавливаем состояние аутентификации в true
      setIsAuthenticated(true);
      // Завершаем процесс загрузки
      setLoading(false);
      // Перенаправляем пользователя на главную страницу
      router.push("/");
    }
  } catch (error) {
    // В случае ошибки отключаем состояние загрузки
    setLoading(false);
    // Устанавливаем сообщение об ошибке, полученное от сервера
    setError(
      error.response &&
      (error.response.data.detail || error.response.data.error)
    );
  }
};


// Функция для регистрации пользователя
const register = async ({ firstName, lastName, email, password }) => {
  try {
    setLoading(true); // Включаем индикатор загрузки

    // Отправляем POST-запрос на сервер для регистрации пользователя
    const res = await axios.post(`${process.env.API_URL}/api/register/`, {
      first_name: firstName, // Передаем имя пользователя
      last_name: lastName,   // Передаем фамилию пользователя
      email,                 // Передаем email пользователя
      password,              // Передаем пароль пользователя
    });

    console.log(res.data); // Выводим в консоль полученные данные для отладки

    // Проверяем, содержит ли ответ сообщение (например, об успешной регистрации)
    if (res.data.message) {
      setLoading(false); // Выключаем индикатор загрузки
      router.push("/login"); // Перенаправляем пользователя на страницу входа
    }
  } catch (error) {
    console.log(error.response); // Выводим ошибку в консоль для отладки
    setLoading(false); // Выключаем индикатор загрузки

    // Устанавливаем сообщение об ошибке, полученное от сервера
    setError(
      error.response &&
      (error.response.data.detail || error.response.data.error)
    );
  }
};



  // Load user
  const loadUser = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/auth/user");

      if (res.data.user) {
        setIsAuthenticated(true);
        setLoading(false);
        setUser(res.data.user);
      }
    } catch (error) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Logout user
  const logout = async () => {
    try {
      const res = await axios.post("/api/auth/logout");

      if (res.data.success) {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };
  // Update user
  const updateProfile = async (
    { firstName, lastName, email, password },
    access_token
  ) => {
    try {
      setLoading(true);

      const res = await axios.put(
        `${process.env.API_URL}/api/me/update/`,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (res.data) {
        setLoading(false);
        setUpdated(true);
        setUser(res.data);
      }
    } catch (error) {
      console.log(error.response);
      setLoading(false);
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Clear Errors
  const clearErrors = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        error,
        isAuthenticated,
        updated,
        login,
        register,
        updateProfile,
        logout,
        setUpdated,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;