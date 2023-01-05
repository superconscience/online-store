import { queryHelper } from '../../../utils/functions';
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

    $resetButton.onclick = () => (query.removeFilters(), query.apply());

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

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default Sidebar;
