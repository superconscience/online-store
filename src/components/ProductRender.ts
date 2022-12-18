import ProductPreview from './ProductPreview';
import arrayPhone from '../Array';

interface call{
    title:string,
    category: string,
    brand: string,
    price: number,
    rating: number,
    stock: number,
    id: number,
    images:string[],
    description:string,
    discountPercentage:number
    thumbnail:string
    
}



class ProductRender {
    getRenderProd(){
        for(let i = 0; i<arrayPhone.length;i++){
            new ProductPreview(arrayPhone[i].title,arrayPhone[i].category, arrayPhone[i].brand, arrayPhone[i].price, 
                arrayPhone[i].discountPercentage, arrayPhone[i].rating, arrayPhone[i].stock, arrayPhone[i].id,arrayPhone[i].images[0]).generatePreview() 
        }
    }
}



export default ProductRender