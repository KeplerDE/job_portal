import axios from "axios";
import cookie from "cookie";

export default async (req, res) => {
  // Проверяем, является ли метод запроса GET
  if (req.method === "GET") {
    // Разбираем куки из заголовка запроса. Если куки нет, используем пустую строку
    const cookies = cookie.parse(req.headers.cookie || "");

    // Получаем токен доступа из куки или устанавливаем его в false, если его нет
    const access = cookies.access || false;

    // Если токена доступа нет, отправляем ответ с кодом 401 (Неавторизован)
    if (!access) {
      return res.status(401).json({
        message: "Login first to load user",
      });
    }

    try {
      // Делаем GET-запрос на сервер для получения данных пользователя
      // Используем токен доступа в заголовке Authorization
      const response = await axios.get(`${process.env.API_URL}/api/me/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      // Если получаем данные пользователя, отправляем их обратно клиенту
      if (response.data) {
        return res.status(200).json({
          user: response.data,
        });
      }
    } catch (error) {
      res.status(error?.response?.status).json({
        error: "Something went wrong while retrieving user",
      });
    }
  }
};
