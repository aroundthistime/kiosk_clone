import express from 'express';
import path from 'path';
import moment from 'moment';
import './db';
import {
  fakeCustomerPage,
  getAllRecords,
  getOrdersForTable,
  getRecord,
  makeTheOrder,
  salesControllPage,
} from './controllers';
import routes from './routes';

const app = express();

const PORT = 5000;

const handleListening = () =>
  console.log(`✅ Listening on https://localhost/${PORT}`);

app.listen(PORT, handleListening);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.locals.moment = moment;

app.get(routes.customerPage, fakeCustomerPage);
app.get(routes.salesControllPage, salesControllPage);
app.post(routes.getRecord, getRecord);
app.post(routes.getOrders, getOrdersForTable);
app.get(routes.getAllRecords, getAllRecords);
app.get('/order', (req, res) => res.render('order'));
app.get('/alert', (req, res) => res.render('alert'));
// app.get('/salesControll', (req, res) => res.render('salesControll'));
