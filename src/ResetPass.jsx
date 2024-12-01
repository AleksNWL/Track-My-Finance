import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPass = () => {
    const { token } = useParams(); // Получаем токен из URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Неверная ссылка');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            // Отправка запроса на сервер для обновления пароля
            const response = await axios.post(
                `http://localhost:8080/api/v1/auth/reset-password?${token}`,
                { newPassword }
            );
            setMessage(response.data.message); // Сообщение об успешном сбросе пароля
            setTimeout(() => navigate('/LoginPage'), 5000); // Перенаправление на страницу входа через 5 секунд
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Ошибка при сбросе пароля');
        }
    };

    return (
        <div>
            <h2>Сброс пароля</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Подтвердите новый пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Сбросить пароль</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default ResetPass;
