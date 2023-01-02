import Component from '../../templates/components';
import { PageIds } from '../../../pages/app/index';
import Products from '../products';

class Header extends Component {
  constructor(tagName: string, className: string) {
    super(tagName, className);
  }

  build() {
    const $fragment = document.createDocumentFragment();
    const $brand = document.createElement('a');
    const $totalPrice = document.createElement('div');
    const $cart = document.createElement('a');

    $brand.className = 'brand';
    $brand.href = `/#${PageIds.MainPage}`;
    $brand.innerHTML = `<div class="logo">🛍</div><h2 class="brand-name">Online Store</h2>`;

    $totalPrice.className = 'total-price';
    $totalPrice.innerHTML = `<span>Cart total: 0</span>`;

    $cart.className = 'header-cart';
    $cart.href = `/#${PageIds.CartPage}`;
    $cart.innerHTML = `<div class="header-cart__total"><div class="header-cart__total-content">0</div></div>`;

    $fragment.append($brand, $totalPrice, $cart);

    return $fragment;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default Header;
