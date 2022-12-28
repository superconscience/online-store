import { Product } from '../../../types';
import Component from '../../templates/components';

class CartProductItem extends Component {
  private readonly product: Product;
  constructor(product: Product, tagName = 'div', className = 'block-general-card') {
    super(tagName, className);
    this.product = product;
  }
  generateCartProd() {
    let template = '';
    let itemInfo = '';
    let itemDetail = '';
    const blockCart = document.createDocumentFragment();
    const blockCardInfo = document.createElement('div') as HTMLElement;
    const itemI = document.createElement('div') as HTMLElement;
    const blockCaritem = document.createElement('div') as HTMLElement;
    const blockButtons = document.createElement('div') as HTMLElement;
    const buttonInc = document.createElement('button') as HTMLElement;
    const buttonDec = document.createElement('button') as HTMLElement;
    const numberControl = document.createElement('div') as HTMLElement;
    const stockControl = document.createElement('div') as HTMLElement;
    const amountControl = document.createElement('div') as HTMLElement;
    const scoreControl = document.createElement('div') as HTMLElement;
    stockControl.className = 'stock-control';
    numberControl.className = 'number-control';
    amountControl.className = 'amount-control';
    blockButtons.className = 'block-buttons';
    blockCardInfo.className = 'block-cart-info';
    blockCaritem.className = 'cart-item';
    buttonInc.className = 'btn-cart-inc';
    buttonDec.className = 'btn-cart-dec';
    scoreControl.className = 'score-control';
    itemI.className = 'item-i';
    amountControl.innerHTML = this.product.price.toString();
    stockControl.innerHTML = this.product.stock.toString();
    buttonInc.innerHTML = '+';
    buttonDec.innerHTML = '-';
    this.product.images[0] && (itemInfo += `<img src="${this.product.images[0]}" alt="cart-image"class="image-cart">`);
    this.product.brand &&
      (itemDetail += `<div class="title-card-block"><h3 class="title-cart-block">${this.product.brand}</h3></div>`);
    this.product.description && (itemDetail += `<div class="description-cart">${this.product.description}</div>`);
    this.product.rating &&
      this.product.discountPercentage &&
      (itemDetail += `<div class="block-other">
      <div class="other-rating">${this.product.rating}</div><div class="other-stock">${this.product.discountPercentage}</div></div>`);
    blockButtons.append(buttonInc);
    blockButtons.append(scoreControl);
    blockButtons.append(buttonDec);
    itemInfo += `<div class="item-detail-p">${itemDetail}</div>`;
    template += itemInfo;
    numberControl.append(stockControl);
    numberControl.append(blockButtons);
    numberControl.append(amountControl);
    blockCardInfo.innerHTML = template;
    blockCart.append(itemI);
    blockCart.append(blockCardInfo);
    blockCart.append(numberControl);
    blockCaritem.append(blockCart);
    return blockCaritem;
  }
  render() {
    this.container.append(this.generateCartProd());
    return this.container;
  }
}

export default CartProductItem;
