import Products from '../../core/components/products';
import Sidebar from '../../core/components/sidebar';
import Page from '../../core/templates/page';

class MainPage extends Page {
  static TextObject = {
    MainTitle: 'Main Page',
  };
  $sidebar = new Sidebar().render();
  $products = new Products().render();

  constructor() {
    super();
  }

  render() {
    const $store = document.createElement('div');
    $store.className = 'store';
    $store.append(this.$sidebar, this.$products);
    this.container.append($store);
    return this.container;
  }
}

export default MainPage;
