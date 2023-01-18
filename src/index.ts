import App from './pages/app/index';
import { logAssessment } from './utils/assessment';
import { LSKeys } from './utils/constants';

window.addEventListener('beforeunload', () => {
  const orders = App.getOrders();
  const promoCodes = App.getAppliedPromoCodes();
  window.localStorage.setItem(LSKeys.Orders, JSON.stringify(orders));
  window.localStorage.setItem(LSKeys.Promo, JSON.stringify(promoCodes));
});

window.addEventListener('load', () => {
  const serializedOrders = window.localStorage.getItem(LSKeys.Orders);
  const serializedPromoCodes = window.localStorage.getItem(LSKeys.Promo);

  App.setOrders(serializedOrders ? JSON.parse(serializedOrders) : {});
  App.setAppliedPromoCodes(serializedPromoCodes ? JSON.parse(serializedPromoCodes) : []);

  const app = App.getInstance();
  app.run();
});

logAssessment();
