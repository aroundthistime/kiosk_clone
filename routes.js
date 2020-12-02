const CUSTOMER_PAGE = '/';
const SALESCONTROLL_PAGE = '/salesControll';
const ORDERNOTICE_PAGE = '/kitchen';

// API
const MENU_DETAILS = '/api/menu-details/:id';
const SEND_ORDER = '/api/send-order';
const GET_RECORDS = '/api/submit-record';
const GET_ORDRES = '/api/get-orders';
const GET_ALL_RECORDS = '/api/get-all-records';
const GET_ORDER_IN_ORDERNOTICE = '/api/get-order-in-ordernotice';
const CHECK_ORDER_STATUS = '/api/check-order';
const PROCESS_ORDER = '/api/process-order';

const routes = {
  customerPage: CUSTOMER_PAGE,
  salesControllPage: SALESCONTROLL_PAGE,
  orderNoticePage: ORDERNOTICE_PAGE,
  menuDetails: MENU_DETAILS,
  sendOrder: SEND_ORDER,
  getRecord: GET_RECORDS,
  getOrders: GET_ORDRES,
  getAllRecords: GET_ALL_RECORDS,
  getOrderInOrdernotice: GET_ORDER_IN_ORDERNOTICE,
  checkOrderStatus: CHECK_ORDER_STATUS,
  processOrder: PROCESS_ORDER,
};

export default routes;
