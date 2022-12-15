class ProductPreview {
  id: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  constructor(
    category: string,
    brand: string,
    price: number,
    discount: number,
    rating: number,
    stock: number,
    id: string
  ) {
    this.category = category;
    this.brand = brand;
    this.price = price;
    this.discount = discount;
    this.rating = rating;
    this.stock = stock;
    this.id = id;
  }
  generatePreview() {
    let template = '';
    const block = document.createElement('div') as HTMLElement;
    block.className = 'block-smartphone';
    block.setAttribute('data-id', this.id);
    this.category &&
      (template += `<p class="category__name prev">Category: <span class="prev-value">${this.category}</span></p>`);
    this.brand && (template += `<p class="brand__name prev">Brand: <span class="prev-value">${this.brand}</span></p>`);
    this.price && (template += `<p class="price__name prev">Price: <span class="prev-value">${this.price}</span></p>`);
    this.discount &&
      (template += `<p class="discount__name prev">Discount: <span class="prev-value">${this.discount}</span></p>`);
    this.rating &&
      (template += `<p class="rating__name prev">Rating: <span class="prev-value">${this.rating}</span></p>`);
    this.stock && (template += `<p class="stock__name prev">Stock: <span class="prev-value">${this.stock}</span></p>`);
    block.innerHTML = template;
    return document.body.appendChild(block);
  }
}

export default ProductPreview;
