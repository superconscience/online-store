import App from '../../../pages/app';
import { queryHelper } from '../../../utils/functions';
import Component from '../../templates/components';
import ProductPreview from '../product-preview';
import SearchBar from '../search-bar';
import SortBar from '../sort-bar';
import ViewMode from '../view-mode';
import { Product } from '../../../types';
import { data } from '../../../data';
const productsClassName = 'products';

class Products extends Component {
  $sortBar = new SortBar().render();
  $searchBar = new SearchBar().render();
  $viewMode = new ViewMode().render();
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
    $productList.addEventListener('click', function (event) {
      const arrCart = Products.getOrder();
      const target = event.target as HTMLElement;
      let isEquals = false;
      if (target.closest('.btn-preview')) {
        if (arrCart.length === 0) {
          Products.setOrder(Products.data.products[Number(target.getAttribute('data-id')) - 1]);
        } else {
          arrCart.forEach(function (el, i) {
            if (Number(target.getAttribute('data-id')) !== el.id) {
              isEquals = true;
              return arrCart;
            } else if (Number(target.getAttribute('data-id')) === el.id) {
              arrCart.splice(i, 1);
              isEquals = false;
              return arrCart;
            }
          });
        }
        if (isEquals !== false) {
          Products.setOrder(Products.data.products[Number(target.getAttribute('data-id')) - 1]);
        }
      }
      console.log(arrCart);
    });
    return $fragment;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default Products;
