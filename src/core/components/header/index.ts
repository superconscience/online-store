import Component from '../../templates/components';
import App from '../../../pages/app/index';
import { formatPrice } from '../../../utils/functions';
import { PageIds } from '../../../utils/constants';

class Header extends Component {
  constructor() {
    super('header', 'header');
  }

  build(): DocumentFragment {
    const $fragment = document.createDocumentFragment();
    const $brand = document.createElement('a');
    const $totalPrice = document.createElement('div');
    const $cart = document.createElement('a');

    $brand.className = 'brand';
    $brand.href = `/#${PageIds.MainPage}`;
    $brand.innerHTML = `<div class="logo">🛍</div><h2 class="brand-name">Online Store</h2>`;

    $totalPrice.className = 'total-price';
    $totalPrice.innerHTML = `<span>Cart total:</span> ${formatPrice(App.getOrdersTotalPrice())}`;

    $cart.href = `/#${PageIds.CartPage}`;
    $cart.className = 'header-cart';
    $cart.innerHTML = `<div class="header-cart__total"><div class="header-cart__total-content">${App.getOrdersTotalQuantity()}</div></div>`;

    $fragment.append($brand, $totalPrice, $cart);

    return $fragment;
  }

  render(): HTMLElement {
    this.container.append(this.build());
    return this.container;
  }
}

export default Header;
