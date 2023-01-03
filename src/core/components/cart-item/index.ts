import App from '../../../pages/app';
import { productsMap } from '../../../products-map';
import { Order, Product } from '../../../types';
import { formatPrice } from '../../../utils/functions';
import Component from '../../templates/components';

const cartItemClassName = 'cart-item';
const quantityControl = 'quantity-control';
const elementClassName = (element: string) => `${cartItemClassName}__${element}`;

class CartItem extends Component {
  private id: string;
  private product: Product;
  private order: Order;
  private number: string;
  static readonly classes = {
    cartItem: cartItemClassName,
    wrapper: elementClassName('wrapper'),
    number: elementClassName('number'),
    info: elementClassName('info'),
    control: elementClassName('control'),
    image: elementClassName('image'),
    details: elementClassName('details'),
    titleWrapper: elementClassName('title-wrapper'),
    title: elementClassName('title'),
    description: elementClassName('description'),
    other: elementClassName('other'),
    otherItem: elementClassName('other-item'),
    stockControl: elementClassName('stock-control'),
    quantityControl: elementClassName(quantityControl),
    quantityControlIncrease: elementClassName(`${quantityControl}-increase`),
    quantityControlDecrease: elementClassName(`${quantityControl}-decrease`),
    quantityControlButton: elementClassName('quantity-control-button'),
    amountControl: elementClassName('amount-control'),
  };

  constructor(productId: string, number: string) {
    super('li', CartItem.classes.cartItem);

    this.product = productsMap[productId];
    this.order = App.getOrders()[productId];
    this.number = number;
    this.id = productId;
  }

  build() {
    const product = this.product;
    const order = this.order;
    const totalPrice = product.price * order.quantity;
    const $wrapper = document.createElement('div');
    const $number = document.createElement('div');
    const $info = document.createElement('div');
    const $image = document.createElement('img');
    const $details = document.createElement('div');
    const $titleWrapper = document.createElement('div');
    const $title = document.createElement('h3');
    const $description = document.createElement('div');
    const $other = document.createElement('div');
    const $rating = document.createElement('div');
    const $discount = document.createElement('div');
    const $control = document.createElement('div');
    const $stockControl = document.createElement('p');
    const $quantityControl = document.createElement('div');
    const $amountControl = document.createElement('div');

    $wrapper.className = CartItem.classes.wrapper;
    $wrapper.append($number, $info, $control);

    $number.className = CartItem.classes.number;
    $number.textContent = this.number;

    $info.className = CartItem.classes.info;
    $info.append($image, $details);

    $control.className = CartItem.classes.control;
    $control.append($stockControl, $quantityControl, $amountControl);

    $image.className = CartItem.classes.image;
    $image.src = this.product.thumbnail;
    $image.alt = product.title;

    $details.className = CartItem.classes.details;
    $details.append($titleWrapper, $description, $other);

    $titleWrapper.className = CartItem.classes.titleWrapper;
    $titleWrapper.append($title);

    $title.className = CartItem.classes.title;
    $title.textContent = product.title;

    $description.className = CartItem.classes.description;
    $description.textContent = product.description;

    $other.className = CartItem.classes.other;
    $other.append($rating, $discount);

    [$rating, $discount].forEach((el) => (el.className = CartItem.classes.otherItem));

    $rating.textContent = `Rating: ${product.rating.toString()}`;
    $discount.textContent = `Discount: ${product.discountPercentage.toString()}`;

    $stockControl.className = CartItem.classes.stockControl;
    $stockControl.textContent = `Stock: ${product.stock}`;

    $quantityControl.className = CartItem.classes.quantityControl;

    ['+', '-'].forEach((label) => {
      const $button = document.createElement('button');
      $button.className = CartItem.classes.quantityControlButton;
      $button.textContent = label;
      $button.dataset.id = this.id;
      $button.dataset.number = this.number;
      $quantityControl.append($button);
      if (label === '-') {
        $button.classList.add(CartItem.classes.quantityControlDecrease);
        $button.before(order.quantity.toString());
      } else {
        $button.classList.add(CartItem.classes.quantityControlIncrease);
      }
    });

    $amountControl.className = CartItem.classes.amountControl;
    $amountControl.textContent = formatPrice(totalPrice);

    return $wrapper;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default CartItem;
