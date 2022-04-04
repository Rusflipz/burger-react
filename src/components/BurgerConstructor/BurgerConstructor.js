import styles from "./BurgerConstructor.module.css";
import { CurrencyIcon, ConstructorElement, Button } from "@ya.praktikum/react-developer-burger-ui-components";
import { ConstructorIngredient } from '../ConsructorIngredient/ConsructorIngredient'
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderDetails } from '../../services/api';
import { useDrop } from 'react-dnd';
import { useMemo } from "react";
import { ingredientsSelector, addIngredientInConstructorItem, deleteIngredientFromConstructorItem, closeOrderСomponentsModal } from '../../services/slice/ingredients';
import Modal from '../Modal/Modal';
import { OrderDetails } from '../OrderDetails/OrderDetails';


function BurgerConstructor() {

  const { constructor, orderModalOpen, orderNumber, orderName } = useSelector(ingredientsSelector);
  const dispatch = useDispatch();

  const [{ canDrop, isOver }, dropTarget] = useDrop({
    accept: 'ingredient',
    drop(item) {
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
  const constructorItems = constructor.burger
  const bun = constructorItems.find(item => item.type === 'bun');
  const mains = constructorItems.filter(item => item.type !== 'bun');

  let total = useMemo(() => {
    let sum
    if (constructorItems.length > 0) {
      sum = constructorItems.filter(ingredient => ingredient.type !== 'bun').reduce((prev, ingredient) => prev + ingredient.price, 0) + (constructorItems.some(ingredient => ingredient.type === 'bun') ? (constructorItems.find(ingredient => ingredient.type === 'bun').price * 2) : 0)
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
            {mains.map((item, index) => {
              return (
                <ConstructorIngredient
                  id={item._id}
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
          <Button type="primary" size="large"
            onClick={() => dispatch(fetchOrderDetails(constructorItems))}
          >
            Оформить заказ
          </Button>
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