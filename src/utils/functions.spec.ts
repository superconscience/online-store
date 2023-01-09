import 'jest';
import {
  datasetHelper,
  debounce,
  formatPrice,
  locationQuery,
  throttle,
  validateByCountAndLength,
  validateCardDate,
  validateEmail,
  validatePhone,
  validatePhoneInput,
} from './functions';
import moment from 'moment';
import { rnd } from '../test/utils';

jest.useFakeTimers();

let counter = 1;
const createTitle = (text: string) => `${counter++}) ${text}`;

describe('Util functions', () => {
  it(createTitle('formatPrice should return a formatted price'), () => {
    const stringPrice = 12;
    const numberPrice = '12';
    const expected = '€12.00';
    expect(formatPrice(stringPrice)).toEqual(expected);
    expect(formatPrice(numberPrice)).toEqual(expected);
  });

  it(createTitle('validateEmail should return true for valid email and false for invalid email'), () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'test.example.com';
    expect(validateEmail(validEmail)).toEqual(true);
    expect(validateEmail(invalidEmail)).toEqual(false);
  });

  it(createTitle('validatePhone should return true for valid phone and false for invalid phone'), () => {
    const validPhones = ['+3812345678', '+3812345678912'];
    const invalidPhones = ['3+812345678', '38123456789+', '+381'];
    validPhones.forEach((phone) => expect(validatePhone(phone)).toEqual(true));
    invalidPhones.forEach((phone) => expect(validatePhone(phone)).toEqual(false));
  });

  it(createTitle('validatePhoneInput should return true for input with "+" and digits and false otherwise'), () => {
    const validInputs = `+0123456789`.split('');
    const symbols = `~!@#$%^&*()_-={}[]:;"'|/?.>,<№`.split('');
    const alphabet = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`.split('');
    validInputs.forEach((c) => expect(validatePhoneInput(c)).toEqual(true));
    symbols.forEach((c) => expect(validatePhoneInput(c)).toEqual(false));
    alphabet.forEach((c) => expect(validatePhoneInput(c)).toEqual(false));
  });

  it(createTitle('validateCardDate should return false for expired dates and true otherwise'), () => {
    const format = 'MM/YY';
    const validDateString = moment().format(format);
    const expiredDateString = moment().subtract(1, 'month').format(format);
    const invalidDateStrings = [0, 1, 3, 4].map((i) => {
      const symbols = validDateString.replace('/', '').split('');
      symbols.splice(i, 0, '/');
      return symbols.join('');
    });
    expect(validateCardDate(validDateString)).toEqual(true);
    expect(validateCardDate(expiredDateString)).toEqual(false);
    invalidDateStrings.forEach((s) => expect(validateCardDate(s)).toEqual(false));
  });

  it(
    createTitle(
      'validateByCountAndLength should return true if number and length of words satisfies the requirements set by function arguments and false if otherwise'
    ),
    () => {
      const [count, length] = [3, 3];
      const createInput = (count: number, length: number) =>
        Array(count)
          .fill(0)
          .map(() => rnd(length))
          .join(' ');
      const validInput = createInput(count, length);
      const invalidInputs = [
        createInput(2, 3),
        createInput(3, 2),
        ' ' + validInput + ' ',
        ' ' + validInput,
        validInput + ' ',
      ];

      expect(validateByCountAndLength(validInput, count, length)).toEqual(true);
      invalidInputs.forEach((x) => expect(validateByCountAndLength(x, count, length)).toEqual(false));
    }
  );

  it(createTitle('locationQuery should return search params of the input url'), () => {
    const param = 'category=smartphones';
    const url = `https://online-store/?${param}`;
    const expected = param;
    expect(locationQuery(url)).toEqual(expected);
  });

  it(createTitle('datasetHelper.set should add an attribute to dom element'), () => {
    type Dataset = { id: string };
    const $element = document.createElement('div');
    const dataset = datasetHelper();
    const expectedId = '5';

    dataset.set<Dataset>($element, { id: expectedId });

    expect($element.attributes.length).toEqual(1);
    expect($element.getAttribute('data-id')).toEqual(expectedId);
  });

  it(createTitle('datasetHelper.get should return requested attribute or undefined'), () => {
    type Dataset = { id: string };
    const $element = document.createElement('div');
    const dataset = datasetHelper();
    const expectedId = '5';

    $element.setAttribute('data-id', expectedId);
    const actualId = dataset.get<Dataset>($element, 'id');
    const unexistingAttr = dataset.get<{ x: string }>($element, 'x');

    expect(actualId).toEqual(expectedId);
    expect(unexistingAttr).toEqual(undefined);
  });

  it(createTitle('throttle should return a throttled callback which executes just once a set period'), () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    for (let i = 0; i < 100; i++) {
      throttledFunc();
    }

    jest.runAllTimers();
    expect(func).toBeCalledTimes(2);
  });

  it(createTitle('debounce should return a debounced callback which executes just once a set period'), () => {
    const func = jest.fn();
    const debouncedFn = debounce(func, 1000);

    for (let i = 0; i < 100; i++) {
      debouncedFn();
    }

    jest.runAllTimers();
    expect(func).toBeCalledTimes(1);
  });
});
