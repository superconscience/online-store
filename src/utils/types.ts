import { Product } from '../types';
import { PageIds } from './constants';

export type Query = Partial<
  Record<
    Extract<keyof Product, 'category' | 'brand' | 'price' | 'stock'> | 'sort' | 'search' | 'big' | 'page' | 'limit',
    string
  >
>;

export type QueryKey = keyof Query;

export type QueryHelper = {
  get: (key: QueryKey) => string | null;
  set: (key: QueryKey, value: string) => void;
  has: (key: QueryKey) => boolean;
  add: (key: QueryKey, value: string) => void;
  remove: (key: QueryKey, value: string) => void;
  removeFilters: () => void;
  entries: () => IterableIterator<[string, string]>;
  toString: () => string;
  apply: (pageId?: PageIds, search?: string) => void;
};

export type DatasetHelper = {
  set: <Dataset extends DOMStringMap>($element: HTMLElement, dataset: Dataset) => void;
  get: <Dataset extends DOMStringMap>(
    $element: HTMLElement,
    key: keyof Dataset extends string ? keyof Dataset : string
  ) => string | undefined;
};

export type EventCallback = (event: Event, ...args: unknown[]) => void;
export type NoEventCallback = (...args: unknown[]) => void;

export type DeboucedFn = EventCallback | NoEventCallback;
export type ThrottleFn = DeboucedFn;
