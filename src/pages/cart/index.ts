import Page from '../../core/templates/page';
import Carts from '../../core/components/carts';
import ModalItem from '../../core/components/modal';
class CartPage extends Page {
  $carts = new Carts().render();
  $modal = new ModalItem().render();
  constructor() {
    super();
  }

  render() {
    const basket = document.createElement('div');
    basket.className = 'basket';
    basket.append(this.$carts, this.$modal);
    this.container.append(basket);
    return this.container;
  }
}

export default CartPage;
