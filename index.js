import express from 'express';
import path from 'path';
import { getCustomerPage, getMenuDetails, postSendOrder } from './controllers';
import routes from './routes';

const app = express();

const PORT = 5000;

const handleListening = () => console.log(`✅ Listening on https://localhost/${PORT}`);

app.listen(PORT, handleListening);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/build', express.static(path.join(__dirname, 'build')));

app.get(routes.customerPage, getCustomerPage);
app.get(routes.menuDetails, getMenuDetails);
app.get(routes.sendOrder, postSendOrder);

app.get('/order', (req, res) => res.render('order', { a: true }));
app.get('/alert', (req, res) => res.render('alert'));
