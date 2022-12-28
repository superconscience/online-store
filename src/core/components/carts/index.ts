import Component from '../../templates/components';
import CartProductItem from '../product-cart';
import Products from '../products';
import { Product } from '../../../types';
const cartsClassName = 'products';

class Carts extends Component {
  static readonly classes = {
    cartList: 'cart-list',
  };

  constructor() {
    super('div', cartsClassName);
  }

  build() {
    localStorage.setItem('card', JSON.stringify(Products.getOrder()));
    const arrCarts: Product[] = JSON.parse(localStorage.getItem('card') || '{}');
    const $fragment = document.createDocumentFragment();
    const $cartList = document.createElement('div');
    $cartList.className = Carts.classes.cartList;
    if (arrCarts.length > 0) {
      arrCarts.forEach((p) => $cartList.append(new CartProductItem(p).render()));
      $fragment.append($cartList);
    }
    return $fragment;
  }
  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default Carts;
