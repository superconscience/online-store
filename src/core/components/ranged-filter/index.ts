import { data } from '../../../data';
import App from '../../../pages/app';
import { Product } from '../../../types';
import { QUERY_VALUE_SEPARATOR } from '../../../utils/constants';
import { queryHelper } from '../../../utils/functions';
import Filter, { RangedFilterType, RangedItems } from '../../templates/filter';

class RangedFilter extends Filter<RangedFilterType> {
  private items: RangedItems = { defaultMin: 0, defaultMax: 0, min: 0, max: 0 };
  private $from: HTMLInputElement | null = null;
  private $to: HTMLInputElement | null = null;

  constructor(filterType: RangedFilterType) {
    const className = `${filterType}-filter dual-slider`;
    super(filterType, 'div', className);
    this.fillItems();
  }

  fillItems() {
    const actualProducts = App.getProducts();
    const products = data.products;
    const filterType = this.filterType;
    const getValues = (products: Product[]) => products.map((p) => p[filterType]);
    const actualValues = getValues(actualProducts);
    const allValues = getValues(products);
    this.items = {
      defaultMin: Math.min(...allValues),
      defaultMax: Math.max(...allValues),
      min: Math.min(...actualValues),
      max: Math.max(...actualValues),
    };
  }

  build() {
    const query = queryHelper();
    const defaultMinStr = this.items.defaultMin.toString();
    const defaultMaxStr = this.items.defaultMax.toString();
    const minStr = this.items.min.toString();
    const maxStr = this.items.max.toString();

    const fragment = document.createDocumentFragment();
    const slider = document.createElement('div');
    const header = document.createElement('h3');
    const outData = document.createElement('div');
    const multirange = document.createElement('div');
    const fromData = document.createElement('div');
    const toData = document.createElement('div');
    const fromInput = document.createElement('input');
    const toInput = document.createElement('input');

    this.$from = fromInput;
    this.$to = toInput;

    slider.className = `${this.filterType}-filter__slider`;
    header.className = 'filter-header';
    header.textContent = this.filterName;

    outData.className = 'out-data';
    multirange.className = 'multi-range';

    fromData.className = 'from-data';
    fromData.textContent = minStr;
    toData.className = 'to-data';
    toData.textContent = maxStr;

    fromInput.type = 'range';
    fromInput.min = defaultMinStr;
    fromInput.max = defaultMaxStr;
    fromInput.value = minStr;
    toInput.type = 'range';
    toInput.min = defaultMinStr;
    toInput.max = defaultMaxStr;
    toInput.value = maxStr;

    Number.isFinite(this.items.min) ? outData.append(fromData, ' ⟷ ', toData) : outData.append('NOT FOUND');
    multirange.append(fromInput, toInput);
    slider.append(outData, multirange);

    fragment.append(header, slider);

    multirange.addEventListener('change', (e) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement)) {
        return;
      }
      if (!this.$from || !this.$to) {
        return;
      }
      const tuple = [Number(this.$from.value), Number(this.$to.value)].sort((a, b) => a - b);
      query.set(this.filterType, tuple.join(QUERY_VALUE_SEPARATOR));
      query.apply();
    });

    return fragment;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default RangedFilter;
