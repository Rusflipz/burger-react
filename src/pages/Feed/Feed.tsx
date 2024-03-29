import styles from './Feed.module.css';
import { useAppSelector, useAppDispatch } from '../../hooks'
import { useLocation, Link } from 'react-router-dom';
import { webSoketSelector } from '../../services/slice/webSoket';
import { ingredientsSelector } from '../../services/slice/ingredients';
import {
  CurrencyIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { ImageUrl } from '../../images/imagesForOrders/images';
import { useEffect } from 'react';
import { Loading } from '../Loading/loading';
import { Error } from '../Error/error';
import { Iorder } from '../../utils/Interface';
import { wsOpen, wsClose } from '../../services/slice/webSoket';
import { wsUrl } from '../../utils/constants'

export function FeedPage() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(wsOpen({ url: `${wsUrl}/all` }))
    return () => {
      dispatch(wsClose())
    }
  },
    []
  );

  const location = useLocation()

  const { ingredients } = useAppSelector(ingredientsSelector);

  const { orders, dataSuccess, loadingOrder, errorOrder,total, totalToday } = useAppSelector(webSoketSelector);

  const Orders = (order: { item: Iorder }) => {
    let orderDate: any = new Date(order.item.createdAt);
    let orderDateHours = orderDate.getHours()
    let orderDateMinutes = orderDate.getMinutes()
    let now: any = new Date();
    let diff = now - orderDate;
    let result = Math.round(diff / (1000 * 60 * 60 * 24) % 30);
    let day;

    if (result == 0) {
      day = "Сегодня"
    } else if (result == 1) {
      day = "Вчера"
    }
    else if (result >= 2 && result < 5) {
      day = `${result} дня назад`
    }
    else if (result >= 5) {
      day = `${result} дней назад`
    }

    let massage = `${day}, ${orderDateHours}:${orderDateMinutes} i-GMT+3`

    let totalCost = 0;

    let ingredientIdArray: Array<string> = []

    let ingredient = []
    order.item.ingredients.forEach((ingredient: Array<string> | null) => {
      if (ingredient !== null) {
        let ing = ingredients.find((item: { _id: string | string[] ; }) => item._id == ingredient);
        let i = 0;
        if (ing) {
          ingredientIdArray.unshift(ing._id);
          totalCost = totalCost + ing.price;
        }
      }
    })

    let resultReduce = ingredientIdArray.reduce(function (acc: {
      hash: any;
      map: any;
      result: any;
    }, cur) {
      if (!acc.hash[cur]) {
        acc.hash[cur] = { [cur]: 1 };
        acc.map.set(acc.hash[cur], 1);
        acc.result.push(acc.hash[cur]);
      } else {
        acc.hash[cur][cur] += 1;
        acc.map.set(acc.hash[cur], acc.hash[cur][cur]);
      }
      return acc;
    }, {
      hash: {},
      map: new Map(),
      result: []
    });

    let res = resultReduce.result.sort(function (a: Array<string>, b: Array<string>) {
      return resultReduce.map.get(b) - resultReduce.map.get(a);
    });

    ingredient = res.reverse()

    let moreActive = false;
    let more;


    if (ingredient.length > 5) {
      let obj = { '0': 0 }
      more = ingredient.length - 5
      moreActive = true;
      ingredient.splice(4, ingredient.length - 5)
      ingredient.push(obj)
    } else {
    }

    function Image(array: { item: {}; }) {
      let id = Object.keys(array.item)[0]
      let img = ImageUrl.find(item => item.id == id)
      if (img !== undefined) {
        return <img className={`${styles.image}`} src={img.url}></img>
      } else return <></>
    }

    return (
      <div className={`${styles.orderBackgraund} pt-6 pb-6 pr-6 pl-6 mb-4`}>
        <Link
          to={{ pathname: `/feed/${order.item.number}`, state: { background2: location } }}
          className={`${styles.orderConteiner}`}>
          <div className={`${styles.orderNumber} mb-6`}>
            <p className={`${styles.number} text text_type_digits-default`}>{`#${order.item.number}`}</p>
            <p className={`${styles.date} text text_type_main-small`}>{massage}</p>
          </div>
          <p className={`${styles.mainText} text text_type_main-medium mb-6`}>{order.item.name}</p>
          <div className={`${styles.orderInfoConteiner}`}>
            <div className={`${styles.imageConteiner}`}>{dataSuccess && res.map((imageId: {}) => <Image item={imageId} key={Object.keys(imageId)[0]} />)}{moreActive && <p className={`${styles.more} text text_type_digits-default`}>{`+${more}`}</p>}</div>
            <div className={`${styles.priceConteiner}`}><p className={`${styles.price} text text_type_digits-default`}>{totalCost}</p><CurrencyIcon type='primary' /></div>
          </div>
        </Link>
      </div>)
  }
  let a;

  if (dataSuccess && orders) {
    a = orders.slice(0, 15)
  }

  function OrdersNumberDone(order: { item: Iorder }) {
    if (order.item.status == 'done') {
      return <p className={`${styles.ordersDoneNumber} text text_type_digits-default`}>{order.item.number}</p>
    } else {
      return <></>
    }
  }

  function OrdersNumberProcess(order: { item: Iorder }) {
    if (order.item.status !== 'done') {
      return <p className={`${styles.ordersProcessNumber} text text_type_digits-default`}>{order.item.number}</p>
    } else {
      return <></>
    }
  }

  if (loadingOrder) return <Loading />
  if (errorOrder) return <Error />

if(orders && a){
  return (
    <>
      <p className={`${styles.title} text text_type_main-large`}>Лента заказов</p>
      <div className={`${styles.mainConteiner}`}>
        <div className={`${styles.feedLent} mr-15`}>
          {dataSuccess && orders.map((order: Iorder) =>
            <Orders item={order} key={order._id} />)}
        </div>
        <div className={`${styles.infoLent}`}>
          <div className={`${styles.ordersInfo} mb-15`}>
            <div className={`${styles.ordersDone}`}>
              <p className={`text text_type_main-medium mb-6`}>Готовы:</p>
              <div className={`${styles.ordersDoneNumbers}`}>
                {dataSuccess && a.map((order) =>
                  <OrdersNumberDone item={order} key={order._id} />)}
              </div>
            </div>
            <div className={`${styles.ordersProcess}`}>
              <p className={`text text_type_main-medium mb-6`}>В работе:</p>
              <div className={`${styles.ordersDoneNumbers}`}>
                {dataSuccess && a.map((order) =>
                  <OrdersNumberProcess item={order} key={order._id} />)}
              </div>
            </div>
          </div>
          <div className={`${styles.allOrdersDone} mb-15`}>
            <p className={`${styles.ordersDoneInfo} text text_type_main-medium`}>Выполнено за все время:</p>
            {dataSuccess ? <p className={`${styles.ordersDoneValue} text text_type_digits-large`}>{total}</p> : <p className={``}>{ }</p>}
          </div>
          <div className={`${styles.todayOrdersDone}`}>
            <p className={`${styles.ordersDoneInfo} text text_type_main-medium`}>Выполнено за сегодня:</p>
            {dataSuccess ? <p className={`${styles.ordersDoneValue} text text_type_digits-large`}>{totalToday}</p> : <p className={``}>{ }</p>}
          </div>
        </div>
      </div>
    </>
  );} else return <></>
} 