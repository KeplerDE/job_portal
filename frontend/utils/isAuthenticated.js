import axios from "axios";
// Экспортируемая асинхронная функция для проверки аутентификации пользователя
export const isAuthenticatedUser = async (access_token) => {
  try {
    // Выполнение POST-запроса к серверу для проверки токена доступа
    const response = await axios.post(
      `${process.env.API_URL}/api/token/verify/`,
      {
        token: access_token,
      }
    );

    if (response.status === 200) return true;
    return false;
  } catch (error) {
    return false;
  }
};
