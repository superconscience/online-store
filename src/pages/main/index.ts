import Page from '../../core/templates/page';
//import Test from '../../test';
import ProductPreview from '../../components/ProductPreview';
import arrayPhone from '../../Array';

class MainPage extends Page {
  static TextObject = {
    MainTitle: 'Main Page',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(MainPage.TextObject.MainTitle);
    //let test = new Test().render()
    for(let i = 0; i<arrayPhone.length;i++){
      this.container.append(new ProductPreview(arrayPhone[i].title,arrayPhone[i].category, arrayPhone[i].brand, arrayPhone[i].price, 
          arrayPhone[i].discountPercentage, arrayPhone[i].rating, arrayPhone[i].stock, arrayPhone[i].id,arrayPhone[i].images[0]).generatePreview()) 
  }
    this.container.append(title);
   // this.container.append(test);
    return this.container;
  }
}

export default MainPage;
