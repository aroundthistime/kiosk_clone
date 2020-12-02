import express from 'express';
import path from 'path';
import moment from 'moment';
import {
  fakeCustomerPage,
  fakeDB,
  getAllRecords,
  getOrdersForTable,
  getRecord,
  makeDummyData,
  makeTheOrder,
  salesControllPage,
  getCustomerPage,
  getMenuDetails,
  postSendOrder,
  getAlert,
  getPreparingOrders,
  getCheckPreparingStatus,
} from './controllers';

import '@babel/polyfill';
import './db';
import './models/Menu';
import './models/Order';
import './models/Record';

import routes from './routes';

const app = express();

const PORT = 5000;

const handleListening = () => console.log(`✅ Listening on https://localhost/${PORT}`);

app.listen(PORT, handleListening);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.locals.moment = moment;

// salesControll router
app.get(routes.salesControllPage, salesControllPage);
app.post(routes.getRecord, getRecord);
app.post(routes.getOrders, getOrdersForTable);
app.get(routes.getAllRecords, getAllRecords);
app.get(routes.makeDummy, makeDummyData);

// customerPage router
app.get(routes.customerPage, getCustomerPage);
app.get(routes.menuDetails, getMenuDetails);
app.post(routes.sendOrder, postSendOrder);

// app.get('/fake', fakeDB);
app.get(routes.alert, getAlert);
app.get(routes.getPreparing, getPreparingOrders);
app.get(routes.checkPreparingStatus, getCheckPreparingStatus);
