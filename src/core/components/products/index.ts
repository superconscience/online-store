import App from '../../../pages/app';
import { queryHelper } from '../../../utils/functions';
import Component from '../../templates/components';
import ProductPreview from '../product-preview';
import SearchBar from '../search-bar';
import SortBar from '../sort-bar';
import ViewMode from '../view-mode';
import { Product } from '../../../types';
import { data } from '../../../data';
import { productsMap } from '../../../products-map';
import Header from '../header';
const productsClassName = 'products';

class Products extends Component {
  $sortBar = new SortBar().render();
  $searchBar = new SearchBar().render();
  $viewMode = new ViewMode().render();
  private $products: Record<string, HTMLElement> = {};
  private static data = { ...data };
  static readonly classes = {
    productList: 'product-list',
    header: `${productsClassName}__header`,
    sortBar: `${productsClassName}__sort-bar`,
    stat: `${productsClassName}__stat`,
    searchBar: `${productsClassName}__search-bar`,
    viewMode: `${productsClassName}__view-mode`,
  };
  private static dataCarts: Product[];

  constructor() {
    super('div', productsClassName);
    Products.dataCarts =
      localStorage.getItem('card') !== null ? [...JSON.parse(localStorage.getItem('card') || '{}')] : [];
  }

  static getOrder() {
    return Products.dataCarts;
  }
  static setOrder(data: Product) {
    Products.dataCarts.push(data);
  }

  build() {
    const actualProducts = App.getProducts();
    const isSmall = queryHelper().get('big') === 'false';
    const $fragment = document.createDocumentFragment();
    const $productList = document.createElement('ul');
    const $header = document.createElement('div');
    const $stat = document.createElement('div');

    $productList.className = Products.classes.productList;
    $productList.classList.toggle('big', !isSmall);
    $header.className = Products.classes.header;
    $stat.className = Products.classes.stat;

    $stat.textContent = `Found: ${actualProducts.length}`;

    $header.append(this.$sortBar, $stat, this.$searchBar, this.$viewMode);
    $fragment.append($header);

    if (actualProducts.length > 0) {
      actualProducts.forEach((p) => {
        const $preview = new ProductPreview(p).render();
        $productList.append($preview);
        this.$products[p.id] = $preview;
      });
      $fragment.append($productList);
    } else {
      const $notFound = document.createElement('div');
      $notFound.className = 'not-found';
      $notFound.textContent = 'No products found 😏';
      $fragment.append($notFound);
    }

    $productList.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }

      const isAddingButton = event.target.classList.contains(ProductPreview.classes.addToCart);
      const isDroppingButton = event.target.classList.contains(ProductPreview.classes.dropFromCart);
      if (!isAddingButton && !isDroppingButton) {
        return;
      }

      const id = event.target.dataset.id;
      if (id === undefined) {
        return;
      }

      if (isAddingButton) {
        App.increaseOrder(id);
      } else {
        App.dropOrder(id);
      }

      const product = productsMap[id];
      const $newPreview = new ProductPreview(product).render();
      this.$products[id].replaceWith($newPreview);
      this.$products[id] = $newPreview;

      const app = App.getInstance();
      const $newHeader = new Header().render();
      app.$header.replaceWith($newHeader);
      app.$header = $newHeader;
    });
    return $fragment;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default Products;
