class ProductPreview {
  title: string;
  id: number;
  category: string;
  brand: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  urlImage: string;
  constructor(
    title: string,
    category: string,
    brand: string,
    price: number,
    discount: number,
    rating: number,
    stock: number,
    id: number,
    urlImage: string
  ) {
    this.title = title;
    this.category = category;
    this.brand = brand;
    this.price = price;
    this.discount = discount;
    this.rating = rating;
    this.stock = stock;
    this.id = id;
    this.urlImage = urlImage;
  }
  generatePreview() {
    let template = '';
    const title = document.createElement('h3');
    const buttonAddCard = document.createElement('button');
    const buttonDeteils = document.createElement('button');
    const block = document.createElement('div') as HTMLElement;
    const blockGeneral = document.createElement('div') as HTMLElement;
    const blockButtons = document.createElement('div') as HTMLElement;
    buttonAddCard.textContent = 'ADD TO CARD';
    buttonDeteils.textContent = 'DETAILS';
    buttonAddCard.className = 'btn-preview';
    buttonDeteils.className = 'btn-preview';
    blockButtons.className = 'block-buttons';
    blockGeneral.className = 'block-general';
    title.className = 'title-preview';
    blockGeneral.style.backgroundImage = `url('${this.urlImage}')`;
    block.className = 'block-prev';
    // block.setAttribute('data-id,'eeee');
    this.category &&
      (template += `<p class="category__name prev">Category: <span class="prev-value">${this.category}</span></p>`);
    this.brand && (template += `<p class="brand__name prev">Brand: <span class="prev-value">${this.brand}</span></p>`);
    this.price && (template += `<p class="price__name prev">Price: <span class="prev-value">${this.price}</span></p>`);
    this.discount &&
      (template += `<p class="discount__name prev">Discount: <span class="prev-value">${this.discount}</span></p>`);
    this.rating &&
      (template += `<p class="rating__name prev">Rating: <span class="prev-value">${this.rating}</span></p>`);
    this.stock && (template += `<p class="stock__name prev">Stock: <span class="prev-value">${this.stock}</span></p>`);
    title.innerHTML = this.title;
    block.innerHTML = template;
    blockButtons.append(buttonAddCard);
    blockButtons.append(buttonDeteils);
    blockGeneral.append(title);
    blockGeneral.append(block);
    blockGeneral.append(blockButtons);
    return blockGeneral;
  }
}

export default ProductPreview;
