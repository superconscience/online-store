import Page from '../../core/templates/page';
import Details from '../../core/components/details';
import { data } from '../../data';
import Products from '../../core/components/products';
class DetailsPage extends Page {
  static TextObject = {
    MainTitle: 'detail-page',
  };
  private static data = { ...data };
  private static dataCarts: number;
  constructor() {
    super();
  }
  static getNumProd() {
    return DetailsPage.dataCarts;
  }
  static setNumProd(data: number) {
    DetailsPage.dataCarts = data;
  }
  build() {
    const detailBlock = document.createElement('div');
    detailBlock.className = 'detail-block';
    if (DetailsPage.getNumProd() !== undefined) {
      detailBlock.append(new Details(DetailsPage.data.products[DetailsPage.getNumProd() - 1]).render());
    }
    detailBlock.addEventListener('click', function (event) {
      let isEquals = false;
      const arrCarts = Products.getOrder();
      const elementDetail = DetailsPage.data.products[DetailsPage.getNumProd() - 1];
      const target = event.target as HTMLElement;
      if (target.closest('.btn-img')) {
        const numberPhoto = Number(target.getAttribute('data-id'));
        const grandPhoto = detailBlock.querySelector('.grand-photo') as HTMLElement;
        grandPhoto.innerHTML = `<img  alt="Slide" src="${elementDetail.images[numberPhoto]}" class="img-big"/>`;
      } else if (target.closest('.btn-add-details')) {
        if (arrCarts.length === 0) {
          Products.setOrder(DetailsPage.data.products[Number(target.getAttribute('data-id')) - 1]);
        } else {
          arrCarts.forEach(function (el, i) {
            if (Number(target.getAttribute('data-id')) !== el.id) {
              isEquals = true;
              return arrCarts;
            } else if (Number(target.getAttribute('data-id')) === el.id) {
              arrCarts.splice(i, 1);
              isEquals = false;
              return arrCarts;
            }
          });
        }
        if (isEquals !== false) {
          Products.setOrder(DetailsPage.data.products[Number(target.getAttribute('data-id')) - 1]);
        }
      }
    });
    return detailBlock;
  }
  render() {
    this.container.append(this.build());
    return this.container;
  }
}
export default DetailsPage;
