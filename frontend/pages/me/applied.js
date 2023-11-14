import axios from "axios";
import Layout from "../../components/layout/Layout";
import JobsApplied from "../../components/job/JobsApplied";

import { isAuthenticatedUser } from "../../utils/isAuthenticated";

// Основная функция компонента страницы, которая отображает список поданных заявок на работу
export default function JobsAppliedPage({ jobs }) {
  return (
    <Layout title="Jobs Applied">
      {/* Компонент JobsApplied получает список работ, на которые пользователь подал заявку */}
      <JobsApplied jobs={jobs} />
    </Layout>
  );
}

// Функция getServerSideProps используется для предварительной загрузки данных на сервере перед рендерингом страницы
export async function getServerSideProps({ req }) {
  // Получаем токен доступа из cookies запроса
  const access_token = req.cookies.access;

  // Проверяем, аутентифицирован ли пользователь
  const user = await isAuthenticatedUser(access_token);

  // Если пользователь не аутентифицирован, перенаправляем его на страницу входа
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Если пользователь аутентифицирован, делаем запрос к API для получения списка поданных заявок на работу
  const res = await axios.get(`${process.env.API_URL}/api/me/jobs/applied/`, {
    headers: {
      Authorization: `Bearer ${access_token}`, // Добавляем токен доступа в заголовки запроса
    },
  });

  // Получаем данные о работах из ответа
  const jobs = res.data;

  // Возвращаем данные о работах в качестве props для компонента страницы
  return {
    props: {
      jobs,
    },
  };
}
