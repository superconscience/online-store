import App, { PageIds } from '../pages/app';
import { QUERY_VALUE_SEPARATOR } from './constants';
import { Query } from './types';

export const locationQuery = (parts = window.location.href.split('?')) => (parts.length > 1 ? parts.pop() : '');

export const queryHelper = () => {
  type QueryKey = keyof Query;

  const query = new URLSearchParams(locationQuery());
  const helper = {
    get: (key: QueryKey) => query.get(key),

    set: (key: QueryKey, value: string) => query.set(key, value),

    has: (key: QueryKey) => query.has(key),

    add: (key: QueryKey, value: string) => {
      const currentValue = query.get(key);

      if (currentValue === null) {
        query.set(key, value);
      } else {
        query.set(key, [...new Set([...currentValue.split(QUERY_VALUE_SEPARATOR), value])].join(QUERY_VALUE_SEPARATOR));
      }
    },

    remove: (key: QueryKey, value: string) => {
      const currentValue = query.get(key);
      if (currentValue !== null) {
        const newValue = currentValue
          .split(QUERY_VALUE_SEPARATOR)
          .filter((x) => x !== value)
          .join(QUERY_VALUE_SEPARATOR);
        if (newValue) {
          query.set(
            key,
            currentValue
              .split(QUERY_VALUE_SEPARATOR)
              .filter((x) => x !== value)
              .join(QUERY_VALUE_SEPARATOR)
          );
        } else {
          query.delete(key);
        }
      }
    },

    entries: () => query.entries(),

    toString: () => query.toString().replace(/%E2%86%95/g, QUERY_VALUE_SEPARATOR),

    apply: (pageId?: PageIds) => (window.location.href = `#${pageId ? pageId : App.pageId}?${query.toString()}`),
  };

  return helper;
};
