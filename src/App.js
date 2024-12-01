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
    const [showPopup, setShowPopup] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showResetPopup, setShowResetPopup] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');

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
        setShowPopup(!showPopup);
    };

    const switchToRegistration = () => {
        setIsLoginMode(false);
    };

    const switchToLogin = () => {
        setIsLoginMode(true);
    };

    const handleResetPassword = () => {
        if (!resetEmail || emailError) {
            setEmailError('Введите корректный email');
            return;
        }
        setEmailError('');
        setResetMessage('Прочтите письмо на почте');
        setShowResetPopup(false);
        setTimeout(() => setResetMessage(''), 10000);
    };
    
    const resetEmailHandler = (e) => {
        setResetEmail(e.target.value);
        validateEmail(e.target.value);
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
                        {isLoginMode ? (
                            <div className="auntification__content">
                                <button className="popup__close-btn" onClick={togglePopup}></button>
                                <h2 className="auntification__title">Вход в учетную запись</h2>
                                <form className="auntification__form">
                                    <input className="auntification__form_login" onChange={(e) => setLogin(e.target.value)} value={login} name="login" type="text" placeholder="Логин" />
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
                                <button className="popup__close-btn" onClick={togglePopup}></button>
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

export default App;
