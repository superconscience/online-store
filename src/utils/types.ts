import { Product } from '../types';

export type Query = Partial<
  Record<Extract<keyof Product, 'category' | 'brand' | 'price' | 'stock'> | 'sort' | 'search', string>
>;
