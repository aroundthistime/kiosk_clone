import express from 'express';
import path from 'path';
import '@babel/polyfill';
import bodyParser from 'body-parser';
import './db';
import './models/Menu';
import './models/Order';
import './models/Record';
import {
  getCustomerPage, getMenuDetails, postSendOrder, fakeDB,
} from './controllers';

import routes from './routes';

const app = express();

const PORT = 5000;

const handleListening = () => console.log(`✅ Listening on https://localhost/${PORT}`);

app.listen(PORT, handleListening);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get(routes.customerPage, getCustomerPage);
app.get(routes.menuDetails, getMenuDetails);
app.post(routes.sendOrder, postSendOrder);

// app.get('/fake', fakeDB);
