const orderBtn = document.querySelector(".order-btn");
const orderList = document.querySelector(".order-list");
const orderNum = document.querySelector(".order-num");
const orderNumSpan = document.querySelector("span");


const sendOrder = async (event) => {
    const response = await axios({
            method: 'post',
            url: '/api'
          });
    orderNumSpan.innerText = response.data;    
}

const removeNewSign = (event) => {
    event.target.classList.remove("new-order");
}

const clearOrder = async (event) => {
    let orderBar = event.target;
    while (!orderBar.classList.contains("order-bar")){
        orderBar = orderBar.parentNode;
    }
    const orderNumber = orderBar.querySelector("span").innerText;
    const response = await axios({
        method: 'post',
        url: `/api/alert/${orderNumber}`
      });
    document.remove(orderBar);
}

const cancel

const getInfo = async() => {
    const response = await axios.get("/api");
    Array.from(response.data).forEach((num) => {
        if (!document.getElementById(`order-${num}`)){
            const orderBar = document.createElement("DIV");
            orderBar.classList.add("order-bar");
            const orderNum = document.createElement("SPAN");
            const orderProcessBtns = document.createElement("DIV");
            orderProcessBtns.classList.add("order-process-btns");
            const orderClearBtn = document.createElement("DIV");
            const orderCancelBtn = document.createElement("DIV");
            orderClearBtn.innerText = "✔";
            orderCancelBtn.innerText = "❌";
            orderClearBtn.classList.add("order-process-btn");
            orderClearBtn.classList.add("order-clear-btn");
            orderCancelBtn.classList.add("order-process-btn");
            orderCancelBtn.classList.add("order-cancel-btn");
            orderNum.innerText = num;
            orderBar.id = `order-${num}`;
            orderBar.appendChild(orderNum);
            orderProcessBtns.appendChild(orderClearBtn);
            orderProcessBtns.appendChild(orderCancelBtn);
            orderBar.appendChild(orderProcessBtns);
            orderBar.classList.add("new-order");
            orderBar.addEventListener("click", removeNewSign);
            orderClearBtn.addEventListener("click", clearOrder);
            orderCancelBtn.addEventListener("click", cancelOrder);
            orderList.prepend(orderBar);
        }
    })
}

if (orderList){
    setInterval(getInfo, 200);
}


if (orderBtn){
    orderBtn.addEventListener("click", sendOrder);
}
