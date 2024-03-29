import styles from './Login.module.css';
import {
  Button,
  Input
} from "@ya.praktikum/react-developer-burger-ui-components";
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { postLogin } from '../../services/api';
import { Redirect, useLocation } from 'react-router-dom';
import { profileSelector } from '../../services/slice/profile';
import React, { useState } from 'react';
import { getCookie } from '../../services/Cookie';

export function LoginPage() {
  const dispatch = useAppDispatch()

  //ЕСЛИ БРАТЬ ИЗ ХРАНИЛИЩА isUserLoaded, ТО НУЖНО ОТПРАВЛЯТЬ ЗАПРОС НА ПОЛУЧЕНИЕ ДАННЫХ, ПОЭТОМУ ПРОЩЕ СРАВНИТЬ УЖЕ С ИМЕЕЮЩИМЕСЯ ДАННЫМИ ИЛИ ДЕЛАТЬ ЗАПРОС НА ПОЛУЧЕНИЯ ДАННЫХ В КАЖДОМ ФАЙЛЕ ИЛИ ПРИ ЗАКГРЫЗКЕ ПРИЛОЖЕНИЯ.

  let isUserLoaded = false

  let token = getCookie('token')

  if (token && token !== '') {
    isUserLoaded = true
  }

  const { profileSuccess, error } = useAppSelector(profileSelector);

  const [mailValue, setmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  function handleClick(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    let info = {
      mail: mailValue,
      password: passwordValue,
    }
    dispatch(postLogin(info))
  }

  interface LocationState {
    from: string;
    pathname: string;
    search: string;
    hash: string;
    state: object | undefined;
    background2: LocationState;
    background3: LocationState;
    background1: LocationState;
  }

  let location = useLocation<LocationState>();

  function handleChangeMail(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setmailValue(e.target.value)
  }

  function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setPasswordValue(e.target.value)
  }

  return (
    <>
      {isUserLoaded && <Redirect to={location?.state?.from || "/"} />}
      <div className={styles.wrapper}>
        <h1 className={`${styles.heading} text text_type_main-medium mb-6`}>Вход</h1>
        <form className={`${styles.form} mb-20`}
          onSubmit={(evt) => handleClick(evt)}
        >
          <div className={`mb-6`}>
            <Input
              onChange={e => handleChangeMail(e)}
              placeholder='E-mail'
              size={'default'}
              type='email'
              value={mailValue}
            />
          </div>
          <div className={`mb-6`}>
            <Input
              onChange={e => handleChangePassword(e)}
              placeholder='Пароль'
              size={'default'}
              type='password'
              icon={'ShowIcon'}
              value={passwordValue}
            />
          </div>
          <Button>Войти</Button>
        </form>
        <p className={`${styles.text} mb-4`}>Вы — новый пользователь? <Link to='/registration' className={styles.link}>Зарегистрироваться</Link></p>
        <p className={styles.text}>Забыли пароль? <Link to='/forgot-password' className={styles.link}>Восстановить пароль</Link></p>
      </div>

    </>
  );
} 