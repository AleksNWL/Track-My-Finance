import React, {useEffect, useState} from "react";
import '../src/styles/style.css';

function App() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [emailDirty, setEmailDirty] = useState(false)
    const [passDirty, setPassDirty] = useState(false)
    const [emailError, setEmailError] = useState('Почта не может быть пустой!')
    const [passError, setPassError] = useState('Пароль не может быть пустым!')
    const [formValid, setFormValid] = useState(false)

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

    return (
        <div className="auntification__content">
            <h2 className="auntification__title">Вход в учетную запись</h2>
            <form className="auntification__form">
                {(emailDirty && emailError) && <div className="auntification__form_email-error" style={{color: 'red'}}>{emailError}</div>}
                <input className="auntification__form_email" onChange={e => emailHandler(e)} value={email} onBlur={e => blurHandler(e)} name="email" type="text" placeholder="Почта"/>
                {(passError && passDirty) && <div className="auntification__form_pass-error" style={{color: 'red'}}>{passError}</div>}
                <input className="auntification__form_pass" onChange={e => passHandler(e)} value={pass} onBlur={e => blurHandler(e)} name="password" type="password" placeholder="Пароль"/>
                <div className="auntification__frame">
                    <h3 className="auntification__frame_text"><a className="dd" href="/#">dggd</a>Регистрация</h3>
                    <button className="auntification__form_button" disabled={!formValid} type="submit">Вход</button>
                </div>
            </form>
        </div>
  );
}

export default App;
