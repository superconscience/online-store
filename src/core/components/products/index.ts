import App from '../../../pages/app';
import { queryHelper } from '../../../utils/functions';
import Component from '../../templates/components';
import ProductPreview from '../product-preview';
import SearchBar from '../search-bar';
import SortBar from '../sort-bar';
import ViewMode from '../view-mode';

const productsClassName = 'products';

class Products extends Component {
  $sortBar = new SortBar().render();
  $searchBar = new SearchBar().render();
  $viewMode = new ViewMode().render();

  static readonly classes = {
    productList: 'product-list',
    header: `${productsClassName}__header`,
    sortBar: `${productsClassName}__sort-bar`,
    stat: `${productsClassName}__stat`,
    searchBar: `${productsClassName}__search-bar`,
    viewMode: `${productsClassName}__view-mode`,
  };
  constructor() {
    super('div', productsClassName);
  }

  build() {
    const actualProducts = App.getProducts();
    const isSmall = queryHelper().get('big') === 'false';

    const $fragment = document.createDocumentFragment();
    const $productList = document.createElement('div');
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
      actualProducts.forEach((p) => $productList.append(new ProductPreview(p).render()));
      $fragment.append($productList);
    } else {
      const $notFound = document.createElement('div');
      $notFound.className = 'not-found';
      $notFound.textContent = 'No products found 😏';
      $fragment.append($notFound);
    }

    return $fragment;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default Products;
