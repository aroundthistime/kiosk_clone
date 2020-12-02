if (window.location.pathname === '/kitchen') {

    const notificationBox = document.querySelector('.middleArea .container');
    const NO_ORDERLIST_WARNIG_MSG = '수신된 주문 내역이 없습니다.';

    setInterval(async () => {

        // 비동기통신으로 주문내역수신
        const orders = await axios.get('/api/get-order-in-ordernotice');
        const newOrders = orders.data;

        // 기존 HTML 블럭 제거
        const notifications = document.querySelectorAll('.order-notifications');
        const noOrderLists = document.querySelector('.order-notifications__no-list');
        notifications.forEach(notification => notification.remove());
        if (noOrderLists) noOrderLists.remove();

        // 수신 주문 내역이 없는 경우
        if (!newOrders.length) {
            const noOrderListDiv = document.createElement('order-notifications__no-list');
            noOrderListDiv.classList.add('order-notifications__no-list');
            const noOrderMessage = document.createElement('p');
            noOrderMessage.innerText = NO_ORDERLIST_WARNIG_MSG;
            noOrderListDiv.appendChild(noOrderMessage);
            notificationBox.appendChild(noOrderListDiv);
        }
        // 수신 주문 내역이 있는 경우
        else {
            newOrders.forEach(order => {
                const newOrderNum = order.orderNumber;
                const newOrderStatus = order.isChecked;
                const newOrderId = order._id;
                const newOrderTakeout = order.isTakeout ? '포장' : '매장';
                const newOrderMenus = order.choices;

                // 주문내역 박스모델 생성
                const orderNotificationDiv = document.createElement('div');
                orderNotificationDiv.classList.add('order-notifications', newOrderStatus ? 'order-notifications__status--check' : 'order-notifications__status--new');
                orderNotificationDiv.id = newOrderId;

                // 주문 NEW or CHECK 상태 블럭 생성
                const orderNotificationStatus = document.createElement('p');
                orderNotificationStatus.classList.add('order-notifications__status', newOrderStatus ? 'check' : 'new');
                orderNotificationStatus.innerText = newOrderStatus ? 'check' : 'new';
                orderNotificationStatus.addEventListener('click', () => togglePopup(newOrderId));
                orderNotificationDiv.appendChild(orderNotificationStatus);

                // 주문 번호 및 매장 or 포장여부 표시 블럭 생성
                const orderNotificationDetails = document.createElement('p');
                const orderNotificationNum = document.createElement('span');
                const orderNotificationTakeout = document.createElement('span');
                orderNotificationDetails.classList.add('order-notifications-details');
                orderNotificationDetails.addEventListener('click', () => togglePopup(newOrderId));
                orderNotificationNum.classList.add('order-notifications__number');
                orderNotificationNum.innerText = newOrderNum;
                orderNotificationNum.id = newOrderId + '_num';
                orderNotificationDetails.appendChild(orderNotificationNum);
                orderNotificationTakeout.classList.add('order-notifications__takeout');
                orderNotificationTakeout.innerText = newOrderTakeout;
                orderNotificationTakeout.id = newOrderId + '_takeout';
                orderNotificationDetails.appendChild(orderNotificationTakeout);
                orderNotificationDiv.appendChild(orderNotificationDetails);

                // 주문의 메뉴 정보 블럭 생성
                const orderNotificationMenu = document.createElement('div');
                orderNotificationMenu.classList.add('order-notifications-menu-info');
                orderNotificationMenu.id = newOrderId + '_order';
                orderNotificationMenu.addEventListener('click', () => togglePopup(newOrderId));

                newOrderMenus.forEach(menu => {
                    // 각 메뉴를 저장할 블럭 생성
                    const menuItem = document.createElement('div');
                    menuItem.classList.add('order-notifications-menu');

                    // 메뉴 이름 저장
                    const menuName = document.createElement('p');
                    menuName.classList.add('order-notifications__menu-name');
                    menuName.innerText = menu.menu.nameKr + ' x ' + menu.amount;
                    menuItem.appendChild(menuName);

                    // 세트메뉴일 경우 구성 재료 저장
                    if (menu.menu.isCombo) {
                        const MenuSides = document.createElement('p');
                        MenuSides.classList.add('order-notifications__menu-sides');
                        MenuSides.innerText = menu.menu.drink.nameKr + ', ' + menu.menu.sideMenu.nameKr;
                        menuItem.appendChild(MenuSides);
                    }
                    orderNotificationMenu.appendChild(menuItem);
                })
                orderNotificationDiv.appendChild(orderNotificationMenu);

                // 주문처리 버튼 생성
                const buttonArea = document.createElement('div');
                buttonArea.classList.add('button-area');
                const cancelBtn = document.createElement('div');
                cancelBtn.classList.add('button-area__button', 'button-area__button--cancel');
                cancelBtn.innerText = '취소';
                cancelBtn.addEventListener('click', () => processOrder(newOrderId, 'cancel'));
                buttonArea.appendChild(cancelBtn);
                const completeBtn = document.createElement('div');
                completeBtn.classList.add('button-area__button', 'button-area__button--complete');
                completeBtn.innerText = '완료';
                completeBtn.addEventListener('click', () => processOrder(newOrderId, 'complete'));
                buttonArea.appendChild(completeBtn);
                orderNotificationDiv.appendChild(buttonArea);

                notificationBox.appendChild(orderNotificationDiv);

            })
        }
    }, 500);


    const orderPopup = document.querySelector('.order-popup');
    const orderPopupCancel = document.querySelector('.order-popup-cancel');

    const togglePopup = async (id) => {
        const selectedNum = document.getElementById(id + '_num').innerText;
        const selectedTakeout = document.getElementById(id + '_takeout').innerText;
        const selectedOrder = document.getElementById(id + '_order').innerHTML;
        const orderPopupNum = document.querySelector('.order-popup-num');
        const orderPopupTakeout = document.querySelector('.order-popup-takeout');
        const orderPopupMenu = document.querySelector('.order-popup-menu');

        orderPopupNum.innerHTML = selectedNum;
        orderPopupTakeout.innerHTML = selectedTakeout;
        orderPopupMenu.innerHTML = selectedOrder;

        await axios.post('/api/check-order', { id });

        orderPopup.classList.toggle("show-popup");
    }

    const cancelPopup = () => {
        orderPopup.classList.toggle("show-popup");
    }

    const processOrder = async (id, task) => {
        await axios.post('/api/process-order', {
            id,
            task,
        });
    }

    orderPopupCancel.addEventListener('click', cancelPopup);

}