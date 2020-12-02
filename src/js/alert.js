import axios from 'axios';
import routes from '../../routes';

const alertBoard = document.getElementById('alertBoard');
const preparingOrdersBox = document.getElementById('preparingOrders');// 알림판 준비중 섹션
const completeOrdersBox = document.getElementById('completeOrders');// 알림판 준비완료 섹션
const alertAudio = document.getElementById('alertAudio');// 주문완료될 때 재생되는 알림음

const ALERT_UPDATE_PERIOD = 1000; // 1초마다 알림판 갱신
const COMPLETE_ORDER_DELETE_TIME = 300000; // 주문완료된 번호는 5분지나면 자동으로 알림판서 삭제

const deleteFromAlertBoard = (orderId) => {
  const order = document.getElementById(orderId);
  if (order) {
    order.parentNode.removeChild(order);
  }
};

const addToAlertBoard = async (orderId, orderNumber, isPreparing) => {
  const order = document.createElement('DIV');
  order.classList.add('alert-board__order');
  order.id = orderId;
  order.innerText = orderNumber;
  if (isPreparing) {
    preparingOrdersBox.appendChild(order);
  } else {
    completeOrdersBox.appendChild(order);
    alertAudio.play();
    setTimeout(() => deleteFromAlertBoard(orderId), COMPLETE_ORDER_DELETE_TIME);
  }
};

const getPreparingOrders = async () => {
  const response = await axios({
    url: routes.getPreparing,
    method: 'GET',
  });
  if (response.status === 200) {
    const preparingOrders = response.data;
    for (let i = 0; i < preparingOrders.length; i++) {
      const orderId = preparingOrders[i]._id;
      if (!document.getElementById(orderId)) { // 새롭게 접수된 주문이면
        const orderNum = preparingOrders[i].orderNumber;
        addToAlertBoard(orderId, orderNum, true);// 마지막 매개변수는 isPreparing
      }
    }
  }
};

const checkPreparingStatus = () => { // 준비중 주문들에 대해 완료, 취소 여부 확인
  preparingOrdersBox.querySelectorAll('.alert-board__order').forEach(async (order) => {
    const orderId = order.id;
    const response = await axios({
      url: `/api/check-preparing/${orderId}`,
      method: 'GET',
    });
    if (response.status !== 200) { // 해당 주문이 취소된 경우
      deleteFromAlertBoard(orderId);
    } else if (response.data) { // isCompleted(주문이 완료된 경우)
      const orderNumber = order.innerText;
      deleteFromAlertBoard(orderId);
      addToAlertBoard(orderId, orderNumber, false); // 마지막 매개변수는 isPreparing
    } // 취소된 것도 아니고 완료된 것도 아니면 냅둠
  });
};

if (alertBoard) {
  setInterval(getPreparingOrders, ALERT_UPDATE_PERIOD);
  setInterval(checkPreparingStatus, ALERT_UPDATE_PERIOD);
}
