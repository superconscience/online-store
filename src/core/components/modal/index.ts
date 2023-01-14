import americanExpressLogo from '../../../assets/img/american-express-logo.svg';
import cardPlaceholder from '../../../assets/img/card-placeholder.jpg';
import masterCardLogo from '../../../assets/img/master-card-logo.svg';
import visaLogo from '../../../assets/img/visa-logo.png';
import App from '../../../pages/app';
import { PageIds } from '../../../utils/constants';
import {
  datasetHelper,
  validateCardDate,
  validateDeliveryAddress,
  validateEmail,
  validateName,
  validatePhone,
  validatePhoneInput,
} from '../../../utils/functions';
import Component from '../../templates/components';

enum FormField {
  Name = 'name',
  Phone = 'phone',
  Address = 'address',
  Email = 'email',
  CardNumber = 'cardnumber',
  CardDate = 'carddate',
  CardCvv = 'cardcvv',
}

enum CardInitials {
  AmericanExpress = '3',
  Visa = '4',
  MasterCard = '5',
}

type CardInputName = FormField.CardNumber | FormField.CardDate | FormField.CardCvv;

type CardErrorMessageDataset = {
  name: CardInputName;
};

type PersonalValidateFailFunc = (
  $input: HTMLInputElement,
  errorFactory: (errorMessage: string) => HTMLElement,
  errorMessage: string
) => void;

type CardValidateFailFunc = (
  $input: HTMLInputElement,
  $errorContainer: HTMLElement,
  errorFactory: (errorMessage: string, name: CardErrorMessageDataset['name']) => HTMLElement,
  errorMessage: string,
  name: CardErrorMessageDataset['name']
) => void;

const isCardValidateFailFunc = (
  func: PersonalValidateFailFunc | CardValidateFailFunc,
  name: FormField
): func is CardValidateFailFunc => {
  return isCardInputName(name);
};

const isCardInputName = (name: string): name is CardInputName => {
  return name === FormField.CardNumber || name === FormField.CardDate || name === FormField.CardCvv;
};

const errorSpanHtml = (name: string): string => `<span class="error-field-name">${name}</span>`;

const onPersonalValidationFail: PersonalValidateFailFunc = ($element, errorFactory, errorMessage) => {
  const $error = errorFactory(errorMessage);
  $element.nextElementSibling && $element.nextElementSibling.remove();
  $element.after($error);
  $element.setCustomValidity(errorMessage);
};

const onCardValidationFail: CardValidateFailFunc = ($element, $errorContainer, errorFactory, errorMessage, name) => {
  const $error = errorFactory(errorMessage, name);
  $errorContainer.append($error);
  $element.setCustomValidity(errorMessage);
};

const inputFilter = (input: string): boolean => /\w/.test(input) || input === '';
const onlyNumbersFilter = (input: string): boolean => /^\d*$/.test(input);
const cardDateFilter = (input: string): boolean => /^[0-9/]*$/.test(input);

const clipInput = ($target: HTMLInputElement, limit: number): string => {
  const selectionStart = $target.selectionStart;

  let value = $target.value;
  if (value.length > limit) {
    if (selectionStart === limit + 1) {
      value = value.slice(1, limit + 1);
    } else {
      value = value.slice(0, limit);
    }
    $target.value = value;
    $target.setSelectionRange(selectionStart, selectionStart);
  }

  return value;
};

const validation: Record<
  FormField,
  {
    formValidateFunc: ((...args: string[]) => boolean) | ((...args: string[]) => boolean)[];
    onFormValidationFail:
      | PersonalValidateFailFunc
      | CardValidateFailFunc
      | (PersonalValidateFailFunc | CardValidateFailFunc)[];
    onInputCallback?: (event: Event) => void;
    filterFunc: (input: string) => boolean;
    errorMessage: string | string[];
  }
> = {
  name: {
    formValidateFunc: validateName,
    onFormValidationFail: onPersonalValidationFail,
    filterFunc: inputFilter,
    errorMessage: `${errorSpanHtml('Name')} must contain at least 2 words with at least 3 symbols each`,
  },
  phone: {
    formValidateFunc: validatePhone,
    onFormValidationFail: onPersonalValidationFail,
    filterFunc: validatePhoneInput,
    errorMessage: `${errorSpanHtml('Phone number')} must start with "+" and have at least 9 number symbols`,
  },
  address: {
    formValidateFunc: validateDeliveryAddress,
    onFormValidationFail: onPersonalValidationFail,
    filterFunc: inputFilter,
    errorMessage: `${errorSpanHtml('Delivery address')} must contain at least 3 words with at least 5 symbols each`,
  },
  email: {
    formValidateFunc: validateEmail,
    onFormValidationFail: onPersonalValidationFail,
    filterFunc: inputFilter,
    errorMessage: `${errorSpanHtml('E-mail')} is not valid`,
  },
  cardnumber: {
    formValidateFunc: (input: string): boolean => /^\d{16,16}$/.test(input),
    onFormValidationFail: onCardValidationFail,
    errorMessage: `${errorSpanHtml('Card number')} must contain 16 digits`,
    filterFunc: onlyNumbersFilter,
    onInputCallback: (event) => {
      const $target = event.target;
      if (!($target instanceof HTMLInputElement)) {
        return;
      }
      if (!$target.value) {
        return;
      }
      if (!onlyNumbersFilter($target.value)) {
        return;
      }

      const $logo = $target.previousElementSibling;
      if (!($logo instanceof HTMLImageElement)) {
        return;
      }

      const value = clipInput($target, 16);

      switch (value[0]) {
        case CardInitials.AmericanExpress: {
          $logo.src = americanExpressLogo;
          break;
        }
        case CardInitials.Visa: {
          $logo.src = visaLogo;
          break;
        }
        case CardInitials.MasterCard: {
          $logo.src = masterCardLogo;
          break;
        }
        default: {
          $logo.src = cardPlaceholder;
          break;
        }
      }
    },
  },
  carddate: {
    formValidateFunc: [validateCardDate, cardDateFilter],
    onFormValidationFail: [onCardValidationFail, onCardValidationFail],
    errorMessage: [
      `${errorSpanHtml('Card thru')} must contain a valid date (MM/YY)`,
      `${errorSpanHtml('Card thru')} must contain only integers`,
    ],
    filterFunc: cardDateFilter,
    onInputCallback: (event) => {
      if (!(event instanceof InputEvent)) {
        return;
      }
      const $target = event.target;
      if (!($target instanceof HTMLInputElement)) {
        return;
      }
      if (!$target.value) {
        return;
      }
      const value = $target.value;
      if (!/[0-9/]*/.test(value)) {
        return;
      }
      if (event.inputType === 'deleteContentBackward' || event.type === 'deleteContentForward') {
        return;
      }

      if (event.data === '/') {
        $target.value = $target.value.replace(/\//, '');
        return;
      }

      const valueWithoutSep = value.replace(/\//g, '');

      if (valueWithoutSep.length > 4) {
        const [d1, d2, d3, d4] = valueWithoutSep.split('');
        $target.value = d1 + d2 + '/' + d3 + d4;
        return;
      }

      if (value.length === 2) {
        const [d1, d2] = valueWithoutSep.split('');
        $target.value = d1 + d2 + '/';
        return;
      }
    },
  },
  cardcvv: {
    formValidateFunc: (input: string): boolean => /^\d{3,3}$/.test(input),
    onFormValidationFail: onCardValidationFail,
    errorMessage: `${errorSpanHtml('Card CVV')} must contain only 3 digits`,
    filterFunc: onlyNumbersFilter,
    onInputCallback: (event) => {
      const $target = event.target;
      if (!($target instanceof HTMLInputElement)) {
        return;
      }
      if (!$target.value) {
        return;
      }
      if (!onlyNumbersFilter($target.value)) {
        return;
      }

      clipInput($target, 3);
    },
  },
};

function setInputFilter({
  textbox,
  resetErrorCallback,
  inputFilter,
  inputCallback,
  errMsg,
  onValidationFail,
}: {
  textbox: HTMLInputElement;
  resetErrorCallback: () => void;
  inputFilter: (input: string) => boolean;
  inputCallback?: (event: Event) => void;
  errMsg: string;
  onValidationFail?: (textbox: HTMLInputElement, errMsg: string) => void;
}) {
  ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop', 'focusout'].forEach(function (
    event
  ) {
    textbox.addEventListener(event, function (this: typeof textbox, e) {
      if (['keydown', 'mousedown', 'focusout'].indexOf(e.type) >= 0) {
        this.classList.remove(ModalItem.classes.inputError);
        resetErrorCallback();
        this.setCustomValidity('');
      }
      if (e.type === 'input' && inputCallback) {
        inputCallback(e);
      }
      if (inputFilter(this.value)) {
        this.dataset.oldValue = this.value;
        this.dataset.oldSelectionStart = this.selectionStart?.toString();
        this.dataset.oldSelectionEnd = this.selectionEnd?.toString();
      } else if (this.dataset.oldValue) {
        this.classList.add(ModalItem.classes.inputError);
        this.setCustomValidity(errMsg);
        onValidationFail && onValidationFail(this, errMsg);
        this.value = this.dataset.oldValue;
        this.setSelectionRange(Number(this.dataset.oldSelectionStart), Number(this.dataset.oldSelectionEnd));
      } else {
        this.value = '';
      }
    });
  });
}

class ModalItem extends Component {
  static readonly classes = {
    modalContent: 'modal-content',
    creditLogo: 'credit-logo',
    errorMessage: 'error-message',
    cardDetailModal: 'cart-detail-modal',
    cardError: 'card-error',
    inputError: 'input-error',
  };

  constructor(tagName = 'div', className = 'modal') {
    super(tagName, className);
  }

  build(): DocumentFragment {
    let templatePersonData = '';
    let templateCartData = '';
    const $fragment = document.createDocumentFragment();
    const $modalContent = document.createElement('div');
    const $personDetails = document.createElement('div');
    const $cartDetails = document.createElement('div');
    const $button = document.createElement('button');
    const $form = document.createElement('form');
    const $errorContainer = this.buildCardErrorContainer();
    $button.className = 'button-submit';
    $button.type = 'submit';
    $button.textContent = 'CONFIRM';
    $modalContent.className = ModalItem.classes.modalContent;
    $personDetails.className = 'person-detail-modal';
    $cartDetails.className = ModalItem.classes.cardDetailModal;
    $form.className = 'form-modal';
    templatePersonData += `<h2 class="modal-title-person">Personal details</h2>`;
    templatePersonData += `<div class="person-name form-item"><input type="text" name="name"
        placeholder="Name" formcontrolname="personName" class="inp-name input-item"></div>`;
    templatePersonData += ` <div class="phone-name form-item"><input type="text" name="phone"
        placeholder="Phone number" formcontrolname="phoneNumber" class="inp-phone-num input-item"></div>`;
    templatePersonData += `<div class="address form-item"><input  type="text" name="address"
        placeholder="Delivery address" formcontrolname="address" class="inp-address input-item"></div>`;
    templatePersonData += `<div class="email form-item"><input type="text" name="email"
        placeholder="E-mail" formcontrolname="email" class="inp-email input-item"></div>`;
    templateCartData += `<h2 class="modal-title-cart">Credit card details</h2>`;
    templateCartData += `<div  class="card-data">
        <div  class="number">
          <img  alt="credit-logo" class="card-img" src="${cardPlaceholder}" width="40" height="30" >
          <input  type="text" name="cardnumber" formcontrolname="cardNumber" placeholder="Card number" class="cart-number">
        </div>
          <div  class="other-data">
            <div class="valid-data"> VALID: 
            <input  type="text" name="carddate" formcontrolname="cardDate" placeholder="Valid Thru" class="cart-date"></div>
            <div  class="cvv-data"> CVV: <input  type="text" name="cardcvv" formcontrolname="cardCVV" placeholder="Code" class="cart-cvv">
            </div>
          </div>
        </div>`;
    $personDetails.innerHTML = templatePersonData;
    $cartDetails.innerHTML = templateCartData;
    $cartDetails.append($errorContainer);
    $form.append($personDetails);
    $form.append($cartDetails, $button);
    $modalContent.append($form);
    $fragment.append($modalContent);

    $form.noValidate = true;

    Object.entries(validation).forEach(([name, { filterFunc, onInputCallback }]) => {
      const dataset = datasetHelper();
      const $element = $form.elements.namedItem(name);
      if (!($element instanceof HTMLInputElement)) {
        return;
      }
      setInputFilter({
        textbox: $element,
        inputFilter: filterFunc,
        errMsg: 'Invalid',
        inputCallback: onInputCallback,
        resetErrorCallback: () => {
          if (isCardInputName(name)) {
            const $error = [...$errorContainer.children].filter(
              ($child) => $child instanceof HTMLElement && dataset.get<CardErrorMessageDataset>($child, 'name') === name
            );
            $error.forEach(($x) => $x.remove());
          }
        },
      });
    });

    $form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!(event.target instanceof HTMLFormElement)) {
        return;
      }
      const $form = event.target;
      $errorContainer.innerHTML = '';

      Object.entries(validation).forEach(([name, { formValidateFunc, onFormValidationFail, errorMessage }]) => {
        const $element = $form.elements.namedItem(name);
        if (!($element instanceof HTMLInputElement)) {
          return;
        }
        if (Array.isArray(formValidateFunc)) {
          if (!Array.isArray(onFormValidationFail)) {
            throw new Error(`Property onFormValidationFail must be an array`);
          }
          if (!Array.isArray(errorMessage)) {
            throw new Error(`Property errorMessage must be an array`);
          }

          formValidateFunc.forEach((func, i) => {
            if (!func($element.value)) {
              const validateFailFunc = onFormValidationFail[i];
              $element.classList.add(ModalItem.classes.inputError);
              $element.dataset.oldValue = $element.value;

              isCardValidateFailFunc(validateFailFunc, name as FormField)
                ? isCardInputName(name) &&
                  validateFailFunc(
                    $element,
                    $errorContainer,
                    (message, name) => this.buildCardErrorMessage(message, name),
                    errorMessage[i],
                    name
                  )
                : validateFailFunc($element, (message) => this.buildErrorMessage(message), errorMessage[i]);
            }
          });
        } else {
          if (Array.isArray(onFormValidationFail)) {
            throw new Error(`Property onFormValidationFail must be an array`);
          }
          if (Array.isArray(errorMessage)) {
            throw new Error(`Property errorMessage must be an array`);
          }
          if (!formValidateFunc($element.value)) {
            $element.classList.add(ModalItem.classes.inputError);
            $element.dataset.oldValue = $element.value;

            isCardValidateFailFunc(onFormValidationFail, name as FormField)
              ? isCardInputName(name) &&
                onFormValidationFail(
                  $element,
                  $errorContainer,
                  (message, name) => this.buildCardErrorMessage(message, name),
                  errorMessage,
                  name
                )
              : onFormValidationFail($element, (message) => this.buildErrorMessage(message), errorMessage);
          }
        }
      });

      if (!$form.checkValidity()) {
        return;
      }

      let seconds = 3;
      const $timer = document.createElement('span');
      const $finish = document.createElement('div');
      $finish.className = 'order-finish';
      $finish.append(`Thank you! Your order is successful. You will be redirected in `, $timer);
      $timer.className = 'redirect-timer';
      $timer.textContent = seconds.toString();

      $modalContent.innerHTML = '';
      $modalContent.append($finish);

      const interval = setInterval(() => {
        seconds -= 1;
        if (seconds < 0) {
          clearInterval(interval);
          App.setOrders({});
          App.setModal(null);
          window.location.href = `/#${PageIds.MainPage}`;
          return;
        }
        $timer.textContent = seconds.toString();
      }, 1000);
    });

    return $fragment;
  }

  buildCardErrorContainer(): HTMLDivElement {
    const $container = document.createElement('div');
    $container.className = ModalItem.classes.cardError;
    return $container;
  }

  buildErrorMessage(message: string): HTMLDivElement {
    const $error = document.createElement('div');
    $error.className = ModalItem.classes.errorMessage;
    $error.innerHTML = message;

    return $error;
  }

  buildCardErrorMessage(message: string, name: CardErrorMessageDataset['name']): HTMLDivElement {
    const dataset = datasetHelper();
    const $error = document.createElement('div');
    $error.className = ModalItem.classes.errorMessage;
    $error.innerHTML = message;
    dataset.set<CardErrorMessageDataset>($error, { name: name });

    return $error;
  }

  render(): HTMLElement {
    this.container.append(this.build());

    this.container.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      if (!event.target.closest(`.${ModalItem.classes.modalContent}`)) {
        App.setModal(null);
      }
    });
    return this.container;
  }
}
export default ModalItem;
