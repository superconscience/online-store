import ProductDetails from '../../core/components/product-details';
import Page from '../../core/templates/page';
import { productsMap } from '../../products-map';
import { Product } from '../../types';

class ProductDetailsPage extends Page {
  product: Product | null = null;
  productId: string;
  constructor() {
    super();
    this.product = this.initProduct();
    this.productId = this.getProductId();
  }

  private initProduct(): Product | null {
    const productId = this.getProductId();

    if (!productsMap[productId]) {
      return null;
    }

    return productsMap[productId];
  }

  private getProductId(): string {
    const parts = window.location.hash.slice(1).split('/');
    const productId = parts[1];
    return productId;
  }

  build(): HTMLDivElement {
    const detailBlock = document.createElement('div');
    detailBlock.className = 'detail-block';
    if (this.product) {
      detailBlock.append(new ProductDetails(this.product).render());
    } else {
      detailBlock.append(this.buildNotFound());
    }
    return detailBlock;
  }

  buildNotFound(): HTMLDivElement {
    const $notFound = document.createElement('div');
    let html: string;

    $notFound.className = 'not-found';

    if (this.productId) {
      html = `Product with id <span class="not-found-id">${this.productId}</span> not found 😑`;
    } else {
      html = `Product not found 😑`;
    }

    $notFound.innerHTML = html;

    return $notFound;
  }

  render(): DocumentFragment {
    this.container.append(this.build());
    return this.container;
  }
}
export default ProductDetailsPage;
