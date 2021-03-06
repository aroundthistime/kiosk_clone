// PAGE URL
const CUSTOMER_PAGE = '/';
const SALESCONTROLL_PAGE = '/salesControll';
const KITCHEN_PAGE = '/kitchen';
const REGISTER_PAGE = '/registerMenu';
const NOTICE_BOARD = '/notice';

// API
const MENU_DETAILS = '/api/menu-details/:id';
const SEND_ORDER = '/api/send-order';
const GET_RECORDS = '/api/submit-record';
const GET_ORDRES = '/api/get-orders';
const GET_ALL_RECORDS = '/api/get-all-records';
const GET_ORDERS_IN_KITCHEN = '/api/get-orders-in-kitchen';
const CHECK_ORDER_STATUS = '/api/check-order';
const CHECK_ORDER_ALARM_STATUS = '/api/check-order-alarm-status';
const PROCESS_ORDER = '/api/process-order';
const GET_ORDERS_FROM_KITCHEN = '/api/get-orders-from-kitchen';
const GET_ORDERS_BY_ID = '/api/get-orders-from-kitchen/:id';
const GET_MENUS = '/api/menus';
const CREATE_MENUS = '/api/menus';

const routes = {
  customerPage: CUSTOMER_PAGE,
  salesControllPage: SALESCONTROLL_PAGE,
  kitchenPage: KITCHEN_PAGE,
  registerPage: REGISTER_PAGE,
  noticeBoard: NOTICE_BOARD,
  menuDetails: MENU_DETAILS,
  sendOrder: SEND_ORDER,
  getRecord: GET_RECORDS,
  getOrders: GET_ORDRES,
  getAllRecords: GET_ALL_RECORDS,
  getOrdersInKitchen: GET_ORDERS_IN_KITCHEN,
  checkOrderStatus: CHECK_ORDER_STATUS,
  checkOrderAlarmStatus: CHECK_ORDER_ALARM_STATUS,
  processOrder: PROCESS_ORDER,
  getMenus: GET_MENUS,
  createMenus: CREATE_MENUS,
  getOrdersFromKitchen: GET_ORDERS_FROM_KITCHEN,
  getOrderFromKitchenById: GET_ORDERS_BY_ID,
};

export default routes;
