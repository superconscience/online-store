import './index.css';
import App from './pages/app/index';
import { logAssessment } from './utils/assessment';
import { LSKeys } from './utils/constants';

window.addEventListener('beforeunload', () => {
  const orders = App.getOrders();
  const promoCodes = App.getAppliedPromoCodes();
  window.localStorage[LSKeys.Orders] = JSON.stringify(orders);
  window.localStorage[LSKeys.Promo] = JSON.stringify(promoCodes);
});

window.addEventListener('load', () => {
  const serializedOrders = window.localStorage[LSKeys.Orders] as string;
  const serializedPromoCodes = window.localStorage[LSKeys.Promo] as string;

  App.setOrders(serializedOrders ? JSON.parse(serializedOrders) : {});
  App.setAppliedPromoCodes(serializedPromoCodes ? JSON.parse(serializedPromoCodes) : []);

  const app = App.getInstance();
  app.run();
});

logAssessment();
