import App from '../../../pages/app';
import { Product } from '../../../types';
import { PageIds } from '../../../utils/constants';
import { formatPrice } from '../../../utils/functions';
import Component from '../../templates/components';

const productItemClassName = 'product-item';

class ProductPreview extends Component {
  private readonly product: Product;
  static readonly classes = {
    addToCart: 'add-to-cart',
    dropFromCart: 'drop-from-cart',
  };

  constructor(product: Product, tagName = 'li', className = 'product-preview') {
    super(tagName, className);
    this.product = product;
    if (this.isOrdered()) {
      this.container.classList.add('in-cart');
    }
  }

  build() {
    const infoListKeys: Extract<
      keyof Product,
      'category' | 'brand' | 'price' | 'discountPercentage' | 'rating' | 'stock'
    >[] = ['category', 'brand', 'price', 'discountPercentage', 'rating', 'stock'];
    const isOrdered = this.isOrdered();
    const $item = document.createElement('div');
    const $itemWrapper = document.createElement('div');
    const $itemText = document.createElement('div');
    const $itemButtons = document.createElement('div');
    const $buttonAddToCart = document.createElement('button');
    const $buttonDetails = document.createElement('a');
    const $itemTitle = document.createElement('h4');
    const $itemInfo = document.createElement('div');
    const $itemInfoList = document.createElement('ul');

    $item.className = productItemClassName;
    $item.append($itemWrapper);

    $itemWrapper.className = `${productItemClassName}__wrapper`;
    $itemWrapper.style.background = `url(${this.product.thumbnail}) 0% 0% / cover`;
    $itemWrapper.append($itemText, $itemButtons);

    $itemText.className = `${productItemClassName}__text`;
    $itemText.append($itemTitle, $itemInfo);

    $itemInfo.className = `${productItemClassName}__info`;
    $itemInfo.append($itemInfoList);

    $itemButtons.className = `${productItemClassName}__buttons`;
    $itemButtons.append($buttonAddToCart, $buttonDetails);

    $buttonAddToCart.className = `${productItemClassName}__button`;
    $buttonAddToCart.dataset.id = this.product.id.toString();
    $buttonAddToCart.textContent = isOrdered ? 'Drop from cart' : 'Add to cart';
    $buttonAddToCart.classList.add(isOrdered ? ProductPreview.classes.dropFromCart : ProductPreview.classes.addToCart);

    $buttonDetails.className = `${productItemClassName}__button show-details`;
    $buttonDetails.href = `/#${PageIds.ProductDetails}/${this.product.id}`;
    $buttonDetails.textContent = 'Details';

    $itemTitle.className = `${productItemClassName}__title`;
    $itemTitle.textContent = this.product.title;

    $itemInfoList.className = `${productItemClassName}__info-list`;

    infoListKeys.forEach((key) => {
      const $item = document.createElement('li');
      const $label = document.createElement('span');
      $itemInfoList.append($item);

      let label: string = key;
      label = label.slice(0, 1).toUpperCase() + label.slice(1);
      if (key === 'discountPercentage') {
        label = 'Discount';
      }
      label += ': ';

      let value = this.product[key];
      if (key === 'price') {
        value = formatPrice(value);
      } else if (key === 'discountPercentage') {
        value += '%';
      }

      $item.className = `${productItemClassName}__info-list-item`;
      $item.append($label, String(value));

      $label.className = `${productItemClassName}__info-list-item-label`;
      $label.textContent = label;
    });

    return $item;
  }

  private isOrdered() {
    return App.getOrders()[this.product.id] !== undefined;
  }

  render() {
    this.container.append(this.build());
    return this.container;
  }
}

export default ProductPreview;
