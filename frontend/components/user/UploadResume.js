import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import AuthContext from "../../context/AuthContext";
import { toast } from "react-toastify";

// Компонент для загрузки резюме
const UploadResume = ({ access_token }) => {
  // Состояние для хранения файла резюме
  const [resume, setResume] = useState(null);

  // Использование useRouter для навигации
  const router = useRouter();

  // Получение данных и функций из контекста аутентификации
  const {
    loading,
    user,
    uploaded,
    error,
    clearErrors,
    uploadResume,
    setUploaded,
  } = useContext(AuthContext);

  // useEffect для обработки изменений в контексте
  useEffect(() => {
    // Показываем ошибку, если она есть, и очищаем ее после
    if (error) {
      toast.error(error);
      clearErrors();
    }

    // Если резюме успешно загружено
    if (uploaded) {
      setUploaded(false); // Сброс флага загрузки
      toast.success("Your resume is uploaded successfully."); // Показываем сообщение об успешной загрузке
    }
  }, [error, uploaded]);

  // Обработчик отправки формы
  const submitHandler = (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    // Создаем объект FormData и добавляем в него файл резюме
    const formData = new FormData();
    formData.append("resume", resume);

    // Вызываем функцию для загрузки резюме, передавая FormData и токен доступа
    uploadResume(formData, access_token);
  };

  // Обработчик изменений в input типа file
  const onChange = (e) => {
    setResume(e.target.files[0]); // Обновляем состояние файла резюме
  };


  return (
    <div className="modalMask">
      <div className="modalWrapper">
        <div className="left">
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Image src="/images/resume-upload.svg" alt="resume" layout="fill" />
          </div>
        </div>
        <div className="right">
          <div className="rightContentWrapper">
            <div className="headerWrapper">
              <h3> UPLOAD RESUME </h3>
            </div>
            <form className="form" onSubmit={submitHandler}>
              <div className="inputWrapper">
                <div className="inputBox">
                  <i aria-hidden className="fas fa-upload"></i>
                  <input
                    type="file"
                    name="resume"
                    id="customFile"
                    accept="application/pdf"
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              {user && user.resume && (
                <>
                  <h4 className="text-center my-3">OR</h4>

                  <Link
                    href={`https://jo-api.s3.amazonaws.com/${user.resume}`}
                  >
                    <a
                      className="text-success text-center ml-4"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <b>
                        <i aria-hidden className="fas fa-download"></i> Download
                        Your Resume
                      </b>
                    </a>
                  </Link>
                </>
              )}

              <div className="uploadButtonWrapper">
                <button type="submit" className="uploadButton">
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;