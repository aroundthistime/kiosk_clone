const CUSTOMER_PAGE = '/';
const SALESCONTROLL_PAGE = '/salesControll';
const ALERT = '/alert';

// API
const MENU_DETAILS = '/api/menu-details/:id';
const SEND_ORDER = '/api/send-order';
const GET_RECORDS = '/api/submit-record';
const GET_ORDRES = '/api/get-orders';
const GET_ALL_RECORDS = '/api/get-all-records';
const MAKE_DUMMY = '/api/make-dummy';
const GET_PREPARING = '/api/get-preparing';
const CHECK_PREPARING_STATUS = '/api/check-preparing/:id';

const routes = {
  customerPage: CUSTOMER_PAGE,
  salesControllPage: SALESCONTROLL_PAGE,
  alert: ALERT,
  menuDetails: MENU_DETAILS,
  sendOrder: SEND_ORDER,
  getRecord: GET_RECORDS,
  getOrders: GET_ORDRES,
  getAllRecords: GET_ALL_RECORDS,
  makeDummy: MAKE_DUMMY,
  getPreparing: GET_PREPARING,
  checkPreparingStatus: CHECK_PREPARING_STATUS,
};

export default routes;
