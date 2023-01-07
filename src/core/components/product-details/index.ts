import App from '../../../pages/app';
import { Product } from '../../../types';
import { datasetHelper, replaceWith } from '../../../utils/functions';
import Component from '../../templates/components';
import { formatPrice } from '../../../utils/functions';
import ModalItem from '../modal';
import { PageIds } from '../../../utils/constants';

type ImageDataset = { index: string };

class ProductDetails extends Component {
  private readonly product: Product;
  $orderButton: HTMLElement;

  constructor(product: Product, tagName = 'div', className = 'block-general-details') {
    super(tagName, className);
    this.product = product;
    this.$orderButton = this.buildOrderButton();
  }

  generateLinkNavigation() {
    const linkBlock = document.createDocumentFragment();
    const linkNavigation = document.createElement('div');
    linkNavigation.className = 'link-navigation';
    linkNavigation.innerHTML = `<a href="/#${PageIds.MainPage}" class="link">STORE</a> >> 
    <a class="link">${this.product.category}</a> >> 
    <a class="link">${this.product.brand}</a> >> 
    <a class="link">${this.product.title}</a>`;
    linkBlock.append(linkNavigation);
    return linkBlock;
  }

  generateDetail() {
    const dataset = datasetHelper();
    // let images = '';
    const $blockDetails = document.createDocumentFragment();
    const $productDetail = document.createElement('div');
    const $productTitle = document.createElement('div');
    const $productPhoto = document.createElement('div');
    const $slides = document.createElement('div');
    const $grandPhoto = document.createElement('div');
    const $productInfo = document.createElement('div');
    const $productData = document.createElement('div');
    const $buyBlock = document.createElement('div');
    const $buyBlockWrapper = document.createElement('div');
    const $price = document.createElement('div');
    const $grandPhotoImg = this.buildGrandImage(this.product.images[0]);
    $productDetail.className = 'block-deatail';
    $productTitle.className = 'product-title';
    $productPhoto.className = 'product-photo';
    $slides.className = 'slides';
    $grandPhoto.className = 'grand-photo';
    $productInfo.className = 'product-info';
    $productData.className = 'product-data';
    $buyBlock.className = 'add-to-cart-block';
    $buyBlockWrapper.className = 'add-to-cart-wrapper';
    $price.className = 'detail-price';

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
      <p class="detail-category">${this.product.category}</p>
    </div>`;
    $price.textContent = `${formatPrice(this.product.price)}`;
    $buyBlock.append($buyBlockWrapper);
    $buyBlockWrapper.append($price, this.$orderButton, this.buildBuyButton());

    [...new Set([...this.product.images])].forEach((src, i) => {
      const $img = this.buildSlideImage(src, i);
      $slides.append($img);
    });

    $grandPhoto.append($grandPhotoImg);

    $productTitle.innerHTML = title;
    $productInfo.innerHTML = infoProd;

    $productPhoto.append($slides);
    $productPhoto.append($grandPhoto);
    $productData.append($productPhoto);
    $productData.append($productInfo);
    $productData.append($buyBlock);
    $productDetail.append($productTitle);
    $productDetail.append($productData);
    $blockDetails.append($productDetail);

    $slides.addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.closest('.btn-img')) {
        const index = dataset.get<ImageDataset>(target, 'index');
        const src = this.product.images[Number(index)];
        $grandPhotoImg.src = src;
      }
    });

    return $blockDetails;
  }

  buildGrandImage(src: string) {
    const $img = document.createElement('img');

    $img.className = 'img-big';
    $img.alt = 'Slide';
    $img.src = src;

    return $img;
  }

  buildSlideImage(src: string, index: number) {
    const dataset = datasetHelper();
    const $img = document.createElement('img');

    $img.className = 'btn-img';
    $img.alt = 'Slide';
    $img.src = src;
    dataset.set<ImageDataset>($img, { index: index.toString() });

    return $img;
  }

  buildOrderButton() {
    const $button = document.createElement('button');
    const productId = this.product.id;
    const isOrdered = App.isProductOrdered(productId);
    $button.className = 'btn-order';
    $button.textContent = isOrdered ? 'DROP FROM CART' : 'ADD TO CART';

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
    const productId = this.product.id;
    const isOrdered = App.isProductOrdered(productId);
    const $button = document.createElement('button');
    $button.className = 'btn-buy';
    $button.textContent = 'BUY NOW';

    $button.addEventListener('click', () => {
      if (!isOrdered) {
        App.increaseOrder(productId.toString());
      }
      window.location.href = `/#${PageIds.CartPage}`;
      App.setModal(new ModalItem().render());
    });

    return $button;
  }

  refreshOrderButton() {
    this.$orderButton = replaceWith(this.$orderButton, this.buildOrderButton());
  }

  render() {
    this.container.append(this.generateLinkNavigation(), this.generateDetail());
    return this.container;
  }
}

export default ProductDetails;
