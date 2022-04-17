import styles from './OrderPage.module.css';
import { ingredientsSelector, } from '../../services/slice/ingredients';
import { orderSelector, } from '../../services/slice/order';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { IngredientDetails } from '../IngredientDetails/IngredientDetails';
import { OrederDetail } from '../OrederDetail/OrederDetail';
import { current } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Loading } from '../Loading/loading';

export const OrderPage = () => {
  const { id } = useParams();
  const { orders, orders1, dataSuccess } = useSelector(orderSelector);

  const currentOrder = useMemo(
    () => orders1.find((el) => el.number == id),
    [orders1, id]
  );

  return (
    <>{currentOrder &&
      <div className={styles.main}>
        <OrederDetail item={orders1} />
      </div>}
    </>
  )

}

