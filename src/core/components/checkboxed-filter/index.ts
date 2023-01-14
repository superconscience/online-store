import { data } from '../../../data';
import App from '../../../pages/app';
import { PageIds } from '../../../utils/constants';
import { queryHelper } from '../../../utils/functions';
import Filter, { CheckboxedFilterType, CheckboxedItems } from '../../templates/filter';
import CheckboxLine from '../checkbox-line';

class CheckboxedFilter extends Filter<CheckboxedFilterType> {
  private checkboxLineComponentList: CheckboxLine[] = [];
  private checkboxLineList: HTMLElement[] = [];
  private items: CheckboxedItems = {};

  constructor(filterType: CheckboxedFilterType) {
    const className = `${filterType}-filter`;
    super(filterType, 'div', className);
    this.fillItems();
  }

  fillItems(): void {
    const products = data.products;
    const actualProducts = App.getProducts();
    const filterType = this.filterType;

    products.forEach((p) => {
      let filterValue: string | undefined;

      if (p[filterType] !== undefined) {
        filterValue = p[filterType];
      }
      if (filterValue === undefined) {
        return true;
      }

      filterValue = filterValue.toLowerCase();

      if (this.items[filterValue] === undefined) {
        this.items[filterValue] = { total: 1, actual: 0 };
        return true;
      }
      this.items[filterValue].total += 1;
    });

    actualProducts.forEach((p) => {
      this.items[p[filterType].toLowerCase()].actual += 1;
    });
  }

  build(): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const list = document.createElement('ul');
    const header = document.createElement('h3');

    list.className = `${this.filterType}-filter__list`;
    header.className = 'filter-header';
    header.textContent = this.filterName;

    fragment.append(header, list);

    Object.entries(this.items).forEach(([filterName, { total, actual }]) => {
      const checkboxLineComponent = new CheckboxLine(this.filterType, filterName, total, actual);
      const checkboxLine = checkboxLineComponent.render();
      checkboxLine.classList.toggle('item-not-active', actual === 0);
      checkboxLine.classList.toggle('item-active', actual !== 0);
      this.checkboxLineComponentList.push(checkboxLineComponent);
      this.checkboxLineList.push(checkboxLine);
      list.append(checkboxLine);
    });

    list.addEventListener('change', (event) => {
      const target = event.target;

      if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
        return;
      }

      const checkbox = target;
      const checked = checkbox.checked;
      const checkBoxLine = checkbox.closest(`.${CheckboxLine.classes.checkboxLine}`);

      if (!(checkBoxLine instanceof HTMLElement)) {
        return;
      }

      const index = this.checkboxLineList.indexOf(checkBoxLine);
      const filterValue = this.checkboxLineComponentList[index]?.filterName.toLowerCase();
      const query = queryHelper();

      if (!filterValue) {
        return;
      }

      if (checked) {
        query.add(this.filterType, filterValue);
      } else {
        query.remove(this.filterType, filterValue);
      }

      query.apply(PageIds.MainPage);
    });

    return fragment;
  }

  render(): HTMLElement {
    this.container.append(this.build());
    return this.container;
  }
}

export default CheckboxedFilter;
