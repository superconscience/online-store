import { Product } from '../../types';
import Component from './components';

export type FilterType = Extract<keyof Product, 'category' | 'brand' | 'price' | 'stock'>;

abstract class Filter extends Component {
  protected readonly filterType: FilterType;

  constructor(filterType: FilterType, tagName = 'div', className = '') {
    super(tagName, className);
    this.filterType = filterType;
  }

  abstract filter(): Product[];
}

export default Filter;
