import { Product } from '../types';

export type Query = Partial<
  Record<
    Extract<keyof Product, 'category' | 'brand' | 'price' | 'stock'> | 'sort' | 'search' | 'big' | 'page' | 'limit',
    string
  >
>;

export type QueryKey = keyof Query;

export type EventCallback = (event: Event, ...args: unknown[]) => void;
export type NoEventCallback = (...args: unknown[]) => void;

export type DeboucedFn = EventCallback | NoEventCallback;
export type ThrottleFn = DeboucedFn;
