import { Product } from '../../types';
import Component from './components';

type ProuductKey = keyof Product;

export type FilterType = CheckboxedFilterType | RangedFilterType;
export type CheckboxedFilterType = Extract<ProuductKey, 'category' | 'brand'>;
export type RangedFilterType = Extract<ProuductKey, 'price' | 'stock'>;

export type CheckboxedItems = Record<string, { total: number; actual: number }>;
export type RangedItems = { min: number; max: number };

abstract class Filter<FT extends FilterType> extends Component {
  protected readonly filterType: FT;
  protected readonly filterName: string;

  constructor(filterType: FT, tagName = 'div', className = '') {
    super(tagName, className);
    this.filterType = filterType;
    this.filterName = filterType.slice(0, 1).toUpperCase() + filterType.slice(1).toLowerCase();
  }

  abstract fillItems(): void;
}

export default Filter;
