import Products from '../../core/components/products';
import Sidebar from '../../core/components/sidebar';
import Page from '../../core/templates/page';
import { data } from '../../data';
import { Product } from '../../types';
import { QUERY_VALUE_SEPARATOR } from '../../utils/constants';
import { queryHelper, replaceWith } from '../../utils/functions';
import App from '../app';

class MainPage extends Page {
  sidebar: Sidebar;
  products: Products;
  $sidebar: HTMLElement;
  $products: HTMLElement;

  constructor() {
    super();
    this.useQuery();

    const sidebar = new Sidebar();
    const products = new Products();

    this.sidebar = sidebar;
    this.products = products;
    this.$sidebar = sidebar.render();
    this.$products = products.render();
  }

  render() {
    const $root = document.createElement('div');
    $root.className = 'store';
    $root.append(this.$sidebar, this.$products);
    this.container.append($root);
    return this.container;
  }

  refreshSidebar() {
    this.sidebar = new Sidebar();
    this.$sidebar = replaceWith(this.$sidebar, this.sidebar.render());
  }

  refreshProducts() {
    this.products = new Products();
    this.$products = replaceWith(this.$products, this.products.render());
  }

  refreshOnQuery() {
    const [prevHref, currentHref] = App.getHistory();

    const prevQuery = queryHelper(prevHref);
    const currentQuery = queryHelper(currentHref);

    const prevCategory = prevQuery.get('category');
    const prevBrand = prevQuery.get('brand');
    const prevPrice = prevQuery.get('price');
    const prevStock = prevQuery.get('stock');
    const prevSort = prevQuery.get('sort');
    const prevSearch = prevQuery.get('search');
    const prevBig = prevQuery.get('big');

    const currentCategory = currentQuery.get('category');
    const currentBrand = currentQuery.get('brand');
    const currentPrice = currentQuery.get('price');
    const currentStock = currentQuery.get('stock');
    const currentSort = currentQuery.get('sort');
    const currentSearch = currentQuery.get('search');
    const currentBig = currentQuery.get('big');

    if (prevPrice !== currentPrice) {
      this.sidebar.refreshCategoryFilter();
      this.sidebar.refreshBrandFilter();
      this.sidebar.refreshStockFilter();
      this.refreshProducts();
      return;
    }

    if (prevStock !== currentStock) {
      this.sidebar.refreshCategoryFilter();
      this.sidebar.refreshBrandFilter();
      this.sidebar.refreshPriceFilter();
      this.refreshProducts();
      return;
    }

    if (prevCategory !== currentCategory || prevBrand !== currentBrand) {
      this.sidebar.refreshCategoryFilter();
      this.sidebar.refreshBrandFilter();
      this.sidebar.refreshPriceFilter();
      this.sidebar.refreshStockFilter();
      this.refreshProducts();
      return;
    }

    if (prevSort !== currentSort) {
      this.refreshProducts();
      return;
    }

    if (prevSearch !== currentSearch) {
      this.refreshSidebar();
      this.products.refreshProductList();
      return;
    }

    if (prevBig !== currentBig) {
      this.products.refreshProductList();
      this.products.refreshViewMode();
      return;
    }
  }

  query() {
    this.useQuery();
    this.refreshOnQuery();
  }

  useQuery() {
    const query = queryHelper();
    const category = query.get('category');
    const brand = query.get('brand');
    const price = query.get('price');
    const stock = query.get('stock');
    const sort = query.get('sort');
    const search = query.get('search');
    const searchFields: Exclude<keyof Product, 'id' | 'thumbnail' | 'images'>[] = [
      'title',
      'description',
      'price',
      'discountPercentage',
      'rating',
      'stock',
      'brand',
      'category',
    ];

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
      products = products.filter((p) => searchFields.some((f) => regexp.test(String(p[f]))));
    }

    App.setProducts(products);
  }
}

export default MainPage;
