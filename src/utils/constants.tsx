export const defaultValues = {
  _id: '',
  name: '',
  type: '',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0,
}

export const url = 'https://norma.nomoreparties.space/api/';

export const wsUrl = 'wss://norma.nomoreparties.space/orders';

export const checkResponse = (res: Response) => {
  if (res.ok) {
    return res.json();
  } return Promise.reject(`Ошибка: ${res.status}`);
};