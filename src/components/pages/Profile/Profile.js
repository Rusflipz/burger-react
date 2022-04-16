import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
  Button,
  Input
} from "@ya.praktikum/react-developer-burger-ui-components";
import { Link, Route, useLocation, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { postLogOut, getProfileInformation } from '../../../services/api';
import { getCookie } from '../../../services/Cookie';
import { profileSelector, startChangeName, startChangeLogin, startChangePassword, stopChange, postChange } from '../../../services/slice/profile';
import { editProfile } from '../../../services/api';
import { ProfileOrders } from '../../pages/ProfileOrders/ProfileOrders'

export function Profile() {



  const dispatch = useDispatch();

  const location = useLocation()

  const profileOrders = location.state && location.state.profileOrders;

  const [nameValue, setNameValue] = useState(null);
  const [mailValue, setmailValue] = useState(null);
  const [passwordValue, setPasswordValue] = useState(null);

  const { name, mail, password } = useSelector(profileSelector);
  const { isChange, isChangeName, isChangeLogin, isChangePassword } = useSelector(profileSelector);

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

  function handleChangeName(e) {
    e.preventDefault();
    setNameValue(e.target.value)
  }

  function handleChangeMail(e) {
    e.preventDefault();
    setmailValue(e.target.value)
  }

  function handleChangePassword(e) {
    e.preventDefault();
    setPasswordValue(e.target.value)
  }

  // const [value, setValue] = React.useState('value')


  function cancel() {
    dispatch(getProfileInformation(token))
    dispatch(stopChange(token))
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
                // ref={nameField}
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
                // ref={loginField}
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
                // ref={passwordField}
                value={passwordValue}
                icon={'EditIcon'}
                placeholder='Пароль'
                size={'default'}
                type='email'
              />

            </div>
            :
            <Input
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
          <Link to='/profile' className={`${styles.link} text text_type_main-medium`}>Профиль</Link>
          <Link
            to={{ pathname: `profile/orders`, state: { profileOrders: location } }}
            className={`${styles.link} text text_type_main-medium`}>История заказов</Link>
          <Link to='/' className={`${styles.link} text text_type_main-medium mb-20`}
            onClick={() => dispatch(postLogOut(refreshToken))}>Выход</Link>
          <p className={`${styles.text} `}>В этом разделе вы можете
            изменить свои персональные данные</p>
        </div>
        <div className={`${styles.ordersConteiner}`}>
          <ProfileOrders />
        </div>
        {/* <Switch location={profileOrders || location}>
          <Route path="/profile" exact={true}>
            <Inputs />
          </Route>
        </Switch>
      </div>
      {profileOrders && (<>
        <Route path="/profile/orders" exact={true}>
          <div> aSFADsgASDG</div>
        </Route>
      </>
      )} */}
      </div>
    </>
  )
}
