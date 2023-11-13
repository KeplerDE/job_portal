import axios from "axios";
import cookie from "cookie";

export default async (req, res) => {
  // Проверяем, является ли метод запроса POST
  if (req.method === "POST") {
    // Устанавливаем заголовок Set-Cookie для ответа
    res.setHeader("Set-Cookie", [
      // Сериализуем куки с именем 'access'. Значение куки устанавливаем пустым
      cookie.serialize("access", "", {
        httpOnly: true, // Куки доступны только на сервере (не доступны через JavaScript на клиенте)
        secure: process.env.NODE_ENV !== "development", // Использовать куки только через HTTPS, кроме режима разработки
        maxAge: new Date(0), // Устанавливаем срок действия куки в прошлое, что приведет к его удалению
        sameSite: "Lax", // Ограничение на отправку куки с запросами, инициированными из других сайтов
        path: "/", // Куки доступны для всех путей на домене
      }),
    ]);

    // Отправляем ответ со статусом 200 и объектом { success: true }
    return res.status(200).json({
      success: true,
    });
  }
};
