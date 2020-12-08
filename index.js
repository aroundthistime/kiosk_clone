import express from 'express';
import path from 'path';
import moment from 'moment';
import {
  fakeDB,
  getAllRecords,
  getOrdersForTable,
  getRecord,
  getCustomerPage,
  getMenuDetails,
  postSendOrder,
  getSalesControllPage,
  getKitchenPage,
  getOrdersInKitchen,
  checkOrderStatus,
  checkOrderAlarmStatus,
  processOrder,
  getMenus,
  postEditMenu,
} from './controllers';

import '@babel/polyfill';
import './db';
import './models/Menu';
import './models/Order';
import './models/Record';

import routes from './routes';

const app = express();

const PORT = 5000;

const handleListening = () =>
  console.log(`✅ Listening on https://localhost/${PORT}`);

app.listen(PORT, handleListening);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.locals.moment = moment;

// salesControll router
app.get(routes.salesControllPage, getSalesControllPage);
app.post(routes.getRecord, getRecord);
app.post(routes.getOrders, getOrdersForTable);
app.get(routes.getAllRecords, getAllRecords);

// customerPage router
app.get(routes.customerPage, getCustomerPage);
app.get(routes.menuDetails, getMenuDetails);
app.post(routes.sendOrder, postSendOrder);

// kitchen router
app.get(routes.kitchenPage, getKitchenPage);
app.get(routes.getOrdersInKitchen, getOrdersInKitchen);
app.post(routes.checkOrderStatus, checkOrderStatus);
app.post(routes.checkOrderAlarmStatus, checkOrderAlarmStatus);
app.post(routes.processOrder, processOrder);


app.get('/test', (req, res) => res.render('registerTest.pug'));
app.get(routes.getMenus, getMenus);
app.post(routes.createMenus, postEditMenu);

app.get('/fake', fakeDB);
