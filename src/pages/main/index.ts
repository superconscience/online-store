import ProductList from '../../core/components/product-list';
import Sidebar from '../../core/components/sidebar';
import Page from '../../core/templates/page';

class MainPage extends Page {
  static TextObject = {
    MainTitle: 'Main Page',
  };
  $sidebar = new Sidebar();
  $productList = new ProductList();

  constructor(id: string) {
    super(id);
  }

  render() {
    this.container.append(this.$sidebar.render(), this.$productList.render());
    return this.container;
  }
}

export default MainPage;
