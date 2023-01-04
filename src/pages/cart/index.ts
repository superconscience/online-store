import CartItem from '../../core/components/cart-item';
import CartPageControl from '../../core/components/cart-page-control';
import CartSummary from '../../core/components/cart-summary';
import Page from '../../core/templates/page';
import { replaceWith } from '../../utils/functions';
import App from '../app';

class CartPage extends Page {
  $cart: HTMLElement | null = null;
  $cartPageControl: HTMLElement;
  $list: HTMLElement;
  $summary: HTMLElement;
  $cartItems: Record<string, HTMLElement> = {};

  summary: CartSummary;
  pageControl: CartPageControl;

  constructor() {
    super();
    const summary = new CartSummary();
    const pageControl = new CartPageControl();
    this.pageControl = pageControl;
    this.summary = summary;
    this.$summary = summary.render();
    this.$cartPageControl = pageControl.render();
    this.$list = this.buildList();
  }

  buildCart() {
    const $cart = document.createElement('div');
    $cart.className = 'cart';
    $cart.append(this.buildWrapper());
    return $cart;
  }

  buildWrapper() {
    const orders = App.getOrders();
    if (Object.keys(orders).length === 0) {
      const $empty = document.createElement('p');
      $empty.textContent = 'Cart is empty';
      return $empty;
    }
    const $wrapper = document.createElement('div');
    const $listWrapper = document.createElement('div');
    const $header = document.createElement('div');
    const $title = document.createElement('h2');
    const $list = this.$list;

    $wrapper.className = 'cart-wrapper';
    $wrapper.append($listWrapper, this.$summary);

    $listWrapper.className = 'cart-list-wrapper';
    $listWrapper.append($header, $list);

    $header.className = 'cart-list-header';
    $header.append($title, this.$cartPageControl);

    $title.className = 'cart-list-header-title';
    $title.textContent = 'Products In Cart';

    return $wrapper;
  }

  buildList() {
    const $list = document.createElement('ul');
    const orders = App.getOrders();
    const { limit, page } = this.pageControl.getParams();
    const [numberLimit, numberPage] = [Number(limit), Number(page)];
    const from = numberLimit * (numberPage - 1);
    const to = from + numberLimit;
    this.$cartItems = {};

    $list.className = 'cart-list';

    Object.keys(orders).forEach((id, i) => {
      const $item = new CartItem(id, (i + 1).toString()).render();
      this.$cartItems[id] = $item;
    });

    Object.values(this.$cartItems)
      .slice(from, to)
      .forEach(($elem) => $list.append($elem));

    $list.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      const isIncrease = event.target.classList.contains(CartItem.classes.quantityControlIncrease);
      const isDecrease = event.target.classList.contains(CartItem.classes.quantityControlDecrease);

      if (!isIncrease && !isDecrease) {
        return;
      }

      const { id, number } = event.target.dataset;
      if (id === undefined || number === undefined) {
        return;
      }

      let quantity = 0;

      if (isIncrease) {
        quantity = App.increaseOrder(id);
      } else {
        quantity = App.decreaseOrder(id);
      }

      if (quantity > 0) {
        const $newCartItem = new CartItem(id, number).render();
        this.$cartItems[id] = replaceWith(this.$cartItems[id], $newCartItem);

        this.summary.refreshOnOrder();
      } else {
        App.dropOrder(id);

        if (!this.$list) {
          return;
        }

        if (App.getOrdersTotalQuantity() > 0) {
          const $newList = this.buildList();
          this.$list = replaceWith(this.$list, $newList);

          this.summary.refreshOnOrder();
        } else {
          if (!this.$cart) {
            return;
          }
          const $newCart = this.buildCart();
          this.$cart = replaceWith(this.$cart, $newCart);
        }
        this.query();
      }

      App.refreshHeader();
    });
    return $list;
  }

  refreshList() {
    this.$list = replaceWith(this.$list, this.buildList());
  }

  render() {
    const $cart = this.buildCart();
    this.$cart = $cart;
    this.container.append($cart);
    return this.container;
  }

  query() {
    this.pageControl.useQuery();
    this.refreshList();
  }
}

export default CartPage;
