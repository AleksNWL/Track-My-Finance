import React, { useEffect, useState } from "react";
import '../src/styles/style.css';

function App() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [login, setLogin] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
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

    useEffect(() => {
        if (emailError || passError) {
            setFormValid(false);
        } else {
            setFormValid(true);
        }
    }, [emailError, passError]);

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

    const togglePopup = () => {
        setShowPopup(!showPopup); // Переключение состояния показа
    };

    const switchToRegistration = () => {
        setIsLoginMode(false); // Переключить на режим регистрации
    };

    const switchToLogin = () => {
        setIsLoginMode(true); // Переключить на режим входа
    };

    const handleResetPassword = () => {
        if (!resetEmail || emailError) {
            setEmailError('Введите корректный email');
            return;
        }
        setEmailError('');
        setResetMessage('Прочтите письмо на почте');
        setShowPopup(false); // Закрыть основное окно (если оно открыто)
        setShowResetPopup(false); // Закрыть окно восстановления
        setTimeout(() => setResetMessage(''), 10000); // Очистить сообщение через 10 секунд
    };


    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault(); // Остановить перезагрузку страницы
    //
    //     try {
    //         // Пример запроса на сервер для входа
    //         const response = await axios.post('/api/login', { 'email', 'password' });
    //
    //         // Установка куки после успешного входа
    //         if (response.data.token) {
    //             setCookie(null, 'userToken', response.data.token, { path: '/' });
    //             // Перенаправление на другую страницу после успешного входа
    //             navigate('/dashboard'); // Замените '/dashboard' на нужный вам маршрут
    //         }
    //     } catch (error) {
    //         console.error('Произошла ошибка при входе:', error);
    //         setError('Неверный email или пароль. Пожалуйста, попробуйте еще раз.');
    //     }
    // };


    return (
        <div>
            <button className="open-popup-btn" onClick={togglePopup}>
                Открыть Popup
            </button>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <button className="popup__close-btn" onClick={togglePopup}>
                            Закрыть
                        </button>
                        {isLoginMode ? (
                            <div className="auntification__content">
                                <h2 className="auntification__title">Вход в учетную запись</h2>
                                <form className="auntification__form">
                                    {(emailDirty && emailError) && <div className="auntification__form_email-error" style={{ color: 'red' }}>{emailError}</div>}
                                    <input className="auntification__form_email" onChange={emailHandler} value={email} onBlur={blurHandler} name="email" type="text" placeholder="Почта" />
                                    {(passError && passDirty) && <div className="auntification__form_pass-error" style={{ color: 'red' }}>{passError}</div>}
                                    <input className="auntification__form_pass" onChange={passHandler} value={pass} onBlur={blurHandler} name="password" type="password" placeholder="Пароль" />
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
                                            <button className="auntification__form_button" disabled={!formValid} type="submit">Вход</button>
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
                                <h2 className="registration__title">Регистрация</h2>
                                <form className="registration__form">
                                    <input className="registration__form_login" onChange={(e) => setLogin(e.target.value)} value={login} name="login" type="text" placeholder="Логин" />
                                    {(emailDirty && emailError) && <div className="auntification__form_email-error" style={{ color: 'red' }}>{emailError}</div>}
                                    <input className="registration__form_email" onChange={emailHandler} value={email} onBlur={blurHandler} name="email" type="text" placeholder="Почта" />
                                    {(passError && passDirty) && <div className="auntification__form_pass-error" style={{ color: 'red' }}>{passError}</div>}
                                    <input className="registration__form_pass" onChange={passHandler} value={pass} onBlur={blurHandler} name="password" type="password" placeholder="Пароль" />
                                    <input className="registration__form_confirm-pass" onChange={(e) => setConfirmPass(e.target.value)} value={confirmPass} name="confirmPassword" type="password" placeholder="Повторите пароль" />
                                    <div className="registration__frame">
                                        <div className="registration__frame-inner">
                                            <button className="registration__frame-inner_registration" disabled={!formValid || pass !== confirmPass} type="submit">
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
                    <button className="popup__close-btn" onClick={() => setShowResetPopup(false)}>Закрыть</button>
                    <div className="reset-password-content">
                        <h2 className="reset-password__title">Восстановление пароля</h2>
                        <input
                            className="reset-password__input"
                            type="text"
                            placeholder="Введите email для восстановления"
                            value={resetEmail}
                            onChange={resetEmailHandler}
                        />
                        {emailError && <p style={{ color: "red" }}>{emailError}</p>}
                        <button className="reset-password__submit-btn" onClick={handleResetPassword}>Восстановить</button>
                    </div>
                </div>
            )}

            {resetMessage && (
                <p style={{ color: "green", marginTop: "20px" }}>{resetMessage}</p>
            )}
        </div>
    );
}

export default App;
