import App from '../pages/app';
import { PageIds, QUERY_VALUE_SEPARATOR } from './constants';
import { QueryKey } from './types';

export const locationQuery = (href = window.location.href, parts = href.split('?')) =>
  parts.length > 1 ? parts.pop() : '';

export const queryHelper = (href = window.location.href) => {
  const query = new URLSearchParams(locationQuery(href));
  const helper = {
    get: (key: QueryKey) => query.get(key),

    set: (key: QueryKey, value: string) => {
      if (value !== '') {
        query.set(key, value);
      } else {
        query.delete(key);
      }
    },

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

    removeFilters: () => {
      const keys: QueryKey[] = ['category', 'brand', 'price', 'stock', 'sort', 'search'];
      keys.forEach((k) => query.delete(k));
    },

    entries: () => query.entries(),

    toString: () => query.toString().replace(/%E2%86%95/g, QUERY_VALUE_SEPARATOR),

    apply: (pageId?: PageIds, search = query.toString()) =>
      (window.location.href = `#${pageId ? pageId : App.pageId}${search ? '?' + search : ''}`),
  };

  return helper;
};

export const datasetHelper = () => {
  return {
    set: <Dataset extends DOMStringMap>($element: HTMLElement, dataset: Dataset) => {
      Object.entries(dataset).forEach(([key, value]) => ($element.dataset[key] = value));
    },
    get: <Dataset extends DOMStringMap>(
      $element: HTMLElement,
      key: keyof Dataset extends string ? keyof Dataset : string
    ) => {
      return $element.dataset[key];
    },
  };
};

type EventCallback = (event: Event, ...args: unknown[]) => void;
type NoEventCallback = (...args: unknown[]) => void;

function isEventCallback(cb: NoEventCallback | EventCallback): cb is EventCallback {
  return true;
}

function isNoEventCallback(cb: NoEventCallback | EventCallback): cb is NoEventCallback {
  return !isEventCallback(cb);
}

export function debounce(cb: NoEventCallback | EventCallback, wait = 20) {
  let h: number | NodeJS.Timeout = 0;
  const callable = isNoEventCallback(cb)
    ? (...args: unknown[]) => {
        clearTimeout(h as NodeJS.Timeout);
        h = setTimeout(() => cb(...args), wait);
      }
    : (event: Event, ...args: unknown[]) => {
        clearTimeout(h as NodeJS.Timeout);
        h = setTimeout(() => cb(event, ...args), wait);
      };
  return <NoEventCallback | EventCallback>(<unknown>callable);
}

export function throttle(cb: NoEventCallback | EventCallback, delay?: number) {
  delay || (delay = 100);
  let throttle: boolean | number | NodeJS.Timeout = false;

  return isNoEventCallback(cb)
    ? (...args: unknown[]) => {
        if (throttle) {
          return;
        }
        throttle = setTimeout(() => {
          cb(...args);
          throttle = false;
        }, delay);
        cb(...args);
      }
    : (event: Event, ...args: unknown[]) => {
        if (throttle) {
          return;
        }
        throttle = setTimeout(() => {
          cb(event, ...args);
          throttle = false;
        }, delay);
        cb(event, ...args);
      };
}

export const formatPrice = (price: number | string) => {
  return '€' + Number(price).toFixed(2);
};

export const replaceWith = <T extends HTMLElement>($element: T, $newElement: T) => {
  $element.replaceWith($newElement);
  return $newElement;
};

export const remove = ($element: HTMLElement | null) => {
  if ($element) {
    $element.remove();
  }
  return null;
};

export const before = ($target: HTMLElement, $element: HTMLElement) => {
  $target.before($element);
  return $element;
};

export const after = ($target: HTMLElement, $element: HTMLElement) => {
  $target.after($element);
  return $element;
};
