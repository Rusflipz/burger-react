import React from 'react';
import styles from './Profile.module.css';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
  Button,
  Input
} from "@ya.praktikum/react-developer-burger-ui-components";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {postLogOut} from '../../../services/api';
import {getCookie} from '../../../services/Cookie';

export function Profile() {
  let token = getCookie('refreshToken')
  console.log(token)
  const dispatch = useDispatch();

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.links_box} mr-15`}>
      <Link to='/profile' className={`${styles.link} text text_type_main-medium`}>Профиль</Link>
      <Link to='/' className={`${styles.link} text text_type_main-medium`}>История заказов</Link>
      <Link to='/' className={`${styles.link} text text_type_main-medium mb-20`} 
      onClick={() => dispatch(postLogOut(token))}>Выход</Link>
      <p className={`${styles.text} `}>В этом разделе вы можете
изменить свои персональные данные</p>
      </div>
      <div>
      <div className={`mb-6`}>
          <Input
          icon={'EditIcon'}
            placeholder='Имя'
            size={'default'}
            type='text'
          />
        </div>
        <div className={`mb-6`}>
          <Input
          icon={'EditIcon'}
            placeholder='Логин'
            size={'default'}
            type='email'
          />
        </div>

        <div className={`mb-6`}>
          <Input
          icon={'EditIcon'}
            placeholder='Пароль'
            size={'default'}
            type='password'
          />
        </div>
      </div>
    </div>
  );
} 