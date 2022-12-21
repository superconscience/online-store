import { PageIds } from '../../../pages/app';
import Component from '../../templates/components';
import CheckboxedFilter from '../checkboxed-filter';
import RangedFilter from '../ranged-filter';

class Sidebar extends Component {
  categoryFilter = new CheckboxedFilter('category');
  brandFilter = new CheckboxedFilter('brand');
  priceFilter = new RangedFilter('price');
  stockFilter = new RangedFilter('stock');

  constructor() {
    super('div', 'sidebar');
  }

  build() {
    const filters = document.createElement('div');
    const categories = document.createElement('div');
    const brands = document.createElement('div');
    const prices = document.createElement('div');
    const stock = document.createElement('div');
    const reset = document.createElement('div');
    const resetButton = document.createElement('a');
    const copyLinkButton = document.createElement('a');

    filters.className = 'filters';

    categories.className = 'categories';
    brands.className = 'brands';
    prices.className = 'prices';
    stock.className = 'stocks';

    reset.className = 'reset-total';

    resetButton.className = 'filters__reset-btn btn-filter';
    resetButton.textContent = 'Reset Filters';
    resetButton.onclick = () => (window.location.href = `#${PageIds.MainPage}`);

    copyLinkButton.className = 'filters__copy-link-btn btn-filter';
    copyLinkButton.textContent = 'Copy Link';
    // TODO: Add onclick eventlistener
    reset.append(resetButton, copyLinkButton);

    categories.append(this.categoryFilter.render());
    brands.append(this.brandFilter.render());
    prices.append(this.priceFilter.render());
    stock.append(this.stockFilter.render());

    filters.append(reset, categories, brands, prices, stock);
    return filters;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default Sidebar;
