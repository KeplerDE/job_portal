import Layout from "../../components/layout/Layout";
import UploadResume from "../../components/user/UploadResume";
import { isAuthenticatedUser } from "@/utils/isAuthenticated";

// Основной компонент страницы для загрузки резюме
export default function UploadResumePage({ access_token }) {
  // Отображение компонента Layout с вложенным компонентом UploadResume
  return (
    <Layout title="Upload Your Resume">
      <UploadResume access_token={access_token} />
    </Layout>
  );
}

// Функция getServerSideProps для предварительной загрузки данных на сервере
export async function getServerSideProps({ req }) {
  // Получение токена доступа из кук
  const access_token = req.cookies.access;

  // Проверка аутентификации пользователя
  const user = await isAuthenticatedUser(access_token);

  // Если пользователь не аутентифицирован, перенаправление на страницу входа
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Возвращение токена доступа в качестве пропса
  return {
    props: {
      access_token,
    },
  };
}
