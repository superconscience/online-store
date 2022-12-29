import { Product } from '../../../types';
import Component from '../../templates/components';

class Details extends Component {
  private readonly product: Product;
  constructor(product: Product, tagName = 'div', className = 'block-general-details') {
    super(tagName, className);
    this.product = product;
  }
  generateDetail() {
    const blockDetails = document.createDocumentFragment();
  }
}
export default Details;
