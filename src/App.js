import React, {useEffect, useState} from "react";
import { useCookies } from 'react-cookie';
import './styles/style.css';

function App() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [emailDirty, setEmailDirty] = useState(false)
    const [passDirty, setPassDirty] = useState(false)
    const [emailError, setEmailError] = useState('Почта не может быть пустой!')
    const [passError, setPassError] = useState('Пароль не может быть пустым!')
    const [formValid, setFormValid] = useState(false)
    const [cookies, setCookie] = useCookies(['userToken']) //wdqfqe

    useEffect(() => {
        if (emailError || passError) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }, [emailError, passError])

    const emailHandler = (e) => {
        setEmail(e.target.value)
        const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!re.test(String(e.target.value))) {
            setEmailError('Некоректная почта')
        } else {
            setEmailError('')
        }
    }

    const passHandler = (e) => {
        setPass(e.target.value)
        if (e.target.value.length <= 5) {
            setPassError('Пароль должен быть длиннее 5 символов')
            if (!e.target.value) {
                setPassError('Пароль не может быть пустым')
            }
        } else {
            setPassError('')
        }
    }

    const blurHandler = (e) => {
        switch (e.target.name) {
            case 'email':
                setEmailDirty(true)
                break
            case 'password':
                setPassDirty(true)
                break
        }
    }

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
        <header className="auntification">
            <h2 className="auntification__title">Вход в учётную запись</h2>
            <form onSubmit={handleSubmit} className="auntification__form">
                {(emailDirty && emailError) && <div className="auntification__form_email-error" style={{color: 'red'}}>{emailError}</div>}
                <input className="auntification__form_email" onChange={e => emailHandler(e)} value={formData.email} onBlur={e => blurHandler(e)} name="email" type="text" placeholder="Почта"/>
                {(passError && passDirty) && <div className="auntification__form_pass-error" style={{color: 'red'}}>{passError}</div>}
                <input className="auntification__form_pass" onChange={e => passHandler(e)} value={formData.pass} onBlur={e => blurHandler(e)} name="password" type="password" placeholder="Пароль"/>
                <button className="auntification__form_button" onChange={handleSubmit} disabled={!formValid} type="submit">Вход</button>
            </form>
        </header>
  );
}

export default App;
