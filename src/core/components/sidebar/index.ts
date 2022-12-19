import { PageIds } from '../../../pages/app';
import Component from '../../templates/components';
import CategoryFilter from '../category-filter';

class Sidebar extends Component {
  categoryFilter = new CategoryFilter();
  constructor() {
    super('div', 'sidebar');
  }
  build() {
    const filters = document.createElement('div');
    const categories = document.createElement('div');
    const reset = document.createElement('div');
    const resetButton = document.createElement('a');
    const copyLinkButton = document.createElement('a');

    filters.className = 'filters';

    categories.className = 'categories';

    reset.className = 'reset-total';

    resetButton.className = 'filters__reset-btn btn';
    resetButton.textContent = 'Reset Filters';
    resetButton.onclick = () => (window.location.href = `#${PageIds.MainPage}`);

    copyLinkButton.className = 'filters__copy-link-btn';
    copyLinkButton.textContent = 'Copy Link';
    // TODO: Add onclick eventlistener
    reset.append(resetButton, copyLinkButton);

    categories.append(this.categoryFilter.render());

    filters.append(reset, categories);
    return filters;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default Sidebar;
