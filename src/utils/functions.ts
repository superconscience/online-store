import moment from 'moment';
import App from '../pages/app';
import { PageIds, QUERY_VALUE_SEPARATOR } from './constants';
import { DatasetHelper, DeboucedFn, EventCallback, NoEventCallback, QueryHelper, QueryKey, ThrottleFn } from './types';

export const locationQuery = (href?: string): string => {
  const parts = (href || window.location.href).split('?');
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

export const queryHelper = (href?: string): QueryHelper => {
  const lq = locationQuery(href);
  const query = new URLSearchParams(lq);
  const helper = {
    get: (key: QueryKey): string | null => query.get(key),

    set: (key: QueryKey, value: string): void => {
      if (value !== '') {
        query.set(key, value);
      } else {
        query.delete(key);
      }
    },

    has: (key: QueryKey): boolean => query.has(key),

    add: (key: QueryKey, value: string): void => {
      const currentValue = query.get(key);

      if (currentValue === null) {
        query.set(key, value);
      } else {
        query.set(key, [...new Set([...currentValue.split(QUERY_VALUE_SEPARATOR), value])].join(QUERY_VALUE_SEPARATOR));
      }
    },

    remove: (key: QueryKey, value: string): void => {
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

    removeFilters: (): void => {
      const keys: QueryKey[] = ['category', 'brand', 'price', 'stock', 'sort', 'search'];
      keys.forEach((k) => query.delete(k));
    },

    entries: (): IterableIterator<[string, string]> => query.entries(),

    toString: (): string => query.toString().replace(/%E2%86%95/g, QUERY_VALUE_SEPARATOR),

    apply: (pageId?: PageIds, search = query.toString()): void => {
      window.location.href = `#${pageId ? pageId : App.pageId}${search ? '?' + search : ''}`;
    },
  };

  return helper;
};

export const datasetHelper = (): DatasetHelper => {
  return {
    set: <Dataset extends DOMStringMap>($element: HTMLElement, dataset: Dataset): void => {
      Object.entries(dataset).forEach(([key, value]) => ($element.dataset[key] = value));
    },
    get: <Dataset extends DOMStringMap>(
      $element: HTMLElement,
      key: keyof Dataset extends string ? keyof Dataset : string
    ): string | undefined => {
      return $element.dataset[key];
    },
  };
};

function isEventCallback(cb: NoEventCallback | EventCallback): cb is EventCallback {
  return true;
}

function isNoEventCallback(cb: NoEventCallback | EventCallback): cb is NoEventCallback {
  return !isEventCallback(cb);
}

export function debounce(cb: NoEventCallback, wait: number): NoEventCallback;
export function debounce(cb: EventCallback, wait: number): EventCallback;
export function debounce(
  cb: DeboucedFn,
  wait = 20
): DeboucedFn extends NoEventCallback ? NoEventCallback : EventCallback {
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
  return <DeboucedFn extends NoEventCallback ? NoEventCallback : EventCallback>(<unknown>callable);
}

export function throttle(cb: NoEventCallback, delay?: number): NoEventCallback;
export function throttle(cb: EventCallback, delay?: number): EventCallback;
export function throttle(
  cb: ThrottleFn,
  delay?: number
): ThrottleFn extends NoEventCallback ? NoEventCallback : EventCallback {
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

export const formatPrice = (price: number | string): string => {
  return '€' + Number(price).toFixed(2);
};

export const replaceWith = <T extends HTMLElement>($element: T, $newElement: T): T => {
  $element.replaceWith($newElement);
  return $newElement;
};

export const remove = ($element: HTMLElement | null): null => {
  if ($element) {
    $element.remove();
  }
  return null;
};

export const before = ($target: HTMLElement, $element: HTMLElement): HTMLElement => {
  $target.before($element);
  return $element;
};

export const after = ($target: HTMLElement, $element: HTMLElement): HTMLElement => {
  $target.after($element);
  return $element;
};

export const validateEmail = (email: string): boolean => {
  return Boolean(
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  );
};

export const validateByCountAndLength = (input: string, minCount: number, minLength: number): boolean => {
  if (input !== input.trim()) {
    return false;
  }
  const words = input.split(' ');
  if (words.length < minCount) {
    return false;
  }
  if (words.some((x) => x.length < minLength)) {
    return false;
  }
  return true;
};

export const validateName = (name: string): boolean => {
  return validateByCountAndLength(name, 2, 3);
};

export const validateDeliveryAddress = (address: string): boolean => {
  return validateByCountAndLength(address, 3, 5);
};

export const validatePhone = (phone: string): boolean => {
  return /^\+[0-9]{9,}$/.test(phone);
};

export const validatePhoneInput = (input: string): boolean => {
  const regExp = /[+0-9]/;
  return input.length > 1 ? input.split('').every((x) => regExp.test(x)) : regExp.test(input);
};

export const validateCardDate = (input: string): boolean => {
  const [d1, d2, sep, d3, d4] = input.split('');
  sep && 0;
  if ([d1, d2, d3, d4].some((x) => !/^[0-9]{1,1}$/.test(x))) {
    return false;
  }
  const creditCardDate = moment(d3 + d4 + d1 + d2, 'YYMM');
  const today = moment();

  return creditCardDate.isValid() && today < creditCardDate.add(1, 'months');
};

export const isValidQueryParams = (): boolean => {
  const query = queryHelper();
  const validParamNames: QueryKey[] = ['big', 'brand', 'category', 'limit', 'page', 'price', 'search', 'sort', 'stock'];
  return [...query.entries()].every(([p]) => validParamNames.some((vp) => vp === p));
};
