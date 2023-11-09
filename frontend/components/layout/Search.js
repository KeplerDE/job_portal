import React, { useState } from "react";
import Image from "next/image";

import { useRouter } from "next/router";

// Компонент поиска
const Search = () => {
  // состояния для ключевого слова и местоположения
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  // Используем useRouter для навигации
  const router = useRouter();

  // Обработчик отправки формы
  const submitHandler = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    // Проверяем, есть ли ключевое слово
    if (keyword) {
      // Создаем строку запроса
      let searchQuery = `/?keyword=${keyword}`;
      // Если есть местоположение, добавляем его к строке запроса
      if (location) searchQuery = searchQuery.concat(`&location=${location}`);

      // Перенаправляем пользователя на страницу с результатами поиска
      router.push(searchQuery);
    } else {
      // Если ключевое слово не указано, возвращаем пользователя на главную страницу
      router.push("/");
    }
  };

  return (
    <div className="modalMask">
      <div className="modalWrapper">
        <div className="left">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image src="/images/job-search.svg" alt="search" layout="fill" />
          </div>
        </div>
        <div className="right">
          <div className="rightContentWrapper">
            <div className="headerWrapper">
              <h2> SEARCH</h2>
            </div>
            <form className="form" onSubmit={submitHandler}>
              <div className="inputWrapper">
                <div className="inputBox">
                  <i aria-hidden className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Enter Your Keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    required
                  />
                </div>
                <div className="inputBox">
                  <i aria-hidden className="fas fa-industry"></i>
                  <input
                    type="text"
                    placeholder="Enter City, State ..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="searchButtonWrapper">
                <button type="submit" className="searchButton">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;