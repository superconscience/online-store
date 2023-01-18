import App from '../../../pages/app';
import { PromoCodes, PromoCodesKeys } from '../../../types';
import { promoCodes } from '../../../utils/constants';
import { after, before, datasetHelper, formatPrice, remove, replaceWith } from '../../../utils/functions';
import Component from '../../templates/components';
import ModalItem from '../modal';

type PromoDataset = {
  promo: string;
};

const cartSummaryClassName = 'cart-summary';
const elementClassName = (element: string): string => `${cartSummaryClassName}__${element}`;

const promoHeading = (text: PromoCodes[string]['text'], discount: PromoCodes[string]['discount']): string =>
  `${text} - ${discount * 100}% `;

class CartSummary extends Component {
  static readonly classes = {
    cartSummary: cartSummaryClassName,
    heading: elementClassName('heading'),
    totalItem: elementClassName('total-item'),
    totalItemLabel: elementClassName('total-item-label'),
    promoCode: elementClassName('promo-code'),
    promoCodeInput: elementClassName('promo-code-input'),
    enterPromoCode: 'enter-promo-code',
    promoResult: elementClassName('promo-result'),
    promoAdd: elementClassName('promo-add'),
    promoEx: elementClassName('promo-ex'),
    appliedPromo: elementClassName('applied-promo'),
    appliedPromoHeading: elementClassName('applied-promo-heading'),
    appliedPromoItem: elementClassName('applied-promo-item'),
    appliedPromoDrop: elementClassName('applied-promo-drop'),
    buyNow: elementClassName('buy-now'),
    oldPrice: 'old-price',
  };

  $promoCode: HTMLElement;
  $promoCodeInput: HTMLInputElement;
  $totalProducts: HTMLElement;
  $totalPrice: HTMLElement;

  $totalPriceWithPromo: HTMLElement | null = null;
  $promoResult: HTMLElement | null = null;
  $appliedPromo: HTMLElement | null = null;

  private _promoDiscount = 0;
  private _appliedPromoCodes: PromoCodesKeys = [];

  get appliedPromoCodes(): PromoCodesKeys {
    return this._appliedPromoCodes;
  }

  set appliedPromoCodes(value: PromoCodesKeys) {
    this._appliedPromoCodes = value;
    App.setAppliedPromoCodes(value);
    this.promoDiscount = this._appliedPromoCodes.reduce((total, promo) => promoCodes[promo].discount + total, 0);
  }

  get promoDiscount(): number {
    return this._promoDiscount;
  }

  set promoDiscount(value: number) {
    this._promoDiscount = value;
    this.refreshTotalPrice();
    this.refreshTotalPriceWithPromo();
  }

  constructor() {
    super('div', CartSummary.classes.cartSummary);

    this.$promoCodeInput = this.buildPromoCodeInput();
    this.$promoCode = this.buildPromoCode();
    this.$totalProducts = this.buildTotalProducts();
    this.$totalPrice = this.buildTotalPrice();

    this.appliedPromoCodes = App.getAppliedPromoCodes();
  }

  build(): DocumentFragment {
    const $fragment = document.createDocumentFragment();
    const $heading = document.createElement('h2');
    const $totalProducts = this.$totalProducts;
    const $totalPrice = this.$totalPrice;
    const $promoCode = this.$promoCode;
    const $promoCodeInput = this.$promoCodeInput;
    const $promoEx = document.createElement('p');
    const $buyNow = document.createElement('button');

    $fragment.append($heading, $totalProducts, $totalPrice, $promoCode, $promoEx, $buyNow);

    $heading.className = CartSummary.classes.heading;
    $heading.textContent = 'Summary';

    $promoCode.className = CartSummary.classes.promoCode;
    $promoCode.append($promoCodeInput);

    $promoEx.className = CartSummary.classes.promoEx;
    $promoEx.textContent = `Promo for test: 'RS', 'EPM'`;

    $buyNow.className = CartSummary.classes.buyNow;
    $buyNow.textContent = 'Buy now';

    $buyNow.addEventListener('click', () => {
      App.setModal(new ModalItem().render());
    });

    $promoCodeInput.addEventListener('input', (event) => {
      if (!(event.target instanceof HTMLInputElement)) {
        return;
      }
      if (!this.$promoCode) {
        return;
      }

      this.refreshPromoResult(event.target.value);
    });

    return $fragment;
  }

  buildTotalItem(label: string, value: string): HTMLParagraphElement {
    const $root = document.createElement('p');
    const $label = document.createElement('span');

    $root.className = CartSummary.classes.totalItem;
    $root.append($label, value);

    $label.className = CartSummary.classes.totalItemLabel;
    $label.textContent = label;

    return $root;
  }

  buildTotalProducts(): HTMLParagraphElement {
    return this.buildTotalItem('Products: ', App.getOrdersTotalQuantity().toString());
  }

  buildTotalPrice(): HTMLParagraphElement {
    return this.buildTotalItem('Total: ', formatPrice(App.getOrdersTotalPrice()));
  }

  buildTotalPriceWithPromo(): HTMLParagraphElement {
    return this.buildTotalItem('Total: ', formatPrice(App.getOrdersTotalPrice() * (1 - this._promoDiscount)));
  }

  buildPromoCodeInput(): HTMLInputElement {
    const $input = document.createElement('input');

    $input.className = CartSummary.classes.promoCodeInput;
    $input.classList.add(CartSummary.classes.enterPromoCode);
    $input.type = 'search';
    $input.placeholder = 'Enter promo code';

    return $input;
  }

  buildPromoCode(): HTMLDivElement {
    const $promoCode = document.createElement('div');

    $promoCode.className = CartSummary.classes.promoCode;

    return $promoCode;
  }

  buildPromoResult(promoCode: string): HTMLDivElement | null {
    const normalizedPromoCode = promoCode.toLowerCase();

    const $promoResult = document.createElement('div');
    const $promoAdd = document.createElement('button');
    const promoResult = promoCodes[normalizedPromoCode];

    if (promoResult === undefined) {
      return null;
    }

    const dataset = datasetHelper();
    const { text, discount } = promoResult;
    const promoText = promoHeading(text, discount);

    $promoResult.className = CartSummary.classes.promoResult;
    $promoResult.append(promoText);

    if (!this.appliedPromoCodes.includes(normalizedPromoCode)) {
      $promoResult.append($promoAdd);
      $promoAdd.className = CartSummary.classes.promoAdd;
      $promoAdd.textContent = 'Add';
      dataset.set<PromoDataset>($promoAdd, { promo: normalizedPromoCode });
    }

    return $promoResult;
  }

  buildAppliedPromo(): HTMLDivElement | null {
    if (this.appliedPromoCodes.length === 0) {
      return null;
    }

    const dataset = datasetHelper();
    const $promo = document.createElement('div');
    const $heading = document.createElement('h3');
    const $list = document.createElement('ul');

    $promo.className = CartSummary.classes.appliedPromo;
    $promo.append($heading, $list);

    $heading.className = CartSummary.classes.appliedPromoHeading;
    $heading.textContent = 'Applied codes';

    this.appliedPromoCodes.forEach((promo) => {
      const { text, discount } = promoCodes[promo];
      const $item = document.createElement('li');
      const $button = document.createElement('button');

      $item.className = CartSummary.classes.appliedPromoItem;
      $item.append(promoHeading(text, discount), $button);

      $button.className = CartSummary.classes.appliedPromoDrop;
      $button.textContent = 'Drop';
      dataset.set<PromoDataset>($button, { promo });

      $list.append($item);
    });

    return $promo;
  }

  refreshTotalProducts(): void {
    this.$totalProducts = replaceWith(this.$totalProducts, this.buildTotalProducts());
  }

  refreshTotalPrice(): void {
    const $newTotalPrice = this.buildTotalPrice();

    if (this._promoDiscount > 0) {
      $newTotalPrice.classList.add(CartSummary.classes.oldPrice);
    }

    this.$totalPrice = replaceWith(this.$totalPrice, $newTotalPrice);
  }

  refreshTotalPriceWithPromo(): void {
    this.$totalPriceWithPromo = remove(this.$totalPriceWithPromo);

    if (this.promoDiscount === 0) {
      return;
    }

    this.$totalPriceWithPromo = after(this.$totalPrice, this.buildTotalPriceWithPromo());
  }

  refreshPromoResult(value?: string): void {
    const $promoResult = this.buildPromoResult(value || '');

    this.$promoResult = remove(this.$promoResult);

    if ($promoResult) {
      this.$promoResult = after(this.$promoCode, $promoResult);
    }
  }

  refreshAppliedPromo(): void {
    this.$appliedPromo = remove(this.$appliedPromo);

    const $newAppliedPromo = this.buildAppliedPromo();

    if ($newAppliedPromo) {
      this.$appliedPromo = before(this.$promoCode, $newAppliedPromo);
    }
  }

  refreshOnOrder(): void {
    this.refreshTotalProducts();
    this.refreshTotalPrice();
    this.refreshTotalPriceWithPromo();
  }

  render(): HTMLElement {
    this.container.append(this.build());
    this.refreshTotalPriceWithPromo();
    this.refreshAppliedPromo();

    this.container.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      if (!event.target.classList.contains(CartSummary.classes.promoAdd)) {
        return;
      }

      const dataset = datasetHelper();
      const promoCode = dataset.get<PromoDataset>(event.target, 'promo');

      if (promoCode === undefined) {
        return;
      }

      this.appliedPromoCodes = [...new Set([...this.appliedPromoCodes, promoCode])];

      this.refreshAppliedPromo();
      this.refreshPromoResult(this.$promoCodeInput.value);
    });

    this.container.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      if (!event.target.classList.contains(CartSummary.classes.appliedPromoDrop)) {
        return;
      }

      const dataset = datasetHelper();
      const promoCode = dataset.get<PromoDataset>(event.target, 'promo');

      if (promoCode === undefined) {
        return;
      }

      this.appliedPromoCodes = this.appliedPromoCodes.filter((x) => x !== promoCode);

      this.refreshAppliedPromo();
      this.refreshPromoResult(this.$promoCodeInput.value);
    });
    return this.container;
  }
}

export default CartSummary;
