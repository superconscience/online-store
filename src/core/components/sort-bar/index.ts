import { Product } from '../../../types';
import { queryHelper } from '../../../utils/functions';
import Component from '../../templates/components';
import Products from '../products';

const sort: {
  name: string;
  key: Extract<keyof Product, 'price' | 'rating' | 'discountPercentage'>;
}[] = [
  {
    name: 'price',
    key: 'price',
  },
  {
    name: 'rating',
    key: 'rating',
  },
  {
    name: 'discount',
    key: 'discountPercentage',
  },
];

const order = ['ASC', 'DESC'];

const sortBarClassName = 'sort-bar';

class SortBar extends Component {
  static readonly classes = {
    sortBar: sortBarClassName,
    sortTitle: `${sortBarClassName}__sort-title`,
    select: `${sortBarClassName}__select`,
    option: `${sortBarClassName}__option`,
  };
  constructor() {
    super('div', `${Products.classes.sortBar} ${SortBar.classes.sortBar}`);
  }

  build() {
    const currentSortValue = queryHelper().get('sort');
    const $select = document.createElement('select');
    const $headOption = document.createElement('option');

    $select.className = SortBar.classes.select;
    $headOption.disabled = true;
    $headOption.selected = true;
    $headOption.value = SortBar.classes.sortTitle;
    $headOption.textContent = 'Sort options:';
    $select.append($headOption);

    sort.forEach((s) => {
      order.forEach((o) => {
        const option = document.createElement('option');
        const value = `${s.name}-${o}`;
        option.className = SortBar.classes.option;
        option.value = `${s.name}-${o}`;
        option.textContent = `Sort by ${s.name} - ${o}`;
        if (value === currentSortValue) {
          option.selected = true;
        }
        $select.append(option);
      });
    });

    $select.addEventListener('change', () => {
      const query = queryHelper();
      query.set('sort', $select.value);
      query.apply();
    });

    return $select;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default SortBar;
