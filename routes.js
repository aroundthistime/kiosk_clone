const CUSTOMER_PAGE = '/';
const SALESCONTROLL_PAGE = '/salesControll';

// API
const MENU_DETAILS = '/api/menu-details/:id';
const SEND_ORDER = '/api/send-order';
const GET_RECORDS = '/api/submit-record';
const MAKE_ORDER = '/api/make-order';
const GET_ORDRES = '/api/get-orders';

const routes = {
  customerPage: CUSTOMER_PAGE,
  salesControllPage: SALESCONTROLL_PAGE,
  menuDetails: MENU_DETAILS,
  sendOrder: SEND_ORDER,
  getRecord: GET_RECORDS,
  makeOrder: MAKE_ORDER,
  getOrders: GET_ORDRES,
};

export default routes;