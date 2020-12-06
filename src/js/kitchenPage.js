import axios from 'axios';

if (window.location.pathname === '/kitchen') {

    const notificationContainer = document.querySelector('.middleArea .container');
    const NO_ORDERLIST_WARNIG_MSG = '주문 내역이 없습니다';
    const alarmSound = document.getElementById('alarmInKitchen');

    setInterval(async () => {

        // 비동기통신으로 주문내역수신
        const orders = await axios.get('/api/get-orders-in-kitchen');
        const ordersList = orders.data;

        // 기존에 존재하던 주문내역박스 제거 
        const notifications = document.querySelectorAll('.order-notifications');
        const noOrderList = document.querySelector('.order-notifications__no-list');
        notifications.forEach(notification => notification.remove());
        if (noOrderList) noOrderList.remove();

        // 수신 주문 내역이 없는 경우
        if (!ordersList.length) {
            const noOrderListDiv = document.createElement('div');
            noOrderListDiv.classList.add('order-notifications__no-list');
            const noOrderMessage = document.createElement('p');
            noOrderMessage.innerText = NO_ORDERLIST_WARNIG_MSG;
            noOrderListDiv.appendChild(noOrderMessage);
            notificationContainer.appendChild(noOrderListDiv);
        }

        // 수신 주문 내역이 있는 경우
        else {
            ordersList.forEach(order => {
                const newOrderNum = order.orderNumber;
                const newOrderStatus = order.isChecked;
                const newOrderAlarmStatus = order.isAlarmed;
                const newOrderId = order._id;
                const newOrderTakeout = order.isTakeout ? '포장' : '매장';
                const newOrderMenus = order.choices;

                // 주문내역 박스모델 생성
                const orderNotificationBox = document.createElement('div');
                orderNotificationBox.classList.add('order-notifications', newOrderStatus ? 'order-notifications__status--check' : 'order-notifications__status--new');
                orderNotificationBox.id = newOrderId;

                // 주문내역상태(NEW or CHECK) 표시 블럭 생성
                const orderNotificationStatus = document.createElement('div');
                orderNotificationStatus.classList.add('order-notifications__status', newOrderStatus ? 'check' : 'new');
                orderNotificationStatus.innerText = newOrderStatus ? 'check' : 'new';
                orderNotificationStatus.addEventListener('click', () => togglePopup(newOrderId));

                orderNotificationBox.appendChild(orderNotificationStatus);

                // 주문번호 및 매장식사 or 포장여부 표시 블럭 생성
                const orderNotificationDetails = document.createElement('div');
                orderNotificationDetails.classList.add('order-notifications__details');
                orderNotificationDetails.addEventListener('click', () => togglePopup(newOrderId));

                const orderNotificationNum = document.createElement('span');
                orderNotificationNum.classList.add('order-notifications__details--number');
                orderNotificationNum.innerText = newOrderNum;
                orderNotificationNum.id = newOrderId + '_num';
                orderNotificationDetails.appendChild(orderNotificationNum);

                const orderNotificationTakeout = document.createElement('span');
                orderNotificationTakeout.classList.add('order-notifications__details--takeout');
                orderNotificationTakeout.innerText = newOrderTakeout;
                orderNotificationTakeout.id = newOrderId + '_takeout';
                orderNotificationDetails.appendChild(orderNotificationTakeout);

                orderNotificationBox.appendChild(orderNotificationDetails);

                // 주문메뉴 정보 블럭 생성
                const orderNotificationMenu = document.createElement('div');
                orderNotificationMenu.classList.add('order-notifications__menu');
                orderNotificationMenu.id = newOrderId + '_order';
                orderNotificationMenu.addEventListener('click', () => togglePopup(newOrderId));

                newOrderMenus.forEach(menu => {
                    // 각 메뉴를 저장할 블럭 생성
                    const menuItemDiv = document.createElement('div');
                    menuItemDiv.classList.add('order-notifications__menu--info');

                    // 블럭에 메뉴 이름 추가
                    const menuName = document.createElement('p');
                    menuName.classList.add('order-notifications__menu--name');
                    menuName.innerText = menu.menu.nameKr + ' x ' + menu.amount;
                    menuItemDiv.appendChild(menuName);

                    // 세트메뉴일 경우 구성품목 추가
                    if (menu.menu.isCombo) {
                        const menuSides = document.createElement('p');
                        menuSides.classList.add('order-notifications__menu--sides');
                        menuSides.innerText = '(' + menu.menu.sideMenu.nameKr + ', ' + menu.menu.drink.nameKr + ')';
                        menuItemDiv.appendChild(menuSides);
                    }

                    orderNotificationMenu.appendChild(menuItemDiv);
                })

                orderNotificationBox.appendChild(orderNotificationMenu);

                // 주문처리 버튼 블럭 생성
                const orderProcessingBtn = document.createElement('div');
                orderProcessingBtn.classList.add('button-area');

                const cancelBtn = document.createElement('div');
                cancelBtn.classList.add('button-area__button', 'button-area__button--cancel');
                cancelBtn.innerText = '취소';
                cancelBtn.addEventListener('click', () => processOrder(newOrderId, 'cancel'));
                orderProcessingBtn.appendChild(cancelBtn);

                const completeBtn = document.createElement('div');
                completeBtn.classList.add('button-area__button', 'button-area__button--complete');
                completeBtn.innerText = '완료';
                completeBtn.addEventListener('click', () => processOrder(newOrderId, 'complete'));
                orderProcessingBtn.appendChild(completeBtn);

                orderNotificationBox.appendChild(orderProcessingBtn);

                // 모든 블럭 생성이 끝났으면, 주문알림 컨테이너에 해당 주문내역박스 추가
                notificationContainer.appendChild(orderNotificationBox);

                // 알림소리상태 체크후 알림음 발생
                if (!newOrderAlarmStatus) {
                    alarmSound.play();
                    checkOrderAlarm(newOrderId);
                }                
            })
        }
    }, 850);

    const processOrder = async (id, task) => {
        await axios.post('/api/process-order', {
            id,
            task,
        });
    }

    const checkOrderAlarm = async (id) => {
        await axios.post('/api/check-order-alarm-status', { id });
    }

    // 주문내역박스 클릭시 표시되는 팝업창 
    const orderPopupBox = document.querySelector('.order-popup');
    const orderPopupBtn = document.querySelector('.order-popup__box--button');

    const togglePopup = async (id) => {
        await axios.post('/api/check-order', { id });  // 팝업창표시와 동시에 선택된 주문내역상태를 NEW -> CHECK로 변경

        const selectedNum = document.getElementById(id + '_num').innerText;
        const selectedTakeout = document.getElementById(id + '_takeout').innerText;
        const selectedOrder = document.getElementById(id + '_order').innerHTML;

        const orderPopupNum = document.querySelector('.order-popup__box--num');
        const orderPopupTakeout = document.querySelector('.order-popup__box--takeout');
        const orderPopupMenu = document.querySelector('.order-popup__box--menu');

        orderPopupNum.innerHTML = selectedNum;
        orderPopupTakeout.innerHTML = selectedTakeout;
        orderPopupMenu.innerHTML = selectedOrder;

        orderPopupBox.classList.toggle("show-popup");
    }

    const closePopup = () => {
        orderPopupBox.classList.toggle("show-popup");
    }

    orderPopupBtn.addEventListener('click', closePopup);

}