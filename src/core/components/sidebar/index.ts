import App from '../../../pages/app';
import { PageIds } from '../../../utils/constants';
import { queryHelper, replaceWith } from '../../../utils/functions';
import Component from '../../templates/components';
import CheckboxedFilter from '../checkboxed-filter';
import RangedFilter from '../ranged-filter';

class Sidebar extends Component {
  $categoryFilter = new CheckboxedFilter('category').render();
  $brandFilter = new CheckboxedFilter('brand').render();
  $priceFilter = new RangedFilter('price').render();
  $stockFilter = new RangedFilter('stock').render();

  constructor() {
    super('div', 'sidebar');
  }

  build() {
    const query = queryHelper();

    const $filters = document.createElement('div');
    const $categories = document.createElement('div');
    const $brands = document.createElement('div');
    const $prices = document.createElement('div');
    const $stock = document.createElement('div');
    const $reset = document.createElement('div');
    const $resetButton = document.createElement('a');
    const $copyLinkButton = document.createElement('a');

    const copyLinkText = 'Copy link';

    $filters.className = 'filters';

    $categories.className = 'categories';
    $brands.className = 'brands';
    $prices.className = 'prices';
    $stock.className = 'stocks';

    $reset.className = 'reset-total';

    $resetButton.className = 'filters__reset-btn btn-filter';
    $resetButton.textContent = 'Reset Filters';

    $resetButton.onclick = () => (query.removeFilters(), query.apply(PageIds.MainPage));

    $copyLinkButton.className = 'filters__copy-link-btn btn-filter';
    $copyLinkButton.textContent = copyLinkText;

    $reset.append($resetButton, $copyLinkButton);

    $categories.append(this.$categoryFilter);
    $brands.append(this.$brandFilter);
    $prices.append(this.$priceFilter);
    $stock.append(this.$stockFilter);

    $filters.append($reset, $categories, $brands, $prices, $stock);

    $copyLinkButton.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      $copyLinkButton.textContent = 'Copied !';
      setTimeout(() => {
        $copyLinkButton.textContent = copyLinkText;
      }, 500);
    });
    return $filters;
  }

  refresh() {
    const [prevHref, currentHref] = App.getHistory();

    const prevQuery = queryHelper(prevHref);
    const currentQuery = queryHelper(currentHref);

    const prevCategory = prevQuery.get('category');
    const prevBrand = prevQuery.get('brand');
    const prevPrice = prevQuery.get('price');
    const prevStock = prevQuery.get('stock');

    const currentCategory = currentQuery.get('category');
    const currentBrand = currentQuery.get('brand');
    const currentPrice = currentQuery.get('price');
    const currentStock = currentQuery.get('stock');

    if (prevPrice !== currentPrice) {
      this.refreshCategoryFilter();
      this.refreshBrandFilter();
      this.refreshStockFilter();
      return;
    }

    if (prevStock !== currentStock) {
      this.refreshCategoryFilter();
      this.refreshBrandFilter();
      this.refreshPriceFilter();
      return;
    }

    if (prevCategory !== currentCategory || prevBrand !== currentBrand) {
      this.refreshCategoryFilter();
      this.refreshBrandFilter();
      this.refreshPriceFilter();
      this.refreshStockFilter();
    }
  }

  refreshCategoryFilter() {
    this.$categoryFilter = replaceWith(this.$categoryFilter, new CheckboxedFilter('category').render());
  }

  refreshBrandFilter() {
    this.$brandFilter = replaceWith(this.$brandFilter, new CheckboxedFilter('brand').render());
  }

  refreshPriceFilter() {
    this.$priceFilter = replaceWith(this.$priceFilter, new RangedFilter('price').render());
  }

  refreshStockFilter() {
    this.$stockFilter = replaceWith(this.$stockFilter, new RangedFilter('stock').render());
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default Sidebar;
