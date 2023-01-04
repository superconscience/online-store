import Products from '../../core/components/products';
import Sidebar from '../../core/components/sidebar';
import Page from '../../core/templates/page';
import { data } from '../../data';
import { Product } from '../../types';
import { QUERY_VALUE_SEPARATOR } from '../../utils/constants';
import { queryHelper, replaceWith } from '../../utils/functions';
import App from '../app';

class MainPage extends Page {
  $sidebar: HTMLElement;
  $products: HTMLElement;

  constructor() {
    super();
    this.useQuery();
    this.$sidebar = new Sidebar().render();
    this.$products = new Products().render();
  }

  render() {
    const $root = document.createElement('div');
    $root.className = 'store';
    $root.append(this.$sidebar, this.$products);
    this.container.append($root);
    return this.container;
  }

  refresh() {
    this.$sidebar = replaceWith(this.$sidebar, new Sidebar().render());
    this.$products = replaceWith(this.$products, new Products().render());
  }

  query() {
    this.useQuery();
    this.refresh();
  }

  useQuery() {
    const query = queryHelper();
    const category = query.get('category');
    const brand = query.get('brand');
    const price = query.get('price');
    const stock = query.get('stock');
    const sort = query.get('sort');
    const search = query.get('search');

    let products = [...data.products];

    if (category !== null) {
      products = products.filter((p) =>
        category.toLowerCase().split(QUERY_VALUE_SEPARATOR).includes(p.category.toLowerCase())
      );
    }

    if (brand !== null) {
      products = products.filter((p) =>
        brand.toLowerCase().split(QUERY_VALUE_SEPARATOR).includes(p.brand.toLowerCase())
      );
    }

    if (price !== null) {
      const [min, max] = price.split(QUERY_VALUE_SEPARATOR).map((x) => Number(x));
      if (max >= min) {
        products = products.filter((p) => p.price >= min && p.price <= max);
      }
    }

    if (stock !== null) {
      const [min, max] = stock.split(QUERY_VALUE_SEPARATOR).map((x) => Number(x));
      if (max >= min) {
        products = products.filter((p) => p.stock >= min && p.stock <= max);
      }
    }

    if (sort !== null) {
      const sortMap: Record<
        'price' | 'rating' | 'discount',
        Extract<keyof Product, 'price' | 'rating' | 'discountPercentage'>
      > = {
        price: 'price',
        rating: 'rating',
        discount: 'discountPercentage',
      } as const;
      type Order = 'ASC' | 'DESC';

      const isSortKey = (value: string): value is keyof typeof sortMap => {
        return Object.keys(sortMap).includes(value);
      };
      const isOrder = (value: string): value is Order => {
        return value === 'ASC' || value === 'DESC';
      };
      const sortHandler = (a: Product, b: Product, key: keyof typeof sortMap, order: Order) => {
        const itemKey = sortMap[key];
        return order === 'ASC'
          ? a[itemKey] - b[itemKey]
          : order === 'DESC'
          ? b[itemKey] - a[itemKey]
          : a[itemKey] - b[itemKey];
      };

      const [key, order] = sort.split('-');
      if (isSortKey(key) && isOrder(order)) {
        products = products.sort((a, b) => sortHandler(a, b, key, order));
      }
    }

    if (search !== null) {
      const regexp = new RegExp(search, 'gi');
      products = products.filter((p) => regexp.test(p.title));
    }

    App.setProducts(products);
  }
}

export default MainPage;
