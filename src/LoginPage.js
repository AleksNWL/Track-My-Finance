import React, { useEffect, useState } from "react";
import axios from "axios";
import {BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import '../src/styles/style.css';
import {useCookies} from "react-cookie";
import React, { useState, useEffect } from 'react';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Регистрация модулей Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
        const { ctx, chartArea: { top, bottom, left, right } } = chart;
        const text = chart.options.plugins.centerText;
        if (text) {
            ctx.save();
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#555";
            ctx.fillText(text, (left + right) / 2, (top + bottom) / 2);
            ctx.restore();
        }
    }
};

ChartJS.register(centerTextPlugin);

const DonutChart = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
    const [isIncomeMode, setIsIncomeMode] = useState(true);
    const [transactions, setTransactions] = useState({
        expenses: {},
        incomes: {},
    });
    const [newTransaction, setNewTransaction] = useState({
        type: 'income',
        category: '',
        description: '',
        amount: '',
        date: '',
    });
    const [editTransaction, setEditTransaction] = useState(null);

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const categories = [
        { name: "Категория 1", color: "#4fc3f7" },
        { name: "Категория 2", color: "#ff4081" },
        { name: "Категория 3", color: "#4caf50" },
        { name: "Категория 4", color: "#cfd8dc" },
        { name: "Категория 5", color: "#ffcc80" },
        { name: "Категория 6", color: "#90caf9" },
        { name: "Категория 7", color: "#ff8a65" },
        { name: "Категория 8", color: "#a5a6a7" },
        { name: "Категория 9", color: "#e0e0e0" },
        { name: "Категория 10", color: "#b39ddb" },
    ];

    const handlePrevMonth = () => {
        setMonthIndex((prev) => (prev - 1 + months.length) % months.length);
    };

    const handleNextMonth = () => {
        setMonthIndex((prev) => (prev + 1) % months.length);
    };

    const handleAddTransaction = () => {
        if (!newTransaction.category || !newTransaction.description || !newTransaction.amount || !newTransaction.date) {
            alert('Все поля должны быть заполнены!');
            return;
        }

        const [year, month] = newTransaction.date.split('-');
        const monthKey = `${year}-${months[parseInt(month) - 1]}`;
        setTransactions((prev) => {
            const updatedTransactions = { ...prev };
            const typeKey = newTransaction.type === 'income' ? 'incomes' : 'expenses';
            if (!updatedTransactions[typeKey][monthKey]) {
                updatedTransactions[typeKey][monthKey] = [];
            }
            updatedTransactions[typeKey][monthKey].push({
                category: newTransaction.category,
                description: newTransaction.description,
                amount: parseFloat(newTransaction.amount),
                date: newTransaction.date,
            });
            return updatedTransactions;
        });
        setNewTransaction({ type: 'income', category: '', description: '', amount: '', date: '' });
    };


    const handleEditTransaction = (transaction) => {
        console.log('Редактируем транзакцию:', transaction); // Добавить лог для отладки
        setEditTransaction(transaction);
    };

    const handleSaveEditTransaction = () => {
        if (!editTransaction.category || !editTransaction.description || !editTransaction.amount || !editTransaction.date) {
            alert('Все поля должны быть заполнены!');
            return;
        }

        const [year, month] = editTransaction.date.split('-');
        const monthKey = `${year}-${months[parseInt(month) - 1]}`;

        setTransactions((prev) => {
            const updatedTransactions = { ...prev };
            const typeKey = editTransaction.type === 'income' ? 'incomes' : 'expenses';
            const transactionsForMonth = updatedTransactions[typeKey][monthKey] || [];

            const updatedTransactionsForMonth = transactionsForMonth.map((t) =>
                t.date === editTransaction.date ? { ...editTransaction } : t
            );

            updatedTransactions[typeKey][monthKey] = updatedTransactionsForMonth;
            return updatedTransactions;
        });

        setEditTransaction(null);
    };





    const handleDeleteTransaction = (transaction) => {
        const [year, month] = transaction.date.split('-');
        const monthKey = `${year}-${months[parseInt(month) - 1]}`;

        setTransactions((prev) => {
            const updatedTransactions = { ...prev };
            const typeKey = transaction.type === 'income' ? 'incomes' : 'expenses';

            // Проверка на наличие транзакций
            const filteredTransactions = updatedTransactions[typeKey][monthKey] || [];

            updatedTransactions[typeKey][monthKey] = filteredTransactions.filter(
                (t) => t.date !== transaction.date || t.description !== transaction.description || t.amount !== transaction.amount
            );

            return updatedTransactions;
        });
    };



    const currentMonth = months[monthIndex];
    const currentMonthKey = `${year}-${currentMonth}`;

    const currentTransactions = isIncomeMode
        ? transactions.incomes[currentMonthKey] || []
        : transactions.expenses[currentMonthKey] || [];



    // Добавляем защиту от ошибок для категорий
    const data = {
        labels: categories.map((cat) => cat.name),
        datasets: [
            {
                data: categories.map((cat) => {
                    // Защита от undefined
                    return (currentTransactions || [])
                        .filter((t) => t.category === cat.name)
                        .reduce((sum, t) => sum + t.amount, 0);
                }),
                backgroundColor: categories.map((cat) => cat.color),
                hoverBackgroundColor: categories.map((cat) => cat.color),
            },
        ],
    };


    const options = {
        responsive: true,
        cutout: "70%",
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
            centerText: `${currentMonth} ${year}`,
        },
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            {/* Выбор года */}
            <div>
                <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    style={{
                        marginBottom: "10px",
                        padding: "5px",
                        fontSize: "16px",
                    }}
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            {/* Динамическая диаграмма */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button
                    onClick={handlePrevMonth}
                    style={{
                        marginRight: "20px",
                        padding: "10px",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    ←
                </button>

                <div style={{ width: "400px", height: "400px" }}>
                    <Doughnut data={data} options={options} />
                </div>

                <button
                    onClick={handleNextMonth}
                    style={{
                        marginLeft: "20px",
                        padding: "10px",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    →
                </button>
            </div>

            {/* Переключение между доходами и расходами */}
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={() => setIsIncomeMode(!isIncomeMode)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        backgroundColor: isIncomeMode ? "#4caf50" : "#f44336",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                    }}
                >
                    {isIncomeMode ? "Показать расходы" : "Показать доходы"}
                </button>
            </div>

            {/* Форма добавления новой транзакции */}
            <div style={{ marginTop: "20px" }}>
                <h3>Добавить транзакцию</h3>
                <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                    style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                >
                    <option value="income">Доход</option>
                    <option value="expense">Расход</option>
                </select>

                <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                    style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Описание"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                />

                <input
                    type="number"
                    placeholder="Сумма"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                />

                <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                />

                <button
                    onClick={handleAddTransaction}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                    }}
                >
                    Добавить
                </button>
            </div>

            {/* Список транзакций */}
            <div style={{ marginTop: "20px", textAlign: "left", maxWidth: "400px", margin: "20px auto" }}>
                <h3>Список транзакций</h3>
                <ul>
                    {currentTransactions.map((t, index) => (
                        <li key={index} style={{ marginBottom: "10px" }}>
                            <strong>{t.category}</strong> - {t.description} - {t.date} - {t.amount} ₽
                            <button onClick={() => handleEditTransaction(t)} style={{ marginLeft: "10px", cursor: "pointer" }}>
                                Редактировать
                            </button>
                            <button
                                onClick={() => handleDeleteTransaction(t)}
                                style={{
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    padding: "5px",
                                }}
                            >
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Форма редактирования транзакции */}
            {editTransaction && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Редактировать транзакцию</h3>
                    <select
                        value={editTransaction.type}
                        onChange={(e) => setEditTransaction({ ...editTransaction, type: e.target.value })}
                        style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                    >
                        <option value="income">Доход</option>
                        <option value="expense">Расход</option>
                    </select>

                    <select
                        value={editTransaction.category}
                        onChange={(e) => setEditTransaction({ ...editTransaction, category: e.target.value })}
                        style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Описание"
                        value={editTransaction.description}
                        onChange={(e) => setEditTransaction({ ...editTransaction, description: e.target.value })}
                        style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                    />

                    <input
                        type="number"
                        placeholder="Сумма"
                        value={editTransaction.amount}
                        onChange={(e) => setEditTransaction({ ...editTransaction, amount: e.target.value })}
                        style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                    />

                    <input
                        type="date"
                        value={editTransaction.date}
                        onChange={(e) => setEditTransaction({ ...editTransaction, date: e.target.value })}
                        style={{ padding: "5px", fontSize: "16px", marginRight: "10px" }}
                    />

                    <button
                        onClick={handleSaveEditTransaction}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            backgroundColor: "#4caf50",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "5px",
                        }}
                    >
                        Сохранить
                    </button>
                </div>
            )}
        </div>
    );
};




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
                                    <input className="auntification__form_email" onChange={usernameHandler}
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
            <div className="charts">
                <DonutChart />
            </div>
        </div>
    );
}

export default LoginPage;
