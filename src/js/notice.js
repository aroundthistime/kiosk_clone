import axios from "axios";

var orderNumber = new Array();
var completedOrderNumber = new Array();

let orderNumberCount = 0;
let completedOrderNumberCount = 0;

var audio = new Audio("../sound/alarmNotice.mp3");

if (window.location.pathname === "/notice") {
  setInterval(async () => {
    // 비동기통신으로 주문내역수신
    const orders = await axios.get("/api/get-orders-in-kitchen");
    const ordersList = orders.data;

    // 수신 주문 내역이 없는 경우
    if (!ordersList.length) {
    }

    // 수신 주문 내역이 있는 경우
    else {
      ordersList.forEach((order) => {
        const newOrderNum = order.orderNumber;
        const newOrderId = order._id;

        orderNumber[orderNumberCount] = newOrderNum;
        orderNumberCount += 1;

        if ((newOrderId = cancel)) {
          orderNumber.slice[(orderNumberCount, 1)];
          orderNumberCount -= 1;
        } else if ((newOrderId = complete)) {
          orderNumber.slice[(orderNumberCount, 1)];
          orderNumberCount -= 1;
          completedOrderNumber[completedOrderNumberCount] = newOrderNum;
          completedOrderNumberCount += 1;

          // 알람
          audio.play();

          // 화면 재조정
          completeLayout();

          // 5분 후 삭제
          etInterval(() => {
            completedOrderNumber.slice[(0, 1)];
          }, 6000);
        }
      });
    }
  }, 850);
}

preparingLayout();

function completeFontSize(a) {
  if (a < 2) {
    if ((a = 0)) {
      document.getElementById("completeHrOne").style.fontSize = 24;
    } else {
      document.getElementById("completeHrOne").style.fontSize = 21;
    }
  } else if (2 <= a && a < 4) {
    if ((a = 0)) {
      document.getElementById("completeHrTwo").style.fontSize = 24;
    } else {
      document.getElementById("completeHrTwo").style.fontSize = 21;
    }
  } else if (4 <= a && a < 6) {
    if ((a = 0)) {
      document.getElementById("completeHrThree").style.fontSize = 24;
    } else {
      document.getElementById("completeHrThree").style.fontSize = 21;
    }
  } else if (6 <= a && a < 8) {
    if ((a = 0)) {
      document.getElementById("completeHrFour").style.fontSize = 24;
    } else {
      document.getElementById("completeHrFour").style.fontSize = 21;
    }
  }
}

function preparingFontSize(a) {
  if (a < 4) {
    if ((a = 0)) {
      document.getElementById("preparingHrOne").style.fontSize = 24;
    } else if ((a = 1)) {
      document.getElementById("preparingHrOne").style.fontSize = 21;
    } else if ((a = 2)) {
      document.getElementById("preparingHrOne").style.fontSize = 18;
    } else if ((a = 3)) {
      document.getElementById("preparingHrOne").style.fontSize = 15;
    }
  } else if (4 <= a && a < 8) {
    if ((a = 4)) {
      document.getElementById("preparingHrTwo").style.fontSize = 24;
    } else if ((a = 5)) {
      document.getElementById("preparingHrTwo").style.fontSize = 21;
    } else if ((a = 6)) {
      document.getElementById("preparingHrTwo").style.fontSize = 18;
    } else if ((a = 7)) {
      document.getElementById("preparingHrTwo").style.fontSize = 15;
    }
  } else if (8 <= a && a < 12) {
    if ((a = 8)) {
      document.getElementById("preparingHrThree").style.fontSize = 24;
    } else if ((a = 9)) {
      document.getElementById("preparingHrThree").style.fontSize = 21;
    } else if ((a = 10)) {
      document.getElementById("preparingHrThree").style.fontSize = 18;
    } else if ((a = 11)) {
      document.getElementById("preparingHrThree").style.fontSize = 15;
    }
  } else if (12 <= a && a < 16) {
    if ((a = 12)) {
      document.getElementById("preparingHrFour").style.fontSize = 24;
    } else if ((a = 13)) {
      document.getElementById("preparingHrFour").style.fontSize = 21;
    } else if ((a = 14)) {
      document.getElementById("preparingHrFour").style.fontSize = 18;
    } else if ((a = 15)) {
      document.getElementById("preparingHrFour").style.fontSize = 15;
    }
  }
}

function completeLayout() {
  if (completedOrderNumber.length < 2) {
    preparingHrOne.innerHTML = "";

    for (var i = 0; i < completedOrderNumber.length; i++) {
      completeHrOne.innerHTML += completedOrderNumber[i];

      if (completedOrderNumber[i] < 10) {
        completeHrOne.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (
        10 <= completedOrderNumber[i] &&
        completedOrderNumber[i] < 100
      ) {
        completeHrOne.innerHTML += "&nbsp&nbsp";
      } else {
        completeHrOne.innerHTML += "&nbsp";
      }

      completeFontSize(i);
    }
    document.getElementById("completeHrOne").style.textAlign = "center";
  } else if (
    2 <= completedOrderNumber.length &&
    completedOrderNumber.length < 4
  ) {
    completeHrOne.innerHTML = "";
    completeHrTwo.innerHTML = "";

    for (var i = 0; i < 2; i++) {
      completedHrOne.innerHTML += completedOrderNumber[i];

      if (completedOrderNumber[i] < 10) {
        completeHrOne.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (
        10 <= completedOrderNumber[i] &&
        completedOrderNumber[i] < 100
      ) {
        completeHrOne.innerHTML += "&nbsp&nbsp";
      } else {
        completeHrOne.innerHTML += "&nbsp";
      }
    }

    for (var k = 2; k < completedOrderNumber.length; k++) {
      completeHrTwo.innerHTML += completedOrderNumber[k];

      if (completedOrderNumber[k] < 10) {
        completeHrTwo.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (
        10 <= completedOrderNumber[k] &&
        completedOrderNumber[k] < 100
      ) {
        completeHrTwo.innerHTML += "&nbsp&nbsp";
      } else {
        completeHrTwo.innerHTML += "&nbsp";
      }

      completeFontSize(k);
    }
    document.getElementById("completeHrOne").style.fontSize = 21;
    document.getElementById("completeHrOne").style.textAlign = "center";
    document.getElementById("completeHrTwo").style.textAlign = "center";
  } else if (
    4 <= completedOrderNumber.length &&
    completedOrderNumber.length < 6
  ) {
    completeHrOne.innerHTML = "";
    completeHrTwo.innerHTML = "";
    completeHrThree.innerHTML = "";

    for (var i = 0; i < 2; i++) {
      completeHrOne.innerHTML += completedOrderNumber[i];

      if (completedOrderNumber[i] < 10) {
        completeHrOne.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (
        10 <= completedOrderNumber[i] &&
        completedOrderNumber[i] < 100
      ) {
        completeHrOne.innerHTML += "&nbsp&nbsp";
      } else {
        completeHrOne.innerHTML += "&nbsp";
      }
    }

    for (var k = 2; k < 4; k++) {
      completeHrTwo.innerHTML += completedOrderNumber[k];

      if (completedOrderNumber[k] < 10) {
        completeHrTwo.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (
        10 <= completedOrderNumber[k] &&
        completedOrderNumber[k] < 100
      ) {
        completeHrTwo.innerHTML += "&nbsp&nbsp";
      } else {
        completeHrTwo.innerHTML += "&nbsp";
      }
    }

    for (var j = 4; j < completedOrderNumber.length; j++) {
      preparingHrThree.innerHTML += completedOrderNumber[j];

      if (completedOrderNumber[j] < 10) {
        completeHrThree.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (
        10 <= completedOrderNumber[j] &&
        completedOrderNumber[j] < 100
      ) {
        completeHrThree.innerHTML += "&nbsp&nbsp";
      } else {
        completeHrThree.innerHTML += "&nbsp";
      }

      completeFontSize(j);
    }
    document.getElementById("completeHrOne").style.fontSize = 21;
    document.getElementById("completeHrTwo").style.fontSize = 21;
    document.getElementById("completeHrOne").style.textAlign = "center";
    document.getElementById("completeHrTwo").style.textAlign = "center";
    document.getElementById("completeHrThree").style.textAlign = "center";
  } else if (
    6 <= completedOrderNumber.length &&
    completedOrderNumber.length < 8
  ) {
    completeHrOne.innerHTML = "";
    completeHrTwo.innerHTML = "";
    completeHrThree.innerHTML = "";
    completeHrFour.innerHTML = "";

    for (var i = 0; i < 2; i++) {
      completeHrOne.innerHTML += completedOrderNumber[i];

      if (completedOrderNumber[i] < 10) {
        completeHrOne.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (
        10 <= completedOrderNumber[i] &&
        completedOrderNumber[i] < 100
      ) {
        completeHrOne.innerHTML += "&nbsp&nbsp";
      } else {
        completeHrOne.innerHTML += "&nbsp";
      }
    }

    for (var k = 2; k < 4; k++) {
      completeHrTwo.innerHTML += completedOrderNumber[k];

      if (completedOrderNumber[k] < 10) {
        completeHrTwo.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (
        10 <= completedOrderNumber[k] &&
        completedOrderNumber[k] < 100
      ) {
        completeHrTwo.innerHTML += "&nbsp&nbsp";
      } else {
        completeHrTwo.innerHTML += "&nbsp";
      }
    }

    for (var j = 4; j < 6; j++) {
      completeHrThree.innerHTML += completedOrderNumber[j];

      if (completedOrderNumber[j] < 10) {
        completeHrThree.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (
        10 <= completedOrderNumber[j] &&
        completedOrderNumber[j] < 100
      ) {
        completeHrThree.innerHTML += "&nbsp&nbsp";
      } else {
        completeHrThree.innerHTML += "&nbsp";
      }
    }

    for (var y = 6; y < completedOrderNumber.length; y++) {
      completeHrFour.innerHTML += completedOrderNumber[y];

      if (completedOrderNumber[y] < 10) {
        completeHrFour.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (
        10 <= completedOrderNumber[y] &&
        completedOrderNumber[y] < 100
      ) {
        completeHrFour.innerHTML += "&nbsp&nbsp";
      } else {
        completeHrFour.innerHTML += "&nbsp";
      }

      completeFontSize(y);
    }
    document.getElementById("completeHrOne").style.fontSize = 21;
    document.getElementById("completeHrTwo").style.fontSize = 21;
    document.getElementById("completeHrThree").style.fontSize = 21;
    document.getElementById("completeHrOne").style.textAlign = "center";
    document.getElementById("completeHrTwo").style.textAlign = "center";
    document.getElementById("completeHrThree").style.textAlign = "center";
    document.getElementById("completeHrFour").style.textAlign = "center";
  } else {
    completeHrOne.innerHTML = "";
    completeHrTwo.innerHTML = "";
    completeHrThree.innerHTML = "";
    completeHrFour.innerHTML = "";

    for (var i = 0; i < 4; i++) {
      preparingHrOne.innerHTML += completedOrderNumber[i];

      if (completedOrderNumber[i] < 10) {
        preparingHrOne.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[i] && orderNumber[i] < 100) {
        preparingHrOne.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrOne.innerHTML += "&nbsp";
      }
    }

    for (var k = 4; k < 8; k++) {
      preparingHrTwo.innerHTML += orderNumber[k];

      if (orderNumber[k] < 10) {
        preparingHrTwo.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[k] && orderNumber[k] < 100) {
        preparingHrTwo.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrTwo.innerHTML += "&nbsp";
      }
    }

    for (var j = 8; j < 12; j++) {
      preparingHrThree.innerHTML += orderNumber[j];

      if (orderNumber[j] < 10) {
        preparingHrThree.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[j] && orderNumber[j] < 100) {
        preparingHrThree.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrThree.innerHTML += "&nbsp";
      }
    }

    for (var y = 12; y < 16; y++) {
      preparingHrFour.innerHTML += orderNumber[y];

      if (orderNumber[y] < 10) {
        preparingHrFour.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[y] && orderNumber[y] < 100) {
        preparingHrFour.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrFour.innerHTML += "&nbsp";
      }
    }
    document.getElementById("completeHrOne").style.fontSize = 21;
    document.getElementById("completeHrTwo").style.fontSize = 21;
    document.getElementById("completeHrThree").style.fontSize = 21;
    document.getElementById("completeHrFour").style.fontSize = 21;
    document.getElementById("preparingHrOne").style.textAlign = "center";
    document.getElementById("preparingHrTwo").style.textAlign = "center";
    document.getElementById("preparingHrThree").style.textAlign = "center";
    document.getElementById("preparingHrFour").style.textAlign = "center";

    preparingHrFive.innerHTML = "waiting...";
    document.getElementById("preparingHrFive").style.textAlign = "center";
  }
}

function preparinglayout() {
  if (orderNumber.length < 5) {
    preparingHrOne.innerHTML = "";

    for (var i = 0; i < orderNumber.length; i++) {
      preparingHrOne.innerHTML += orderNumber[i];

      if (orderNumber[i] < 10) {
        preparingHrOne.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[i] && orderNumber[i] < 100) {
        preparingHrOne.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrOne.innerHTML += "&nbsp";
      }
      preparingFontSize(i);
    }
    document.getElementById("preparingHrOne").style.textAlign = "center";
    document.getElementById("preparingHrOne").style.color = "white";
  } else if (5 <= orderNumber.length && orderNumber.length < 9) {
    preparingHrOne.innerHTML = "";
    preparingHrTwo.innerHTML = "";

    for (var i = 0; i < 4; i++) {
      preparingHrOne.innerHTML += orderNumber[i];

      if (orderNumber[i] < 10) {
        preparingHrOne.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[i] && orderNumber[i] < 100) {
        preparingHrOne.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrOne.innerHTML += "&nbsp";
      }
    }

    for (var k = 4; k < orderNumber.length; k++) {
      preparingHrTwo.innerHTML += orderNumber[k];

      if (orderNumber[k] < 10) {
        preparingHrTwo.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[k] && orderNumber[k] < 100) {
        preparingHrTwo.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrTwo.innerHTML += "&nbsp";
      }
      preparingFontSize(k);
    }
    document.getElementById("preparingHrOne").style.fontSize = 15;
    document.getElementById("preparingHrOne").style.textAlign = "center";
    document.getElementById("preparingHrOne").style.color = "white";
    document.getElementById("preparingHrTwo").style.textAlign = "center";
    document.getElementById("preparingHrTwo").style.color = "white";
  } else if (9 <= orderNumber.length && orderNumber.length < 13) {
    preparingHrOne.innerHTML = "";
    preparingHrTwo.innerHTML = "";
    preparingHrThree.innerHTML = "";

    for (var i = 0; i < 4; i++) {
      preparingHrOne.innerHTML += orderNumber[i];

      if (orderNumber[i] < 10) {
        preparingHrOne.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[i] && orderNumber[i] < 100) {
        preparingHrOne.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrOne.innerHTML += "&nbsp";
      }
    }

    for (var k = 4; k < 8; k++) {
      preparingHrTwo.innerHTML += orderNumber[k];

      if (orderNumber[k] < 10) {
        preparingHrTwo.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[k] && orderNumber[k] < 100) {
        preparingHrTwo.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrTwo.innerHTML += "&nbsp";
      }
    }

    for (var j = 8; j < orderNumber.length; j++) {
      preparingHrThree.innerHTML += orderNumber[j];

      if (orderNumber[j] < 10) {
        preparingHrThree.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[j] && orderNumber[j] < 100) {
        preparingHrThree.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrThree.innerHTML += "&nbsp";
      }
      preparingFontSize(j);
    }
    document.getElementById("preparingHrOne").style.fontSize = 15;
    document.getElementById("preparingHrTwo").style.fontSize = 15;
    document.getElementById("preparingHrOne").style.textAlign = "center";
    document.getElementById("preparingHrOne").style.color = "white";
    document.getElementById("preparingHrTwo").style.textAlign = "center";
    document.getElementById("preparingHrTwo").style.color = "white";
    document.getElementById("preparingHrThree").style.textAlign = "center";
    document.getElementById("preparingHrThree").style.color = "white";
  } else if (13 <= orderNumber.length && orderNumber.length < 17) {
    preparingHrOne.innerHTML = "";
    preparingHrTwo.innerHTML = "";
    preparingHrThree.innerHTML = "";
    preparingHrFour.innerHTML = "";

    for (var i = 0; i < 4; i++) {
      preparingHrOne.innerHTML += orderNumber[i];

      if (orderNumber[i] < 10) {
        preparingHrOne.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[i] && orderNumber[i] < 100) {
        preparingHrOne.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrOne.innerHTML += "&nbsp";
      }
    }

    for (var k = 4; k < 8; k++) {
      preparingHrTwo.innerHTML += orderNumber[k];

      if (orderNumber[k] < 10) {
        preparingHrTwo.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[k] && orderNumber[k] < 100) {
        preparingHrTwo.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrTwo.innerHTML += "&nbsp";
      }
    }

    for (var j = 8; j < 12; j++) {
      preparingHrThree.innerHTML += orderNumber[j];

      if (orderNumber[j] < 10) {
        preparingHrThree.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[j] && orderNumber[j] < 100) {
        preparingHrThree.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrThree.innerHTML += "&nbsp";
      }
    }

    for (var y = 12; y < orderNumber.length; y++) {
      preparingHrFour.innerHTML += orderNumber[y];

      if (orderNumber[y] < 10) {
        preparingHrFour.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[y] && orderNumber[y] < 100) {
        preparingHrFour.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrFour.innerHTML += "&nbsp";
      }
      preparingFontSize(y);
    }
    document.getElementById("preparingHrOne").style.fontSize = 15;
    document.getElementById("preparingHrTwo").style.fontSize = 15;
    document.getElementById("preparingHrThree").style.fontSize = 15;
    document.getElementById("preparingHrOne").style.textAlign = "center";
    document.getElementById("preparingHrOne").style.color = "white";
    document.getElementById("preparingHrTwo").style.textAlign = "center";
    document.getElementById("preparingHrTwo").style.color = "white";
    document.getElementById("preparingHrThree").style.textAlign = "center";
    document.getElementById("preparingHrThree").style.color = "white";
    document.getElementById("preparingHrFour").style.textAlign = "center";
    document.getElementById("preparingHrFour").style.color = "white";
  } else {
    preparingHrOne.innerHTML = "";
    preparingHrTwo.innerHTML = "";
    preparingHrThree.innerHTML = "";
    preparingHrFour.innerHTML = "";

    for (var i = 0; i < 4; i++) {
      preparingHrOne.innerHTML += orderNumber[i];

      if (orderNumber[i] < 10) {
        preparingHrOne.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[i] && orderNumber[i] < 100) {
        preparingHrOne.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrOne.innerHTML += "&nbsp";
      }
    }

    for (var k = 4; k < 8; k++) {
      preparingHrTwo.innerHTML += orderNumber[k];

      if (orderNumber[k] < 10) {
        preparingHrTwo.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[k] && orderNumber[k] < 100) {
        preparingHrTwo.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrTwo.innerHTML += "&nbsp";
      }
    }

    for (var j = 8; j < 12; j++) {
      preparingHrThree.innerHTML += orderNumber[j];

      if (orderNumber[j] < 10) {
        preparingHrThree.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[j] && orderNumber[j] < 100) {
        preparingHrThree.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrThree.innerHTML += "&nbsp";
      }
    }

    for (var y = 12; y < 16; y++) {
      preparingHrFour.innerHTML += orderNumber[y];

      if (orderNumber[y] < 10) {
        preparingHrFour.innerHTML += "&nbsp&nbsp&nbsp";
      } else if (10 <= orderNumber[y] && orderNumber[y] < 100) {
        preparingHrFour.innerHTML += "&nbsp&nbsp";
      } else {
        preparingHrFour.innerHTML += "&nbsp";
      }
    }
    document.getElementById("preparingHrOne").style.fontSize = 15;
    document.getElementById("preparingHrTwo").style.fontSize = 15;
    document.getElementById("preparingHrThree").style.fontSize = 15;
    document.getElementById("preparingHrFour").style.fontSize = 15;
    document.getElementById("preparingHrOne").style.textAlign = "center";
    document.getElementById("preparingHrOne").style.color = "white";
    document.getElementById("preparingHrTwo").style.textAlign = "center";
    document.getElementById("preparingHrTwo").style.color = "white";
    document.getElementById("preparingHrThree").style.textAlign = "center";
    document.getElementById("preparingHrThree").style.color = "white";
    document.getElementById("preparingHrFour").style.textAlign = "center";
    document.getElementById("preparingHrFour").style.color = "white";

    preparingHrFive.innerHTML = "waiting...";
    document.getElementById("preparingHrFive").style.textAlign = "center";
  }
}
