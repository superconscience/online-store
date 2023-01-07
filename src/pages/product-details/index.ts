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
    return detailBlock;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}
export default ProductDetailsPage;
