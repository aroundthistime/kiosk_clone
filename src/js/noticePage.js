import axios from 'axios';

if (window.location.pathname === '/notice') {
  const completeOrderBox = document.getElementById('completeOrders');
  const preparingOrdersBox = document.getElementById('preparingOrders');
  const alertAudio = document.getElementById('alertAudio');// 주문완료될 때 재생되는 알림음

  const ALERT_UPDATE_PERIOD = 1000; // 1초마다 알림판 갱신
  const COMPLETE_ORDER_DELETE_TIME = 5000; // 주문완료된 번호는 2분지나면 자동으로 알림판서 삭제

  const deleteFromAlertBoard = (orderId) => {
    const order = document.getElementById(orderId);
    if (order) {
      order.parentNode.removeChild(order);
    }
  };

  const addToAlertBoard = async (orderId, orderNumber, isCompleted) => {
    const order = document.createElement('p');
    order.classList.add('alert-board__order');
    order.id = orderId;
    order.innerText = orderNumber;
    if (isCompleted) {
      completeOrderBox.appendChild(order);
      alertAudio.play();
      setTimeout(() => deleteFromAlertBoard(orderId), COMPLETE_ORDER_DELETE_TIME);
    } else {
      preparingOrdersBox.appendChild(order);
    }
  };

  const getNewOrders = async () => {
    const orders = await axios.get('/api/get-orders-from-kitchen', { date: new Date() });
    const preparingOrders = orders.data.filter(order => !order.isCompleted);

    preparingOrders.forEach(order => {
      const orderId = document.getElementById(order._id);
      if (!orderId) {
        addToAlertBoard(order._id, order.orderNumber, order.isCompleted);
      }
    });
  }

  const checkOrderStatus = () => {
    const orders = document.querySelectorAll('.alert-board__order');
    orders.forEach(async (order) => {
      const orderId = order.id;
      const res = await axios.get(`/api/get-orders-from-kitchen/${orderId}`);
      console.log(orderId, res.status);
      if (res.status !== 200) {
        deleteFromAlertBoard(orderId);
      } else if (res.data) {
        deleteFromAlertBoard(orderId);
        addToAlertBoard(orderId, order.innerText, true);
      }
    })
  }

  setInterval(getNewOrders, ALERT_UPDATE_PERIOD);
  setInterval(checkOrderStatus, ALERT_UPDATE_PERIOD);

}
