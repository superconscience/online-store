import { QUERY_VALUE_SEPARATOR } from '../../../utils/constants';
import { queryHelper } from '../../../utils/functions';
import Component from '../../templates/components';
import { CheckboxedFilterType } from '../../templates/filter';

const checkBoxLineClassName = 'checkbox-line';

class CheckboxLine extends Component {
  readonly filterType: CheckboxedFilterType;
  readonly title: string;
  readonly filterName: string;
  readonly total: number;
  readonly available: number;
  static readonly classes = {
    checkboxLine: checkBoxLineClassName,
    input: `${checkBoxLineClassName}__input`,
    label: `${checkBoxLineClassName}__label`,
  };

  constructor(filterType: CheckboxedFilterType, filterName: string, total: number, available = total) {
    super('li', CheckboxLine.classes.checkboxLine);
    this.filterType = filterType;
    this.title = filterName.slice(0, 1).toUpperCase() + filterName.slice(1);
    this.filterName = filterName;
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
    checkbox.className = CheckboxLine.classes.input;
    checkbox.checked = query.get(this.filterType)?.split(QUERY_VALUE_SEPARATOR).includes(this.filterName) || false;
    label.setAttribute('for', this.title);
    label.className = CheckboxLine.classes.label;
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
