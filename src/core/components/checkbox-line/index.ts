import { QUERY_VALUE_SEPARATOR } from '../../../utils/constants';
import { queryHelper } from '../../../utils/functions';
import Component from '../../templates/components';
import { CheckboxFilterType } from '../../templates/filter';

class CheckboxLine extends Component {
  private static readonly cssClassName = 'checkbox-line';
  readonly filterType: CheckboxFilterType;
  readonly title: string;
  readonly filterName: string;
  readonly total: number;
  readonly available: number;
  static readonly classes = {
    checkboxLine: CheckboxLine.cssClassName,
    input: `${CheckboxLine.cssClassName}__input`,
    label: `${CheckboxLine.cssClassName}__label`,
    info: `${CheckboxLine.cssClassName}__info`,
  };

  constructor(filterType: CheckboxFilterType, filterName: string, total: number, available = total) {
    super('li', CheckboxLine.classes.checkboxLine);
    this.filterType = filterType;
    this.title = filterName.slice(0, 1).toUpperCase() + filterName.slice(1);
    this.filterName = filterName;
    this.total = total;
    this.available = available;
  }

  build(): DocumentFragment {
    const query = queryHelper();
    const fragment = document.createDocumentFragment();
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const info = document.createElement('span');
    checkbox.type = 'checkbox';
    checkbox.id = this.title;
    checkbox.className = CheckboxLine.classes.input;
    checkbox.checked = query.get(this.filterType)?.split(QUERY_VALUE_SEPARATOR).includes(this.filterName) || false;
    label.setAttribute('for', this.title);
    label.className = CheckboxLine.classes.label;
    label.textContent = this.title;
    info.className = CheckboxLine.classes.info;
    info.textContent = `(${this.available}/${this.total})`;
    fragment.append(checkbox, label, info);
    return fragment;
  }

  render(): HTMLElement {
    this.container.append(this.build());
    return this.container;
  }
}

export default CheckboxLine;
