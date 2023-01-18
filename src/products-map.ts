import { data } from './data';
import { ProductsMap } from './types';

const products = data.products;

export const productsMap: ProductsMap = Object.fromEntries(products.map((p) => [p.id, p]));
