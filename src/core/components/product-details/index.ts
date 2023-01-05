import App from '../../../pages/app';
import { Product } from '../../../types';
import { replaceWith } from '../../../utils/functions';
import Component from '../../templates/components';

class ProductDetails extends Component {
  private readonly product: Product;
  $orderButton: HTMLElement;

  constructor(product: Product, tagName = 'div', className = 'block-general-details') {
    super(tagName, className);
    this.product = product;
    this.$orderButton = this.buildOrderButton();
  }

  generateDetail() {
    let images = '';
    const blockDetails = document.createDocumentFragment();
    const productDetail = document.createElement('div');
    const productTitle = document.createElement('div');
    const productPhoto = document.createElement('div');
    const slides = document.createElement('div');
    const grandPhoto = document.createElement('div');
    const productInfo = document.createElement('div');
    const productData = document.createElement('div');
    const buyBlock = document.createElement('div');
    const buyBlockWrapper = document.createElement('div');
    const price = document.createElement('div');

    productDetail.className = 'block-deatail';
    productTitle.className = 'product-title';
    productPhoto.className = 'product-photo';
    slides.className = 'slides';
    grandPhoto.className = 'grand-photo';
    productInfo.className = 'product-info';
    productData.className = 'product-data';
    buyBlock.className = 'add-to-cart';
    buyBlockWrapper.className = 'add-to-cart-wrapper';
    price.className = 'detail-price';

    const title = `<h1 class="title-detail">${this.product.title}</h1>`;

    const infoProd = `<div  class="product-detail-item">
      <h3 class="title-desc">Description:</h3>
      <p class="detail-description">${this.product.description}
    </div>
    <div class="product-detail-item">
      <h3 class="title-perc">Discount Percentage:</h3>
      <p class="detail-discount">${this.product.discountPercentage}%</p>
    </div>
    <div class="product-detail-item">
      <h3 class="title-rating">Rating:</h3>
      <p class="detail-rating">${this.product.rating}</p>
    </div>
    <div class="product-detail-item">
      <h3 class="title-stock">Stock:</h3>
      <p class="detail-stock">${this.product.stock}</p>
    </div>
    <div class="product-detail-item">
      <h3 class="title-brand">Brand:</h3>
      <p class="detail-brand">${this.product.brand}</p>
    </div>
    <div class="product-detail-item">
      <h3 class="title-category">Category:</h3>
      <p class="detail-catrgory">${this.product.category}</p>
    </div>`;

    buyBlock.append(buyBlockWrapper);
    buyBlockWrapper.append(price, this.$orderButton, this.buildBuyButton());

    this.product.images.forEach(
      (p, i) => (images += ` <img  alt="Slide" src="${p}" class="btn-img" data-id="${String(i)}"/>`)
    );

    productTitle.innerHTML = title;
    productInfo.innerHTML = infoProd;
    slides.innerHTML = images;

    productPhoto.append(slides);
    productPhoto.append(grandPhoto);
    productData.append(productPhoto);
    productData.append(productInfo);
    productData.append(buyBlock);
    productDetail.append(productTitle);
    productDetail.append(productData);
    blockDetails.append(productDetail);

    return blockDetails;
  }

  buildOrderButton() {
    const $button = document.createElement('button');
    const productId = this.product.id;
    const isOrdered = App.isProductOrdered(productId);
    $button.className = 'btn-order';
    $button.textContent = isOrdered ? 'Drop from cart' : 'Add to cart';

    $button.addEventListener('click', () => {
      if (isOrdered) {
        App.dropOrder(productId.toString());
      } else {
        App.increaseOrder(productId.toString());
      }
      this.refreshOrderButton();
      App.refreshHeader();
    });

    return $button;
  }

  buildBuyButton() {
    const $button = document.createElement('button');
    $button.className = 'btn-buy';
    $button.textContent = 'Buy now';

    $button.addEventListener('click', () => {
      console.log('show buy modal');
    });

    return $button;
  }

  refreshOrderButton() {
    this.$orderButton = replaceWith(this.$orderButton, this.buildOrderButton());
  }

  render() {
    this.container.append(this.generateDetail());
    return this.container;
  }
}

export default ProductDetails;
