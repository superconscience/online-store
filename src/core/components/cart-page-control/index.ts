import App from '../../../pages/app';
import { queryHelper } from '../../../utils/functions';
import { QueryKey } from '../../../utils/types';
import Component from '../../templates/components';

type CartQueryParams = Record<Extract<QueryKey, 'page' | 'limit'>, number>;

const cartPageControlClassName = 'cart-page-control';
const elementClassName = (element: string) => `${cartPageControlClassName}__${element}`;

const getPagesCount = (quantity: number, limit: number) => Math.floor(quantity / limit);

class CartPageControl extends Component {
  static readonly classes = {
    cartPageControl: cartPageControlClassName,
    limit: elementClassName('limit'),
    limitInput: elementClassName('limit-input'),
    numbers: elementClassName('numbers'),
    numbersButton: elementClassName('numbers-button'),
    numbersIndicator: elementClassName('numbers-indicator'),
    prevPage: 'prev-page',
    nextPage: 'next-page',
  };
  $limit: HTMLElement;
  $numbers: HTMLElement;

  private static _params: CartQueryParams = { limit: 3, page: 1 };
  private static _limit = 3;
  private static _pages = 0;
  private static _currentPage = 1;

  static get params() {
    return CartPageControl._params;
  }

  static set params(params: CartQueryParams) {
    const { limit: oldLimit, page: oldPage } = CartPageControl.params;
    const { limit, page } = params;
    CartPageControl._params = params;
  }

  static get limit() {
    return CartPageControl._limit;
  }

  static set limit(value: number) {
    CartPageControl._limit = value;
  }

  static get pages() {
    return CartPageControl._pages;
  }

  static set pages(value: number) {
    CartPageControl._pages = value;
  }

  static get currentPage() {
    return CartPageControl._currentPage;
  }

  static set currentPage(value: number) {
    CartPageControl._currentPage = value;
  }

  constructor() {
    super('div', CartPageControl.classes.cartPageControl);
    CartPageControl.pages = getPagesCount(App.getOrdersProductsQuantity(), CartPageControl.limit);
    this.$limit = this.buildLimit();
    this.$numbers = this.buildNumbers();
  }

  static query() {
    const query = queryHelper();
    const limit = query.get('limit');
    const page = query.get('page');

    CartPageControl.params = { ...CartPageControl.params, limit: Number(limit), page: Number(page) };
  }

  build() {
    const $fragment = document.createDocumentFragment();

    $fragment.append(this.$limit, this.$numbers);

    return $fragment;
  }

  buildLimit() {
    const limit = CartPageControl.limit.toString();
    const $root = document.createElement('div');
    const $input = document.createElement('input');

    $root.className = CartPageControl.classes.limit;
    $root.append('Limit: ', $input);

    $input.className = CartPageControl.classes.limitInput;
    $input.type = 'number';
    $input.min = '1';
    $input.max = limit;
    $input.value = limit;

    return $root;
  }

  buildNumbers() {
    const $root = document.createElement('div');
    const $buttonNext = document.createElement('button');
    const $buttonPrev = document.createElement('button');
    const $indicator = document.createElement('span');

    $root.className = CartPageControl.classes.numbers;
    $root.append(' Page: ', $buttonPrev, $indicator, $buttonNext);

    $indicator.className = CartPageControl.classes.numbersIndicator;
    $indicator.textContent = CartPageControl.currentPage.toString();

    $buttonPrev.className = CartPageControl.classes.numbersButton;
    $buttonPrev.classList.add(CartPageControl.classes.prevPage);
    $buttonPrev.textContent = ' < ';

    $buttonNext.className = CartPageControl.classes.numbersButton;
    $buttonNext.classList.add(CartPageControl.classes.nextPage);
    $buttonNext.textContent = ' > ';

    return $root;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default CartPageControl;
