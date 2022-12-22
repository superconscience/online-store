import { queryHelper } from '../../../utils/functions';
import Component from '../../templates/components';
import Products from '../products';

const searchBarClassName = 'search-bar';

class SearchBar extends Component {
  static readonly classes = {
    searchBar: searchBarClassName,
    input: `${searchBarClassName}__input`,
  };
  constructor() {
    super('div', `${Products.classes.searchBar} ${SearchBar.classes.searchBar}`);
  }

  build() {
    const currentValue = queryHelper().get('search');
    const $input = document.createElement('input');

    $input.className = SearchBar.classes.input;
    $input.type = 'search';
    $input.placeholder = 'Search product';
    if (currentValue) {
      $input.value = currentValue;
    }

    $input.addEventListener('input', () => {
      const value = $input.value.trim();
      const query = queryHelper();
      query.set('search', value);
      query.apply();
    });

    return $input;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default SearchBar;
