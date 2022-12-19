import App from '../../../pages/app';
import Component from '../../templates/components';
import ProductPreview from '../product-preview';

class ProductList extends Component {
  constructor() {
    super('div', 'products');
  }

  build() {
    const productList = document.createElement('div');
    const products = App.getProducts();

    productList.className = 'product-list';

    if (products.length > 0) {
      products.forEach((p) => productList.append(new ProductPreview(p).render()));
    }
    return productList;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default ProductList;
