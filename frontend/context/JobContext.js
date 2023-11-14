import axios from "axios";
import { useState, useEffect, createContext } from "react";
import { useRouter } from "next/router";

// Создание контекста для работы с вакансиями
const JobContext = createContext();

// Провайдер контекста, который будет оборачивать дочерние компоненты
export const JobProvider = ({ children }) => {
  // Состояния для управления загрузкой, ошибками, обновлениями, подачей заявок и статистикой
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [applied, setApplied] = useState(false);
  const [stats, setStats] = useState(false);

  // Использование useRouter для навигации в Next.js
  const router = useRouter();

  // Функция для подачи заявки на работу
  const applyToJob = async (id, access_token) => {
    try {
      setLoading(true); // Включение индикатора загрузки
      // Отправка POST-запроса для подачи заявки на работу
      const res = await axios.post(
        `${process.env.API_URL}/api/jobs/${id}/apply/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Обработка успешного ответа
      if (res.data.applied === true) {
        setLoading(false); // Выключение индикатора загрузки
        setApplied(true); // Обновление состояния подачи заявки
      }
    } catch (error) {
      setLoading(false); // Выключение индикатора загрузки при ошибке
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Функция для проверки, подана ли заявка на работу
  const checkJobApplied = async (id, access_token) => {
    try {
      setLoading(true); // Включение индикатора загрузки

      // Отправка GET-запроса для проверки статуса заявки
      const res = await axios.get(
        `${process.env.API_URL}/api/jobs/${id}/check/`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setLoading(false); // Выключение индикатора загрузки
      setApplied(res.data); // Обновление состояния подачи заявки
    } catch (error) {
      setLoading(false); // Выключение индикатора загрузки при ошибке
      // Установка сообщения об ошибке
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };

  // Функция для получения статистики по теме
  const getTopicStats = async (topic) => {
    try {
      setLoading(true); // Включение индикатора загрузки

      // Отправка GET-запроса для получения статистики
      const res = await axios.get(`${process.env.API_URL}/api/stats/${topic}/`);

      setLoading(false); // Выключение индикатора загрузки
      setStats(res.data); // Обновление состояния статистики
    } catch (error) {
      setLoading(false); // Выключение индикатора загрузки при ошибке
      // Установка сообщения об ошибке
      setError(
        error.response &&
          (error.response.data.detail || error.response.data.error)
      );
    }
  };
  // Функция для очистки сообщений об ошибках
  const clearErrors = () => {
    setError(null);
  };

  // Предоставление состояний и функций через контекст
  return (
    <JobContext.Provider
      value={{
        loading,
        error,
        updated,
        applied,
        stats,
        getTopicStats,
        applyToJob,
        checkJobApplied,
        setUpdated,
        clearErrors,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

// Экспорт контекста для использования в других компонентах
export default JobContext;
