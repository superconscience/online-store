import { Product } from '../../../types';
import Component from '../../templates/components';

class ProductPreview extends Component {
  private readonly product: Product;
  constructor(product: Product, tagName = 'div', className = 'block-general') {
    super(tagName, className);
    this.product = product;
  }

  build() {
    let template = '';
    const title = document.createElement('h3');
    const buttonAddCard = document.createElement('button');
    const buttonDeteils = document.createElement('button');
    const block = document.createElement('div') as HTMLElement;
    // const blockGeneral = document.createElement('div') as HTMLElement;
    const blockGeneral = document.createDocumentFragment();
    const blockButtons = document.createElement('div') as HTMLElement;
    buttonAddCard.textContent = 'ADD TO CARD';
    buttonDeteils.textContent = 'DETAILS';
    buttonAddCard.className = 'btn-preview';
    buttonDeteils.className = 'btn-preview';
    blockButtons.className = 'block-buttons';
    buttonAddCard.setAttribute('data-id', String(this.product.id));
    // blockGeneral.className = 'block-general';
    title.className = 'title-preview';
    // blockGeneral.style.backgroundImage = `url('${this.product.images[0]}')`;
    this.container.style.backgroundImage = `url('${this.product.images[0]}')`;
    block.className = 'block-prev';
    // block.setAttribute('data-id,'eeee');
    this.product.category &&
      (template += `<p class="category__name prev">Category: <span class="prev-value">${this.product.category}</span></p>`);
    this.product.brand &&
      (template += `<p class="brand__name prev">Brand: <span class="prev-value">${this.product.brand}</span></p>`);
    this.product.price &&
      (template += `<p class="price__name prev">Price: <span class="prev-value">${this.product.price}</span></p>`);
    this.product.discountPercentage &&
      (template += `<p class="discount__name prev">Discount: <span class="prev-value">${this.product.discountPercentage}</span></p>`);
    this.product.rating &&
      (template += `<p class="rating__name prev">Rating: <span class="prev-value">${this.product.rating}</span></p>`);
    this.product.stock &&
      (template += `<p class="stock__name prev">Stock: <span class="prev-value">${this.product.stock}</span></p>`);
    title.innerHTML = this.product.title;
    block.innerHTML = template;
    blockButtons.append(buttonAddCard);
    blockButtons.append(buttonDeteils);
    blockGeneral.append(title);
    blockGeneral.append(block);
    blockGeneral.append(blockButtons);
    return blockGeneral;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default ProductPreview;
