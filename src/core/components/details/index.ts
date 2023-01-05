import { Product } from '../../../types';
import Component from '../../templates/components';

class Details extends Component {
  private readonly product: Product;
  constructor(product: Product, tagName = 'div', className = 'block-general-details') {
    super(tagName, className);
    this.product = product;
  }
  generateDetail() {
    let images = '';
    const blockDetails = document.createDocumentFragment();
    const productDetail = document.createElement('div') as HTMLElement;
    const productTitle = document.createElement('div') as HTMLElement;
    const productPhoto = document.createElement('div') as HTMLElement;
    const slides = document.createElement('div') as HTMLElement;
    const grandPhoto = document.createElement('div') as HTMLElement;
    const productInfo = document.createElement('div') as HTMLElement;
    const productData = document.createElement('div') as HTMLElement;
    const addToCart = document.createElement('div') as HTMLElement;
    productDetail.className = 'block-deatail';
    productTitle.className = 'product-title';
    productPhoto.className = 'product-photo';
    slides.className = 'slides';
    grandPhoto.className = 'grand-photo';
    productInfo.className = 'product-info';
    productData.className = 'product-data';
    addToCart.className = 'add-to-cart';
    const title = `<h1 class="title-detail">${this.product.title}</h1>`;
    const infoProd = `<div  class="product-info">
    <div  class="product-detail-item">
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
    </div>
  </div>`;
    const addToCartBlock = ` <div class="add-to-cart">
    <div class="cart-button">
      <div class="detail-price">${this.product.price}</div>  <button class="btn-add-details" data-id="${String(
      this.product.id
    )}">DROP FROM CART</button><button>BUY NOW</button>
    </div>
  </div>`;
    this.product.images.forEach(
      (p, i) => (images += ` <img  alt="Slide" src="${p}" class="btn-img" data-id="${String(i)}"/>`)
    );
    productTitle.innerHTML = title;
    productInfo.innerHTML = infoProd;
    addToCart.innerHTML = addToCartBlock;
    slides.innerHTML = images;
    productPhoto.append(slides);
    productPhoto.append(grandPhoto);
    productData.append(productPhoto);
    productData.append(productInfo);
    productData.append(addToCart);
    productDetail.append(productTitle);
    productDetail.append(productData);
    blockDetails.append(productDetail);

    return blockDetails;
  }
  render() {
    this.container.append(this.generateDetail());
    return this.container;
  }
}
export default Details;
