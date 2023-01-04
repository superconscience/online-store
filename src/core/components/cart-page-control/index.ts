import App from '../../../pages/app';
import { datasetHelper, queryHelper, replaceWith } from '../../../utils/functions';
import { QueryKey } from '../../../utils/types';
import Component from '../../templates/components';

type CartQueryParams = Record<Extract<QueryKey, 'page' | 'limit'>, string>;
type PageButtonDataset = { page: string };

const cartPageControlClassName = 'cart-page-control';
const elementClassName = (element: string) => `${cartPageControlClassName}__${element}`;

const getPagesCount = (limit: number, itemsCount?: number) => {
  return Math.ceil((itemsCount === undefined ? App.getOrdersProductsQuantity() : itemsCount) / limit);
};

const defaultParams: CartQueryParams = { limit: '3', page: '1' };

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
  $limitInput: HTMLInputElement | null = null;

  private _params: CartQueryParams = {
    ...defaultParams,
    limit: Math.min(App.getOrdersProductsQuantity(), Number(defaultParams.limit)).toString(),
  };
  private _pages = 0;

  private get params() {
    return this._params;
  }

  private set params(params: CartQueryParams) {
    this._params = params;
    this.refreshNumbers();
    this.refreshLimitInput();
  }

  getParams() {
    return this.params;
  }

  get pages() {
    return this._pages;
  }

  set pages(value: number) {
    this._pages = value;
  }

  constructor() {
    super('div', CartPageControl.classes.cartPageControl);

    this.$limit = this.buildLimit();
    this.$numbers = this.buildNumbers();
  }

  build() {
    const $fragment = document.createDocumentFragment();

    $fragment.append(this.$limit, this.$numbers);

    return $fragment;
  }

  buildLimit() {
    const $root = document.createElement('div');
    const $input = this.buildLimitInput();
    this.$limitInput = this.$limitInput ? replaceWith(this.$limitInput, $input) : $input;

    $root.className = CartPageControl.classes.limit;
    $root.append('Limit: ', $input);

    return $root;
  }

  buildLimitInput() {
    const limit = this.params.limit.toString();
    const $input = document.createElement('input');
    $input.className = CartPageControl.classes.limitInput;
    $input.type = 'number';
    $input.min = '1';
    $input.max = App.getOrdersProductsQuantity().toString();
    $input.value = limit;

    $input.addEventListener('input', (event) => {
      if (!(event.target instanceof HTMLInputElement)) {
        return;
      }
      const query = queryHelper();

      if (event.target.value) {
        const limit = event.target.value;
        let page = query.get('page') || defaultParams.page;
        page = Math.min(Number(page), getPagesCount(Number(limit))).toString() || defaultParams.page;
        query.set('limit', event.target.value);
        query.set('page', page);
        query.apply();
      }
    });

    return $input;
  }

  buildNumbers() {
    const dataset = datasetHelper();
    const $root = document.createElement('div');
    const $buttonNext = document.createElement('button');
    const $buttonPrev = document.createElement('button');
    const $indicator = document.createElement('span');

    const { page, limit } = this.params;
    const pageNumber = Number(page);
    const prevPageNumber = pageNumber - 1;
    const nextPageNumber = pageNumber + 1;

    $root.className = CartPageControl.classes.numbers;
    $root.append(' Page: ', $buttonPrev, $indicator, $buttonNext);

    $indicator.className = CartPageControl.classes.numbersIndicator;
    $indicator.textContent = page;

    $buttonPrev.className = CartPageControl.classes.numbersButton;
    $buttonPrev.classList.add(CartPageControl.classes.prevPage);
    $buttonPrev.textContent = ' < ';
    $buttonPrev.disabled = prevPageNumber <= 0;
    dataset.set<PageButtonDataset>($buttonPrev, { page: prevPageNumber.toString() });

    $buttonNext.className = CartPageControl.classes.numbersButton;
    $buttonNext.classList.add(CartPageControl.classes.nextPage);
    $buttonNext.textContent = ' > ';
    $buttonNext.disabled = nextPageNumber > getPagesCount(Number(limit));
    dataset.set<PageButtonDataset>($buttonNext, { page: nextPageNumber.toString() });

    $root.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }

      const dataset = datasetHelper();
      const query = queryHelper();
      const page = dataset.get<PageButtonDataset>(event.target, 'page');

      if (page !== undefined) {
        query.set('page', page);
        query.apply();
      }
    });

    return $root;
  }

  refreshLimit() {
    this.$limit = replaceWith(this.$limit, this.buildLimit());
  }

  refreshLimitInput() {
    if (this.$limitInput) {
      this.$limitInput.max = App.getOrdersProductsQuantity().toString();
      this.$limitInput.value = this.params.limit;
    }
  }

  refreshNumbers() {
    this.$numbers = replaceWith(this.$numbers, this.buildNumbers());
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }

  useQuery() {
    const query = queryHelper();
    const limit = query.get('limit') || defaultParams.limit;
    const page = query.get('page') || defaultParams.page;
    const [limitNumber, itemsCount] = [Number(limit), App.getOrdersProductsQuantity()];
    const [pageNumber, maxPageNumber] = [Number(page), getPagesCount(Number(limit))];
    const isPageWarning = pageNumber > maxPageNumber;
    const isLimitWarning = limitNumber > itemsCount;

    if (isPageWarning || isLimitWarning) {
      if (isPageWarning) {
        query.set('page', maxPageNumber.toString());
      }
      if (isLimitWarning) {
        query.set('limit', itemsCount.toString());
      }
      query.apply();
      return;
    }
    this.params = { limit, page };
  }
}

export default CartPageControl;
