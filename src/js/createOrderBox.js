setInterval(async function() {

    // 비동기통신으로 주문내역수신
    const getOrder = await axios.get('/api/get-order-in-ordernotice');
    
    if (getOrder.data.length > 0) {
        const index = (getOrder.data.length) - 1;
        let getOrderNum = getOrder.data[index].orderNumber;
        const getOrderId = getOrder.data[index]._id;
        const getOrderMenu = new Array();

        for(var i=0; i < getOrder.data[index].choices.length; i++) {
            if (getOrder.data[index].choices[i].menu.isCombo == true) {
                getOrderMenu.push(getOrder.data[index].choices[i].menu.nameKr + " x " + getOrder.data[index].choices[i].amount + "<br>(" + getOrder.data[index].choices[i].menu.drink + ", " + getOrder.data[index].choices[i].menu.sideMenu + ")<br><br>");
                // getOrderMenu.push(getOrder.data[index].choices[i].menu.nameKr + " x " + getOrder.data[index].choices[i].amount + "<br><br>");
            } else {
                getOrderMenu.push(getOrder.data[index].choices[i].menu.nameKr + " x " + getOrder.data[index].choices[i].amount + "<br><br>");
            }
        }

        // 'NEW'표시 블록생성
        const orderNoticeState = document.createElement('div');
        const State = document.createElement('span');
        State.innerHTML = "N<br>E<br>W";
        orderNoticeState.setAttribute("class", "order-notice-state");
        orderNoticeState.appendChild(State); 
        
        // 주문번호, 주문내역블록 생성
        const orderContent = document.createElement('div');
        orderContent.setAttribute("class", "order-content");
        let orderNum = document.createElement('span');
        const orderMenu = document.createElement('span');
        orderNum.setAttribute("class", "order-num");
        orderMenu.setAttribute("class", "order-menu"); 
        orderNum.innerHTML = getOrderNum;                         // 주문번호

        for(var i=0; i < getOrderMenu.length; i++) {                           // 주문내역, 수량
            orderMenu.innerHTML = orderMenu.innerHTML + getOrderMenu[i];                       
        }

        if ((orderMenu.innerHTML.length) > 30) {                 // 주문내역 글자수 30자초과시 더보기버튼생성
            const moreBtn = document.createElement('button');
            moreBtn.setAttribute("class", "order-menu-more-button");
            moreBtn.innerHTML = "더보기";
            orderContent.appendChild(moreBtn);
        }                        

        orderContent.appendChild(orderNum);
        orderContent.appendChild(orderMenu);
        
        // 주문취소, 주문완료버튼블록 생성
        const orderProcessBtn = document.createElement('div');
        orderProcessBtn.setAttribute("class", "order-process-button");
        const cancelBtn = document.createElement('button');
        cancelBtn.setAttribute("class", "order-cancel-button");
        cancelBtn.innerHTML = "취소";
        const br = document.createElement('br');
        const completeBtn = document.createElement('button');
        completeBtn.setAttribute("class", "order-complete-button");
        completeBtn.innerHTML = "완료";

        cancelBtn.addEventListener('click', function() {    // 주문취소이벤트
            // -- DB에 주문취소되었다고 전송하는코드추가해야함 -- //
            orderNoticeState.style.display = 'none';
            orderContent.style.display = 'none';
            orderProcessBtn.style.display = 'none';
        });

        completeBtn.addEventListener('click', function() {     // 주문완료이벤트
            // -- DB에 주문완료되었다고 전송하는코드추가해야함 -- //
            orderNoticeState.style.display = 'none';
            orderContent.style.display = 'none';
            orderProcessBtn.style.display = 'none';
        });                    

        orderProcessBtn.appendChild(cancelBtn);
        orderProcessBtn.appendChild(br);
        orderProcessBtn.appendChild(completeBtn);

        // 주문클릭시 더보기팝업창생성, 'NEW'-> 'CHECK'표시 변경, 색상변경기능
        orderNoticeState.addEventListener('click', function() {
            togglePopup(orderNum.innerHTML, orderMenu.innerHTML);

            State.innerHTML = "C<br>H<br>E<br>C<br>K";
            orderNoticeState.style.backgroundColor = '#62A22B';
            orderNoticeState.style.fontSize = '70%';
            orderNoticeState.style.lineHeight = '13px';
            orderContent.style.backgroundColor = '#E5E5E5';
            orderProcessBtn.style.backgroundColor = '#E5E5E5';
            orderNum.style.borderRightColor = '#999999';
        });

        orderContent.addEventListener('click', function() {
            togglePopup(orderNum.innerHTML, orderMenu.innerHTML);

            State.innerHTML = "C<br>H<br>E<br>C<br>K";
            orderNoticeState.style.backgroundColor = '#62A22B';
            orderNoticeState.style.fontSize = '70%';
            orderNoticeState.style.lineHeight = '13px';
            orderContent.style.backgroundColor = '#E5E5E5';
            orderProcessBtn.style.backgroundColor = '#E5E5E5';
            orderNum.style.borderRightColor = '#999999';
        });

        const orderBox = document.createElement('div');
        orderBox.setAttribute("class", "order-notification");
        orderBox.setAttribute("id", getOrderId);              // 주문알림박스 id에 수신한주문 id부여
        orderBox.appendChild(orderNoticeState);
        orderBox.appendChild(orderContent);
        orderBox.appendChild(orderProcessBtn);

        const orderNotification = document.querySelector('.order-notification');
        const orderNotificationNodes = orderNotification.childNodes.length;

        // 주문알림박스가 이미화면에 존재하는지 조건검사후 박스생성             
            if ((orderNotificationNodes) == 0) {
                orderNotification.appendChild(orderBox);
                console.log('주문수신성공');
                console.log(getOrder);
            } else {
                if (orderBox.id != orderNotification.firstChild.id) {
                    orderNotification.insertBefore(orderBox, orderNotification.firstChild);
                    console.log('주문수신성공');
                    console.log(getOrder);
                }
            }
    }
    
 }, 100);