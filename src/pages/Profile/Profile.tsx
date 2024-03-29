import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import {
  Button,
  Input
} from "@ya.praktikum/react-developer-burger-ui-components";
import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { postLogOut, getProfileInformation } from '../../services/api';
import { getCookie } from '../../services/Cookie';
import { profileSelector, startChangeName, startChangeLogin, startChangePassword, stopChange } from '../../services/slice/profile';
import { editProfile } from '../../services/api';

//Тут нашел баг, не понимаю почему так происходит, при вводе симаолв инпут фокус теряется.

export function Profile() {

  console.log('зашел')

  const dispatch = useAppDispatch();

  const [nameValue, setNameValue] = useState('');
  const [mailValue, setmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const { name, mail, password } = useAppSelector(profileSelector);
  const { isChange, isChangeName, isChangeLogin, isChangePassword } = useAppSelector(profileSelector);

  let profile = {
    name: name,
    mail: mail,
    password: password
  }

  let profileChange = {
    name: nameValue,
    mail: mailValue,
    password: passwordValue
  }

  useEffect(() => {
    setNameValue(name)
  }, [name])

  useEffect(() => {
    setmailValue(mail)
  }, [mail])

  useEffect(() => {
    setPasswordValue(password)
  }, [password])


  let refreshToken = getCookie('refreshToken')
  let token = getCookie('token')

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setNameValue(e.target.value)
  }

  function handleChangeMail(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setmailValue(e.target.value)
  }

  function handleChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setPasswordValue(e.target.value)
  }

  function cancel() {
    dispatch(getProfileInformation())
    dispatch(stopChange())
    setNameValue(name)
    setmailValue(mail)
    setPasswordValue(password)
  }

  const Inputs = () => {
    return (
      <div>
        <div className={`${styles.input} mb-6`}>
          {isChangeName ?
            <div>
              <Input
                error={false}
                errorText={'Ошибка'}
                onChange={e => handleChangeName(e)}
                onIconClick={() => dispatch(stopChange())}
                name='name'
                value={nameValue}
                icon={'EditIcon'}
                placeholder='Имя'
                size={'default'}
                type='text'
              />

            </div>
            :
            <Input
              errorText={'Ошибка'}
              error={false}
              disabled
              onChange={e => { return false }}
              onIconClick={() => dispatch(startChangeName())}
              value={nameValue}
              icon={'EditIcon'}
              placeholder='Имя'
              size={'default'}
            />}
        </div>
        <div className={`${styles.input} mb-6`}>
          {isChangeLogin ?
            <div>
              <Input
                onIconClick={() => dispatch(stopChange())}
                onChange={e => handleChangeMail(e)}
                name='login'
                value={mailValue}
                icon={'EditIcon'}
                placeholder='Логин'
                size={'default'}
                type='text'
              />
            </div>
            :
            <Input
              onChange={e => { return false }}
              disabled
              onIconClick={() => dispatch(startChangeLogin())}
              value={mailValue}
              icon={'EditIcon'}
              placeholder='Логин'
              size={'default'}
              type='text'

            />}
        </div>
        <div className={`${styles.input} mb-6`}>
          {isChangePassword ?
            <div>
              <Input
                onChange={e => handleChangePassword(e)}
                onIconClick={() => dispatch(stopChange())}
                value={passwordValue}
                icon={'EditIcon'}
                placeholder='Пароль'
                size={'default'}
                type='email'
              />

            </div>
            :
            <Input
              onChange={e => { return false }}
              disabled
              onIconClick={() => dispatch(startChangePassword())}
              icon={'EditIcon'}
              value={passwordValue}
              placeholder='Пароль'
              size={'default'}
              type='email'
            />}
        </div>
        {isChange ?
          <div className={`${styles.buttons}`}>
            <div className={`${styles.button}`}>
              <Button type="primary" size="small"
                onClick={() => dispatch(editProfile(token, profile, profileChange))}
              >  Сохранить изменения
              </Button>
            </div>
            <div className={`${styles.button}`}>
              <Button type="primary" size="small"
                onClick={(() => cancel())}
              >  Отменить изменения
              </Button>
            </div>
          </div> : <></>
        }
      </div>
    )
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={`${styles.links_box} mr-15`}>
          <NavLink exact to={'/profile'} activeClassName={`${styles.active}`} className={`${styles.link} text text_type_main-medium`} >Профиль</NavLink>
          <NavLink
            exact
            to={"/profile/orders"}
            activeClassName={`${styles.active}`}
            className={`${styles.link} text text_type_main-medium`}>История заказов</NavLink>
          <NavLink exact to='/' activeClassName={`${styles.active}`} className={`${styles.link} text text_type_main-medium mb-20`}
            onClick={() => dispatch(postLogOut(refreshToken))}>Выход</NavLink>
          <p className={`${styles.text} `}>В этом разделе вы можете
            изменить свои персональные данные</p>
        </div>
        <Inputs />
      </div>
    </>
  )
}
