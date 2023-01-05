import ProductDetails from '../../core/components/product-details';
import Page from '../../core/templates/page';
import { productsMap } from '../../products-map';
import { Product } from '../../types';

class ProductDetailsPage extends Page {
  product: Product;
  constructor() {
    super();
    this.product = this.initProduct();
  }

  initProduct() {
    const parts = window.location.hash.slice(1).split('/');
    const productId = parts[1];

    if (!productsMap[productId]) {
      throw new Error(`Cannot find product for id ${productId}.`);
    }

    return productsMap[productId];
  }

  build() {
    const detailBlock = document.createElement('div');
    detailBlock.className = 'detail-block';
    detailBlock.append(new ProductDetails(this.product).render());

    detailBlock.addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.closest('.btn-img')) {
        const numberPhoto = Number(target.getAttribute('data-id'));
        const grandPhoto = detailBlock.querySelector('.grand-photo') as HTMLElement;
        grandPhoto.innerHTML = `<img  alt="Slide" src="${this.product.images[numberPhoto]}" class="img-big"/>`;
      }
    });
    return detailBlock;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}
export default ProductDetailsPage;
