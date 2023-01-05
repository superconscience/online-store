import Component from '../../templates/components';

class ModalItem extends Component {
  constructor(tagName = 'div', className = 'block-general-modal') {
    super(tagName, className);
  }

  build() {
    let templatePersonData = '';
    let templateCartData = '';
    const blockGeneralModal = document.createDocumentFragment();
    const modal = document.createElement('div') as HTMLElement;
    const modalContent = document.createElement('div') as HTMLElement;
    const personDetails = document.createElement('div') as HTMLElement;
    const cartDetails = document.createElement('div') as HTMLElement;
    const button = document.createElement('button');
    const formModal = document.createElement('FORM');
    button.className = 'button-submit';
    button.textContent = 'CONFIRM';
    modal.className = 'modal';
    modalContent.className = 'modal-content';
    personDetails.className = 'person-detail-modal';
    cartDetails.className = 'cart-detail-modal';
    formModal.className = 'form-modal';
    templatePersonData += `<h2 class="modal-title-person">Personal details</h2>`;
    templatePersonData += `<div class="person-name form-item"><input type="text" 
        placeholder="Name" formcontrolname="personName" class="inp-name input-item"></div>`;
    templatePersonData += ` <div class="phone-name form-item"><input type="text" 
        placeholder="Phone number" formcontrolname="phoneNumber" class="inp-phone-num input-item"></div>`;
    templatePersonData += `<div class="adress form-item"><input  type="text" 
        placeholder="Delivery address" formcontrolname="adress" class="inp-adress input-item"></div>`;
    templatePersonData += `<div class="email form-item"><input type="text" 
        placeholder="E-mail" formcontrolname="email" class="inp-email input-item"></div>`;
    templateCartData += `<h2 class="modal-title-cart">Credit card details</h2>`;
    templateCartData += `<div  class="card-data">
        <div  class="number">
          <img  alt="credit-logo" class="card-img" src="https://i.guim.co.uk/img/media/b73cc57cb1d46ae742efd06b6c58805e8600d482/16_0_2443_1466/master/2443.jpg?width=700&amp;quality=85&amp;auto=format&amp;fit=max&amp;s=fb1dca6cdd4589cd9ef2fc941935de71">
          <input  type="text" formcontrolname="cardNumber" placeholder="Card number" class="cart-number">
        </div>
          <div  class="other-data">
            <div class="valid-data"> VALID: 
            <input  type="text" formcontrolname="cardDate" placeholder="Valid Thru" class="cart-date"></div>
            <div  class="cvv-data"> CVV: <input  type="text" formcontrolname="cardCVV" placeholder="Code" class="cart-cvv">
            </div>
          </div>
        </div>`;
    personDetails.innerHTML = templatePersonData;
    cartDetails.innerHTML = templateCartData;
    formModal.append(personDetails);
    formModal.append(cartDetails, button);
    modalContent.append(formModal);
    modal.append(modalContent);
    blockGeneralModal.append(modal);
    return blockGeneralModal;
  }
  render() {
    this.container.append(this.build());
    return this.container;
  }
}
export default ModalItem;
