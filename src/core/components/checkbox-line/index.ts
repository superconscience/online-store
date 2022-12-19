import { QUERY_VALUE_SEPARATOR } from '../../../utils/constants';
import { queryHelper } from '../../../utils/functions';
import Component from '../../templates/components';

class CheckboxLine extends Component {
  readonly title: string;
  readonly category: string;
  readonly total: number;
  readonly available: number;

  constructor(title: string, total: number, available = total) {
    super('li', 'checkbox-line');
    this.title = title.slice(0, 1).toUpperCase() + title.slice(1);
    this.category = title;
    this.total = total;
    this.available = available;
  }

  build() {
    const query = queryHelper();
    const fragment = document.createDocumentFragment();
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    checkbox.type = 'checkbox';
    checkbox.id = this.title;
    checkbox.className = 'checkbox-line__input';
    checkbox.checked = query.get('category')?.split(QUERY_VALUE_SEPARATOR).includes(this.category) || false;
    label.setAttribute('for', this.title);
    label.className = 'checkbox-line__label';
    label.textContent = `${this.title} (${this.available}/${this.total})`;
    fragment.append(checkbox, label);
    return fragment;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default CheckboxLine;
