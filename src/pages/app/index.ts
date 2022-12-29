import Page from '../../core/templates/page';
import MainPage from '../main/index';
import Header from '../../core/components/header/index';
import ErrorPage, { ErrorTypes } from '../error/index';
import { data } from '../../data';
import { Product } from '../../types';
import { queryHelper } from '../../utils/functions';
import { QUERY_VALUE_SEPARATOR } from '../../utils/constants';
import CartPage from '../cart';
import SearchBar from '../../core/components/search-bar';
import Footer from '../../core/components/footer';

export const enum PageIds {
  MainPage = 'main-page',
  CartPage = 'cart-page',
  ErrorPage = 'error-page',
}

class App {
  private static container: HTMLElement = document.body;
  private static defaultPageId = 'current-page';
  static pageId: PageIds;
  $header: HTMLElement;
  $main: HTMLElement;
  $footer: HTMLElement;
  static $focused: HTMLInputElement | null = null;
  private static data = { ...data };

  static getData() {
    return App.data;
  }

  static getProducts() {
    return App.data.products;
  }

  static setProducts(products: Product[]) {
    App.data.products = products;
  }

  static renderNewPage(pageId: string) {
    const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
    if (currentPageHTML) {
      currentPageHTML.remove();
    }
    let page: Page | null = null;
    if (!pageId) {
      pageId = PageIds.MainPage;
    }
    const regExp = (id: string) => new RegExp(`^${id}.*`);
    if (regExp(PageIds.MainPage).test(pageId)) {
      page = new MainPage();
      App.pageId = PageIds.MainPage;
    } else if (regExp(PageIds.CartPage).test(pageId)) {
      page = new CartPage();
      App.pageId = PageIds.CartPage;
    } else {
      page = new ErrorPage(PageIds.ErrorPage, ErrorTypes.Error_404);
      App.pageId = PageIds.ErrorPage;
    }

    if (page) {
      const $focused = document.querySelector(':focus');
      const pageHTML = page.render();
      const main = App.container.querySelector('main');
      if (!main) {
        return;
      }
      main.innerHTML = '';
      main.append(pageHTML);
      if ($focused instanceof HTMLInputElement && $focused.type === 'search') {
        SearchBar.$input.focus();
      }
    }
  }

  private enableRouteChange() {
    const routeChangeHandler = () => {
      const hash = window.location.hash.slice(1);
      this.query();
      App.renderNewPage(hash);
    };
    window.addEventListener('hashchange', routeChangeHandler);
    window.addEventListener('load', routeChangeHandler);
  }

  constructor() {
    this.$header = new Header('header', 'header').render();
    this.$footer = new Footer().render();
    const main = document.createElement('main');
    main.className = 'main';
    this.$main = main;
  }

  run() {
    App.container.append(this.$header, this.$main, this.$footer);
    App.renderNewPage('main-page');
    this.enableRouteChange();
  }

  query() {
    const query = queryHelper();
    const category = query.get('category');
    const brand = query.get('brand');
    const price = query.get('price');
    const stock = query.get('stock');
    const sort = query.get('sort');
    const search = query.get('search');

    let products = [...data.products];

    if (category !== null) {
      products = products.filter((p) =>
        category.toLowerCase().split(QUERY_VALUE_SEPARATOR).includes(p.category.toLowerCase())
      );
    }

    if (brand !== null) {
      products = products.filter((p) =>
        brand.toLowerCase().split(QUERY_VALUE_SEPARATOR).includes(p.brand.toLowerCase())
      );
    }

    if (price !== null) {
      const [min, max] = price.split(QUERY_VALUE_SEPARATOR).map((x) => Number(x));
      if (max >= min) {
        products = products.filter((p) => p.price >= min && p.price <= max);
      }
    }

    if (stock !== null) {
      const [min, max] = stock.split(QUERY_VALUE_SEPARATOR).map((x) => Number(x));
      if (max >= min) {
        products = products.filter((p) => p.stock >= min && p.stock <= max);
      }
    }

    if (sort !== null) {
      const sortMap: Record<
        'price' | 'rating' | 'discount',
        Extract<keyof Product, 'price' | 'rating' | 'discountPercentage'>
      > = {
        price: 'price',
        rating: 'rating',
        discount: 'discountPercentage',
      } as const;
      type Order = 'ASC' | 'DESC';

      const isSortKey = (value: string): value is keyof typeof sortMap => {
        return Object.keys(sortMap).includes(value);
      };
      const isOrder = (value: string): value is Order => {
        return value === 'ASC' || value === 'DESC';
      };
      const sortHandler = (a: Product, b: Product, key: keyof typeof sortMap, order: Order) => {
        const itemKey = sortMap[key];
        return order === 'ASC'
          ? a[itemKey] - b[itemKey]
          : order === 'DESC'
          ? b[itemKey] - a[itemKey]
          : a[itemKey] - b[itemKey];
      };

      const [key, order] = sort.split('-');
      if (isSortKey(key) && isOrder(order)) {
        products = products.sort((a, b) => sortHandler(a, b, key, order));
      }
    }

    if (search !== null) {
      const regexp = new RegExp(search, 'gi');
      products = products.filter((p) => regexp.test(p.title));
    }

    App.setProducts(products);
  }
}

export default App;
