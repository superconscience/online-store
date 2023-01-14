import { PageIds } from '../../../utils/constants';
import { debounce, queryHelper } from '../../../utils/functions';
import Component from '../../templates/components';
import Products from '../products';

const searchBarClassName = 'search-bar';

class SearchBar extends Component {
  static readonly classes = {
    searchBar: searchBarClassName,
    input: `${searchBarClassName}__input`,
  };
  static $input: HTMLInputElement;

  constructor() {
    super('div', `${Products.classes.searchBar} ${SearchBar.classes.searchBar}`);
  }

  build(): HTMLInputElement {
    const query = queryHelper();
    const currentValue = query.get('search');
    const $input = document.createElement('input');
    SearchBar.$input = $input;

    $input.className = SearchBar.classes.input;
    $input.type = 'search';
    $input.placeholder = 'Search product';
    if (currentValue) {
      $input.value = currentValue;
    }

    const inputHandler: EventListener = () => {
      const query = queryHelper();
      const value = $input.value.trim();
      query.set('search', value);
      query.apply(PageIds.MainPage);
    };

    $input.addEventListener('input', debounce(inputHandler, 300));

    return $input;
  }

  render(): HTMLElement {
    this.container.append(this.build());
    return this.container;
  }
}

export default SearchBar;
