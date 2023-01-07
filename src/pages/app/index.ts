import Footer from '../../core/components/footer';
import Header from '../../core/components/header/index';
import SearchBar from '../../core/components/search-bar';
import Page from '../../core/templates/page';
import { data } from '../../data';
import { productsMap } from '../../products-map';
import { Orders, Product, PromoCodesKeys } from '../../types';
import { PageIds } from '../../utils/constants';
import { queryHelper, replaceWith } from '../../utils/functions';
import CartPage from '../cart';
import ErrorPage, { ErrorTypes } from '../error/index';
import MainPage from '../main/index';
import ProductDetailsPage from '../product-details';

const getPageId = (hash: string) => hash.split('?').shift() || PageIds.MainPage;

class App {
  private static instance: App | null = null;
  private static container: HTMLElement;
  private static defaultPageId = 'current-page';
  private static data = { ...data };
  private static orders: Orders = {};
  private static appliedPromoCodes: PromoCodesKeys = [];
  private static history: [string, string] = [window.location.href, window.location.href];

  static pageId: PageIds;
  static page: Page;
  $header: HTMLElement;
  $main: HTMLElement;
  $footer: HTMLElement;
  static $focused: HTMLInputElement | null = null;
  static $modal: HTMLElement | null = null;

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
      App.pageId = PageIds.MainPage;
      page = new MainPage();
    } else if (regExp(PageIds.CartPage).test(pageId)) {
      App.pageId = PageIds.CartPage;
      page = new CartPage();
    } else if (regExp(PageIds.ProductDetails).test(pageId)) {
      App.pageId = PageIds.ProductDetails;
      page = new ProductDetailsPage();
    } else {
      App.pageId = PageIds.ErrorPage;
      page = new ErrorPage(PageIds.ErrorPage, ErrorTypes.Error_404);
    }
    App.page = page;

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
      const query = queryHelper();
      App.history = [App.history.pop() as string, window.location.href];

      if (App.pageId !== getPageId(hash) || [...query.entries()].length === 0) {
        App.renderNewPage(hash);
      } else {
        App.page.query && App.page.query();
      }
    };

    window.addEventListener('hashchange', routeChangeHandler);
    window.addEventListener('load', routeChangeHandler);
  }

  private constructor() {
    const $root = document.getElementById('root');
    const $main = document.createElement('main');
    if (!$root) {
      throw new Error(`Please, please add a div with id "root" to index.html`);
    }
    App.container = $root;
    this.$header = new Header().render();
    this.$footer = new Footer().render();
    $main.className = 'main';
    this.$main = $main;
  }

  static getInstance() {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  run() {
    App.container.append(this.$header, this.$main, this.$footer);
    App.renderNewPage(window.location.hash.slice(1));
    this.enableRouteChange();
  }

  static setModal($modal: HTMLElement | null) {
    App.$modal?.remove();
    App.$modal = $modal;
    $modal && document.body.append($modal);
  }

  static refreshHeader() {
    const instance = App.getInstance();
    const $newHeader = new Header().render();
    instance.$header = replaceWith(instance.$header, $newHeader);
  }

  static getHistory() {
    return App.history;
  }

  static getData() {
    return App.data;
  }

  static getProducts() {
    return App.data.products;
  }

  static setProducts(products: Product[]) {
    App.data.products = products;
  }

  static getOrders() {
    return App.orders;
  }

  static setOrders(orders: Orders) {
    App.orders = orders;
    App.refreshHeader();
  }

  static getAppliedPromoCodes() {
    return App.appliedPromoCodes;
  }

  static setAppliedPromoCodes(codes: PromoCodesKeys) {
    App.appliedPromoCodes = codes;
  }

  static increaseOrder(productId: string): number {
    const orders = App.orders;
    const order = orders[productId];
    const stock = productsMap[productId].stock;
    if (order) {
      if (order.quantity < stock) {
        order.quantity += 1;
      }
      return order.quantity;
    } else {
      orders[productId] = { quantity: stock >= 1 ? 1 : 0 };
      return 1;
    }
    return 0;
  }

  static decreaseOrder(productId: string): number {
    const order = App.orders[productId];
    if (order) {
      if (order.quantity > 0) {
        order.quantity -= 1;
      }
      return order.quantity;
    }
    return 0;
  }

  static dropOrder(productId: string) {
    if (App.orders[productId]) {
      delete App.orders[productId];
    }
  }

  static isProductOrdered(id: Product['id']) {
    return App.orders[id] !== undefined;
  }

  static getOrdersProductsQuantity() {
    return Object.keys(App.orders).length;
  }

  static getOrdersTotalQuantity() {
    return Object.values(App.orders).reduce((total, { quantity }) => total + quantity, 0);
  }

  static getOrdersTotalPrice() {
    return Object.keys(App.orders).reduce(
      (total, id) => total + (productsMap[id].price || 0) * App.orders[id].quantity,
      0
    );
  }
}

export default App;
