import { data } from '../../../data';
import App, { PageIds } from '../../../pages/app';
import { queryHelper } from '../../../utils/functions';
import Filter from '../../templates/filter';
import CheckboxLine from '../checkbox-line';

class CategoryFilter extends Filter {
  private categories: Record<string, { total: number; actual: number }> = {};
  private checkboxLineComponentList: CheckboxLine[] = [];
  private checkboxLineList: HTMLElement[] = [];

  constructor() {
    super('category', 'div', 'category-filter');
    this.fillCategories();
  }

  fillCategories() {
    const products = data.products;
    const actualProducts = App.getProducts();

    products.forEach((p) => {
      if (this.categories[p[this.filterType]] === undefined) {
        this.categories[p[this.filterType]] = { total: 1, actual: 0 };
        return true;
      }
      this.categories[p[this.filterType]].total += 1;
    });

    actualProducts.forEach((p) => {
      this.categories[p[this.filterType]].actual += 1;
    });
    console.log(this.categories);
  }

  filter() {
    return [];
  }

  build() {
    const list = document.createElement('ul');
    list.className = 'category-filter__list';

    Object.entries(this.categories).forEach(([category, { total, actual }]) => {
      const checkboxLineComponent = new CheckboxLine(category, total, actual);
      const checkboxLine = checkboxLineComponent.render();
      this.checkboxLineComponentList.push(checkboxLineComponent);
      this.checkboxLineList.push(checkboxLine);
      list.append(checkboxLine);
    });

    list.addEventListener('change', (event) => {
      const target = event.target as HTMLElement;

      if (target.tagName !== 'INPUT') {
        return;
      }

      const checkbox = target as HTMLInputElement;
      const checked = checkbox.checked;
      const checkBoxLine = checkbox.closest('.checkbox-line') as HTMLElement;
      const index = this.checkboxLineList.indexOf(checkBoxLine);
      const category = this.checkboxLineComponentList[index]?.category;
      const query = queryHelper();

      if (!category) {
        return;
      }

      if (checked) {
        query.add('category', category);
      } else {
        query.remove('category', category);
      }

      window.location.href = `#${PageIds.MainPage}?${query.toString()}`;
    });

    return list;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default CategoryFilter;
