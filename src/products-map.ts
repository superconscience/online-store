import { data } from './data';

const products = data.products;

export const productsMap = Object.fromEntries(products.map((p) => [p.id, p]));
