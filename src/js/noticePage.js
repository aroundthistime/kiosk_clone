import axios from 'axios';

if (window.location.pathname === '/notice') {
  const completeOrderBox = document.getElementById('completeOrders'); // 알림판 준비완료 섹션
  const preparingOrdersBox = document.getElementById('preparingOrders'); // 알림판 준비중 섹션
  const alertAudio = document.getElementById('alertAudio');// 주문완료될 때 재생되는 알림음

  const ALERT_UPDATE_PERIOD = 1000; // 1초마다 알림판 갱신
  const COMPLETE_ORDER_DELETE_TIME = 120000; // 주문완료된 번호는 2분지나면 자동으로 알림판서 삭제

  // 화면보드에서 주문 제거 함수
  const deleteFromAlertBoard = (orderId) => {
    const order = document.getElementById(orderId);
    if (order) {
      order.parentNode.removeChild(order);
    }
  };

  // 주문 화면보드에 추가 함수
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

  // 준비중 주문들 모두 가져와 출력 함수
  const getNewOrders = async () => {
    const orders = await axios.get('/api/get-orders-from-kitchen', { date: new Date() });
    const preparingOrders = orders.data.filter(order => !order.isCompleted);

    preparingOrders.forEach(order => {
      const orderId = document.getElementById(order._id);
      if (!orderId) { // 새롭게 접수된 주문이면 준비 중 영역에 추가
        addToAlertBoard(order._id, order.orderNumber, order.isCompleted);
      }
    });
  }

  // 준비중 주문들에 대해 완료, 취소 여부 확인 함수
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

  // 실시간 갱신 설정 
  setInterval(getNewOrders, ALERT_UPDATE_PERIOD);
  setInterval(checkOrderStatus, ALERT_UPDATE_PERIOD);

}
