import styles from "./BurgerConstructor.module.css";
import { CurrencyIcon, ConstructorElement, Button } from "@ya.praktikum/react-developer-burger-ui-components";
import { ConstructorIngredient } from '../ConsructorIngredient/ConsructorIngredient'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { fetchOrderDetails, getProfileInformation } from '../../services/api';
import { useDrop } from 'react-dnd';
import { useMemo, useEffect } from "react";
import { ingredientsSelector, addIngredientInConstructorItem, deleteIngredientFromConstructorItem, closeOrderСomponentsModal } from '../../services/slice/ingredients';
import Modal from '../Modal/Modal';
import { OrderDetails } from '../OrderDetails/OrderDetails';
import { Link } from 'react-router-dom';
import { profileSelector } from '../../services/slice/profile';
import { Iingredients } from '../../utils/Interface'


function BurgerConstructor() {

  useEffect(() => {
    dispatch(getProfileInformation())
  }, [])

  const { isUserLoaded } = useAppSelector(profileSelector);

  const { constructor, orderModalOpen, orderNumber, orderName } = useAppSelector(ingredientsSelector);
  const dispatch = useAppDispatch();

  const [{ canDrop, isOver }, dropTarget] = useDrop({
    accept: 'ingredient',
    drop(item: Iingredients) {
      if (item.type === 'bun') {
        dispatch(deleteIngredientFromConstructorItem(item))
        dispatch(addIngredientInConstructorItem(item))
      } else {
        dispatch(addIngredientInConstructorItem(item))
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isActiveForDnD = canDrop && isOver;
  //выдает в одном из условий ошибку, странный момент, не знаю как вылечить
  // возможно потому-что булки сразу может и не быть, но не знаю как это вылечить
  const constructorItems: Array<Iingredients> | any = constructor.burger
  const bun = constructorItems.find((item: { type: string; }) => item.type === 'bun');
  const mains = constructorItems.filter((item: { type: string; }) => item.type !== 'bun');

  let total = useMemo(() => {
    let sum
    if (constructorItems.length > 0 && constructorItems) {
      sum = constructorItems.filter((ingredient: { type: string; }) => ingredient.type !== 'bun').reduce((prev: any, ingredient: { price: Number; }) => prev + ingredient.price, 0) + (constructorItems.some((ingredient: { type: string; }) => ingredient.type === 'bun') ? (constructorItems.find((ingredient: { type: string; }) => ingredient.type === 'bun').price * 2) : 0)
      return sum
    } else {
      sum = 0
      return sum
    }
  }, [constructorItems])


  return (
    <section ref={dropTarget} className={`mt-25`}>
      <div className={`${styles.box}`}>
        {constructor.burger.length === 0 && <p className={`${styles.text} mb-5 mt-10 text text_type_main-large`}>
          Добавьте булки и ингредиенты сюда, чтобы сделать заказ!
        </p>}
        {bun && <div className={`pl-8 mb-4`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={bun.name + " (верх)"}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>}

        {mains.length > 0 && <div className={`${styles.ingredient}`}>
          <div className={``}>
            {mains.map((item: Iingredients, index: number) => {
              return (
                <ConstructorIngredient
                  index={index}
                  item={item}
                  key={item.uniqueID}
                />
              )
            }
            )}
          </div>
        </div>}

        {bun && <div className={`pl-8`}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={bun.name + " (низ)"}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>}
      </div>
      <div className={`${styles.buttonConteiner} mt-10`}>

        {bun ? (<>
          <span className={`text text_type_digits-medium mr-10`}>
            {total} <CurrencyIcon type="primary" />
          </span>
          {!isUserLoaded ?
            <Link to='login'>
              <Button type="primary" size="large"
              >
                Оформить заказ
              </Button>
            </Link>
            : <Button type="primary" size="large"
              onClick={() => dispatch(fetchOrderDetails(constructorItems))}
            >
              Оформить заказ
            </Button>}
        </>) : (<></>)}
      </div>
      {orderModalOpen && <>
        <Modal onClose={() => dispatch(closeOrderСomponentsModal())}>
          <OrderDetails orderNumber={orderNumber} orderName={orderName} />
        </Modal>
      </>}
    </section>
  );
}

export default BurgerConstructor;