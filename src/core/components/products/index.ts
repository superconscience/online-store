import App from '../../../pages/app';
import { productsMap } from '../../../products-map';
import { queryHelper, replaceWith } from '../../../utils/functions';
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
  $productList: HTMLElement;
  $stat: HTMLElement;

  private $products: Record<string, HTMLElement> = {};

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
    this.$productList = this.buildProductList();
    this.$stat = this.buildStat();
  }

  build(): DocumentFragment {
    const $fragment = document.createDocumentFragment();
    const $productList = this.$productList;
    const $header = document.createElement('div');
    const $stat = this.$stat;

    $header.className = Products.classes.header;

    $header.append(this.$sortBar, $stat, this.$searchBar, this.$viewMode);
    $fragment.append($header, $productList);

    return $fragment;
  }

  buildProductList(): HTMLElement {
    const actualProducts = App.getProducts();
    if (actualProducts.length === 0) {
      const $notFound = document.createElement('div');
      $notFound.className = 'not-found';
      $notFound.textContent = 'No products found 😏';
      return $notFound;
    }

    const isSmall = queryHelper().get('big') === 'false';
    const $productList = document.createElement('ul');

    $productList.className = Products.classes.productList;
    $productList.classList.toggle('big', !isSmall);

    actualProducts.forEach((p) => {
      const $preview = new ProductPreview(p).render();
      $productList.append($preview);
      this.$products[p.id] = $preview;
    });

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
      this.$products[id] = replaceWith(this.$products[id], $newPreview);

      App.refreshHeader();
    });

    return $productList;
  }

  buildStat(): HTMLDivElement {
    const actualProducts = App.getProducts();
    const $stat = document.createElement('div');

    $stat.className = Products.classes.stat;

    $stat.textContent = `Found: ${actualProducts.length}`;

    return $stat;
  }

  refreshProductList(): void {
    this.$productList = replaceWith(this.$productList, this.buildProductList());
    this.$stat = replaceWith(this.$stat, this.buildStat());
  }

  refreshViewMode(): void {
    this.$viewMode = replaceWith(this.$viewMode, new ViewMode().render());
  }

  render(): HTMLElement {
    this.container.append(this.build());
    return this.container;
  }
}

export default Products;
