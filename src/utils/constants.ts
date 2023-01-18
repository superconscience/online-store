import { PromoCodes } from '../types';

export const QUERY_VALUE_SEPARATOR = '↕';

export enum PageIds {
  MainPage = 'main-page',
  CartPage = 'cart-page',
  ProductDetails = 'product-details',
  ErrorPage = 'error-page',
}

export const promoCodes: PromoCodes = {
  rs: {
    discount: 0.1,
    text: `Rolling Scopes School`,
  },
  epm: {
    discount: 0.1,
    text: `EPAM Systems`,
  },
};

export enum LSKeys {
  Orders = `RS-online-store:orders`,
  Promo = `RS-online-store:promo`,
}

export const SEARCH_INPUT_DELAY = 500;
