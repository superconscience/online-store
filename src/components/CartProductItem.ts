class CartProductItem {
  id: string;
  urlImage: string;
  brand: string;
  description: string;
  discount: number;
  rating: number;
  stock: number;
  price: number;
  constructor(
    id: string,
    urlImage: string,
    brand: string,
    description: string,
    discount: number,
    rating: number,
    stock: number,
    price: number
  ) {
    this.id = id;
    this.urlImage = urlImage;
    this.brand = brand;
    this.description = description;
    this.discount = discount;
    this.rating = rating;
    this.stock = stock;
    this.price = price;
  }
  generateCartProd() {
    let template = '';
    let itemInfo = '';
    let itemdetail = '';
    const blockCard = document.createElement('div') as HTMLElement;
    const blockCardInfo = document.createElement('div') as HTMLElement;
    const blockButtons = document.createElement('div') as HTMLElement;
    const mountItems = document.createElement('div') as HTMLElement;
    blockButtons.className = 'block-buttons';
    blockCardInfo.className = 'block-card-info';
    blockCard.className = 'block-card';
    blockCard.setAttribute('data-id', this.id);
    const buttonInc = document.createElement('button');
    const buttonDec = document.createElement('button');

    this.id && (template += `<div class="id-card">${this.id}</div>`);
    this.urlImage && (itemInfo += `<img src="${this.urlImage}" alt="card-image">`);
    this.brand && (itemdetail += `<div class="title-card-block"><h3 class="title-card-block">${this.brand}</h3></div>`);
    this.description && (itemdetail += `<div class="description-card">${this.description}</div>`);
    this.rating &&
      this.discount &&
      (itemdetail += `<div class="block-other">
    <div class="other-rating">${this.rating}</div><div class="other-stock">${this.discount}</div></div>`);
    blockButtons.append(buttonInc);
    blockButtons.append(buttonDec);
    itemInfo += itemdetail;
    template += itemInfo;
    blockCardInfo.innerHTML = template;
    blockCard.append(blockCardInfo);
    blockCard.append(mountItems);
    blockCard.append(blockButtons);

    let count = 0;
    const amount = this.price;
    let control = 0;
    mountItems.innerHTML = `${count}`;
    buttonInc.addEventListener('click', function () {
      count++;
      control += amount;
      mountItems.innerHTML = `${count}`;
    });

    buttonDec.addEventListener('click', function () {
      if (count > 0) count--;
      control -= amount;
      mountItems.innerHTML = `${count}`;
    });
    console.log(count);
    console.log(amount);
    return document.body.appendChild(blockCard);
  }
}

export default CartProductItem;
