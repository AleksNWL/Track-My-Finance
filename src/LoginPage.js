import axios from "axios";
import {BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import '../src/styles/style.css';
import {useCookies} from "react-cookie";
import React, { useState, useEffect } from 'react';
import { Doughnut } from "react-chartjs-2";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [login, setLogin] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [username, setUsername] = useState('');
    const [emailDirty, setEmailDirty] = useState(false);
    const [passDirty, setPassDirty] = useState(false);
    const [emailError, setEmailError] = useState('Почта не может быть пустой!');
    const [passError, setPassError] = useState('Пароль не может быть пустым!');
    const [formValid, setFormValid] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // Показывать popup
    const [isLoginMode, setIsLoginMode] = useState(true); // Режим (вход или регистрация)
    const [showResetPopup, setShowResetPopup] = useState(false); // Окно восстановления пароля
    const [resetEmail, setResetEmail] = useState(''); // Email для восстановления
    const [resetMessage, setResetMessage] = useState(''); // Сообщение после восстановления
    const [cookies, setCookie] = useCookies(['jwt']);

    const navigate = useNavigate();

    useEffect(() => {
        if (emailError || passError) {
            setFormValid(false);
        } else {
            setFormValid(true);
        }
    }, [emailError, passError]);

    const usernameHandler = (e) => {
        setLogin(e.target.value);
        if (!e.target.value) {
            setEmailError('Имя пользователя не может быть пустым!');
        } else {
            setEmailError('');
        }
    };


    const emailHandler = (e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const resetEmailHandler = (e) => {
        setResetEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (!re.test(String(email))) {
            setEmailError('Некорректная почта');
        } else {
            setEmailError('');
        }
    };

    const passHandler = (e) => {
        setPass(e.target.value);
        if (e.target.value.length <= 5) {
            setPassError('Пароль должен быть длиннее 5 символов');
            if (!e.target.value) {
                setPassError('Пароль не может быть пустым');
            }
        } else {
            setPassError('');
        }
    };

    const blurHandler = (e) => {
        switch (e.target.name) {
            case 'email':
                setEmailDirty(true);
                break;
            case 'password':
                setPassDirty(true);
                break;
            default:
                break;
        }
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        if (!email || !pass || !login || pass !== confirmPass) {
            alert('Пожалуйста, заполните все поля и убедитесь, что пароли совпадают');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/register', {
                username: login,
                password: pass,
                email: email,
            });

            alert(response.data.message); // Уведомление об успешной регистрации
            switchToLogin(); // Переключиться на форму входа
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert('Пользователь с таким email уже зарегистрирован');
            } else {
                console.error('Ошибка при регистрации:', error);
            }
        }
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const switchToRegistration = () => {
        setIsLoginMode(false);
    };

    const switchToLogin = () => {
        setIsLoginMode(true);
    };

    const handleResetPassword = async () => {
        if (!resetEmail || emailError) {
            setEmailError('Введите корректный email');
            return;
        }
        setEmailError('');
        setResetMessage('Прочтите письмо на почте');
        setShowPopup(false); // Закрыть основное окно (если оно открыто)
        setShowResetPopup(false); // Закрыть окно восстановления
        try {
            // Отправка запроса на сервер для восстановления пароля
            const response = await axios.post('http://localhost:8080/api/v1/password/recovery', {
                email: resetEmail,
            });
            setResetMessage(response.data); // Сообщение об успешной отправке письма
            setShowPopup(false); // Закрыть popup
            setShowResetPopup(false);// Закрыть окно восстановления
            // console.log(response.data);
        } catch (error) {
            if (error.response) {
                // Обработка ошибки от сервера
                setResetMessage(error.response.data);
            } else {
                console.error('Ошибка при восстановлении пароля:', error);
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
                username: login,
                password: pass,
            })

            const token = response.data.token;
            setCookie('jwt', token, {maxAge: 720 * 60 * 60 });
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        console.log("Некорректный запрос. Проверьте данные и попробуйте снова.");
                        break;
                    case 401:
                        console.log("Неверные имя пользователя или пароль.");
                        break;
                    case 403:
                        console.log("Доступ запрещен. У вас нет прав для входа.");
                        break;
                    case 404:
                        console.log("Пользователь не найден. Проверьте введённые данные.");
                        break;
                    default:
                        console.log(`Произошла неизвестная ошибка: ${error.response.status}`);
                }
            }else {
                console.error('Ошибка при входе:', error);
            }
        }
    };


    return (
        <div>
            <header class="header">
                <h1 class="header__logo">Track My Finance</h1>
                <button className="open-popup-btn" onClick={togglePopup} aria-label="Войти в профиль">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="profile-icon"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4a2 2 0 11-.001 4.001A2 2 0 0112 6zm0 14c-2.5 0-4.71-1.28-6-3.22.03-2 4-3.08 6-3.08s5.97 1.08 6 3.08C16.71 18.72 14.5 20 12 20z" />
                    </svg>
                </button>
            </header>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <button className="popup__close-btn" onClick={togglePopup}>
                            &#10006;
                        </button>
                        {isLoginMode ? (
                            <div className="auntification__content">
                                <button className="popup__close-btn" onClick={togglePopup}></button>
                                <h2 className="auntification__title">Вход в учетную запись</h2>
                                <form className="auntification__form">
                                    {(emailDirty && emailError) && <div className="auntification__form_email-error"
                                                                        style={{color: 'red'}}>{emailError}</div>}
                                    <input className="auntification__form_login" onChange={usernameHandler}
                                           value={login} onBlur={blurHandler} name="email" type="text"
                                           placeholder="Имя пользователя"/>
                                    {(passError && passDirty) && <div className="auntification__form_pass-error"
                                                                      style={{color: 'red'}}>{passError}</div>}
                                    <input className="auntification__form_pass" onChange={passHandler} value={pass}
                                           onBlur={blurHandler} name="password" type="password" placeholder="Пароль"/>
                                    <div className="auntification__frame">
                                        <div className="auntification__frame-inner">
                                            <h3 className="auntification__frame-inner_text">
                                                <a
                                                    className="auntification__frame-inner_link"
                                                    href="/#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        switchToRegistration();
                                                    }}
                                                >
                                                    Регистрация
                                                </a>
                                            </h3>
                                            <button className="auntification__form_button" onClick={handleLogin}
                                                    disabled={!formValid} type="submit">Вход
                                            </button>
                                        </div>
                                        <h3 className="auntification__frame_lost-password">
                                            Забыли пароль?{' '}
                                            <a
                                                className="auntification__frame_link"
                                                href="/#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowResetPopup(true);
                                                    setShowPopup(false);
                                                }}
                                            >
                                                Восстановить
                                            </a>

                                        </h3>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="registration__content">
                                <button className="popup__close-btn" onClick={togglePopup}></button>
                                <h2 className="registration__title">Регистрация</h2>
                                <form className="registration__form">
                                    <input className="registration__form_login"
                                           onChange={(e) => setLogin(e.target.value)} value={login} name="login"
                                           type="text" placeholder="Логин"/>
                                    {(emailDirty && emailError) && <div className="auntification__form_email-error"
                                                                        style={{color: 'red'}}>{emailError}</div>}
                                    <input className="registration__form_email" onChange={emailHandler} value={email}
                                           onBlur={blurHandler} name="email" type="text" placeholder="Почта"/>
                                    {(passError && passDirty) && <div className="auntification__form_pass-error"
                                                                      style={{color: 'red'}}>{passError}</div>}
                                    <input className="registration__form_pass" onChange={passHandler} value={pass}
                                           onBlur={blurHandler} name="password" type="password" placeholder="Пароль"/>
                                    <input className="registration__form_confirm-pass"
                                           onChange={(e) => setConfirmPass(e.target.value)} value={confirmPass}
                                           name="confirmPassword" type="password" placeholder="Повторите пароль"/>
                                    <div className="registration__frame">
                                        <div className="registration__frame-inner">
                                            <button className="registration__frame-inner_registration"
                                                    onClick={handleRegistration}
                                                    disabled={!formValid || pass !== confirmPass} type="submit">
                                                Зарегистрироваться
                                            </button>
                                            <a
                                                className="registration__frame-inner_login"
                                                href="/#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    switchToLogin();
                                                }}
                                            >
                                                Войти
                                            </a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showResetPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className="reset-password-content">
                            <button className="popup__close-btn" onClick={() => setShowResetPopup(false)}></button>
                            <h2 className="reset-password__title">Восстановление пароля</h2>
                            {(emailDirty && emailError) && <div className="auntification__form_email-error" style={{ color: 'red' }}>{emailError}</div>}
                            <input
                                className="auntification__form_email"
                                onChange={resetEmailHandler}
                                value={resetEmail}
                                onBlur={blurHandler}
                                name="email"
                                type="text"
                                placeholder="Почта"
                            />
                            <button
                                className="reset-password__submit-btn"
                                onClick={handleResetPassword}
                                disabled={!resetEmail || emailError}
                            >
                                Восстановить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;