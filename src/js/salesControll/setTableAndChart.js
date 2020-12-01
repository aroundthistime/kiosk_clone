import axios from 'axios';
import moment from 'moment';

if (window.location.pathname === '/salesControll') {

  const WARNING_MESSAGE = '범위를 다시 설정해주세요.';
  const BLANK_MESSAGE = '해당 기간의 판매 실적이 없습니다.';
  const DATE_FORMAT = 'YYYY-MM-DD';
  const TABLE_TITLE = ['일자', '품명', '비고', '수량', '단가'];
  const CHART_MENU_INFO = '판매수량(개) ';
  const CHART_SUM_INFO = '단위(만원) '
  const COLSAPN = 5;
  const MONEY_UNIT = 10000;

  document.addEventListener('DOMContentLoaded', () => {
    let toggleStatus = false;
    let myChart;

    const today = moment().format(DATE_FORMAT);
    const tableArea = document.querySelector('.table');
    const chartArea = document.querySelector('.chart');
    const convertBtns = document.querySelectorAll('.button-area__button-convertable--page');
    const searchBtns = document.querySelectorAll('.font-icon.fas.fa-search');

    // 테이블 - 차트 페이지 전환 이벤트 정의
    const convertPage = async () => {
      toggleStatus = !toggleStatus;

      if (toggleStatus) {
        if (myChart) {
          myChart.destroy();
        }

        // 차트 데이터 비동기 통신으로 Fetch
        const chartData = await axios.post('/api/get-orders', {
          start: today,
          end: today,
        });

        // 주문처리가 완료된 주문 내역만 모두 갖고와 데이터 가공
        const orderLists = chartData.data.filter((order) => order.isCompleted);
        const totalMenus = orderLists.map((order) => order.choices);
        const menuWithAmount = {};

        // { 메뉴이름 : 수량 } 형태로 매핑
        totalMenus.forEach((menus) =>
          menus.forEach((menu) =>
            menuWithAmount[menu.menu.nameKr]
              ? (menuWithAmount[menu.menu.nameKr] += menu.amount)
              : (menuWithAmount[menu.menu.nameKr] = menu.amount)
          )
        );

        myChart = makeChart(0, 'menu', menuWithAmount);
        tableArea.style.display = 'none';
        chartArea.style.display = 'block';
      } else {
        tableArea.style.display = 'block';
        chartArea.style.display = 'none';
      }
    };

    // 새로운 데이터 검색 이벤트 정의
    const search = async () => {
      let start, end;
      let newOrders;
      let monthDiff; // 시작-종료 날짜간의 달(months) 기간
      let dayDiff; // 시작-종료 날짜간의 일(days) 기간

      const tableDiv = document.querySelector('.table-area');
      const tableContent = document.querySelector('.table-area table');

      if (toggleStatus) {
        start = document.getElementById('startDate-chart').value;
        end = document.getElementById('endDate-chart').value;
        const mStart = moment(start, DATE_FORMAT);
        const mEnd = moment(end, DATE_FORMAT);
        dayDiff = moment.duration(mEnd.diff(mStart)).days();
        monthDiff = moment.duration(mEnd.diff(mStart)).months();

        if (dayDiff < 0) {
          alert(WARNING_MESSAGE);
          return;
        }

        newOrders = await axios.post('/api/get-orders', { start, end });
      } else {
        start = document.getElementById('startDate-table').value;
        end = document.getElementById('endDate-table').value;
        const mStart = moment(start, DATE_FORMAT);
        const mEnd = moment(end, DATE_FORMAT);
        dayDiff = moment.duration(mEnd.diff(mStart)).days();

        if (dayDiff < 0) {
          alert(WARNING_MESSAGE);
          return;
        }

        newOrders = await axios.post('/api/get-orders', { start, end });
      }

      const orderLists = newOrders.data.filter((order) => order.isCompleted);
      const totalMenus = orderLists.map((order) => order.choices);

      let totalCount = 0; // 전체 주문 수량
      let totalAmount = 0; // 전체 주문 금액
      const menuWithAmount = {}; // { 메뉴이름 : 수량 } 형태로 매핑
      const menuWithCost = {}; // { 메뉴이름 : 금액 } 형태로 매핑

      // 차트용 데이터 Formatting 과정 For { 메뉴이름 : 수량 }
      totalMenus.forEach((menus) =>
        menus.forEach((menu) => (totalCount += menu.amount))
      );
      totalMenus.forEach((menus) =>
        menus.forEach((menu) => (totalAmount += menu.menu.price * menu.amount))
      );
      totalMenus.forEach((menus) => {
        menus.forEach((menu) =>
          menuWithAmount[menu.menu.nameKr]
            ? (menuWithAmount[menu.menu.nameKr] += menu.amount)
            : (menuWithAmount[menu.menu.nameKr] = menu.amount)
        );
      });

      // 차트용 데이터 Formatting 과정 For { 메뉴이름 : 금액 }
      orderLists.forEach((menu) => {
        const price = menu.price / MONEY_UNIT;
        let temp; // 매출액을 소수점 두자리까지 끊어 보여주기 위한 값을 임시 저장

        if (monthDiff) {
          const month = moment(menu.date).format('YYYY-MM');
          menuWithCost[month]
            ? (menuWithCost[month] += price)
            : (menuWithCost[month] = price);
          temp = menuWithCost[month];
          temp = temp.toFixed(2) * 1;
          menuWithCost[month] = temp;
        } else {
          const dates = moment(menu.date).format(DATE_FORMAT);
          menuWithCost[dates]
            ? (menuWithCost[dates] += price)
            : (menuWithCost[dates] = price);
          temp = menuWithCost[dates];
          temp = temp.toFixed(2) * 1;
          menuWithCost[dates] = temp;
        }
      });

      // 차트용 데이터 날짜순 정렬
      const menuWithCostSorted = {};
      Object.keys(menuWithCost)
        .sort()
        .forEach((key) => {
          menuWithCostSorted[key] = menuWithCost[key];
        });

      if (toggleStatus) {
        const category = document.getElementById('select-for-category').value;

        if (myChart) {
          myChart.destroy();
        }

        if (category === 'menu') {
          myChart = makeChart(monthDiff, category, menuWithAmount);
        } else {
          myChart = makeChart(monthDiff, category, menuWithCostSorted);
        }
      } else {
        const table = makeTable(orderLists, totalCount, totalAmount);

        tableDiv.removeChild(tableContent);
        tableDiv.appendChild(table);
      }
    };

    // 정의한 이벤트 등록
    convertBtns.forEach((btn) => btn.addEventListener('click', convertPage));
    searchBtns.forEach((btn) => btn.addEventListener('click', search));
  });

  // 숫자 천 단위로 콤마 생성 함수
  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 테이블 생성 함수
  const makeTable = (orderLists, totalCount, totalAmount) => {
    const table = document.createElement('table');

    const trFirst = document.createElement('tr');
    const trLast = document.createElement('tr');
    trFirst.classList.add('tbody__first-list');
    for (let i = 0; i < COLSAPN; i++) {
      let th = document.createElement('th');
      th.innerText = TABLE_TITLE[i];
      trFirst.appendChild(th);
    }
    table.appendChild(trFirst);

    orderLists
      .sort((prev, next) => prev.date.localeCompare(next.date))
      .forEach((order) => {
        order.choices.forEach((menu) => {
          let tr = document.createElement('tr');
          for (let i = 0; i < COLSAPN; i++) {
            let td = document.createElement('td');
            if (i == 0)
              td.innerText = moment(order.date).format('YYYY-MM-DD HH:mm:ss');
            else if (i == 1) td.innerText = menu.menu.nameKr;
            else if (i == 2) td.innerText = menu.menu.isCombo ? '세트' : '단품';
            else if (i == 3) td.innerText = menu.amount;
            else if (i == 4)
              td.innerText = numberWithCommas(menu.menu.price * menu.amount);
            tr.appendChild(td);
          }
          table.appendChild(tr);
        });
      });

    if (!orderLists.length) {
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      td.innerText = BLANK_MESSAGE;
      td.colSpan = COLSAPN;
      tr.appendChild(td);
      tr.classList.add('tbody__no-list');
      table.appendChild(tr);
    }

    trLast.classList.add('tbody__last-list');
    for (let i = 0; i < COLSAPN; i++) {
      let td = document.createElement('td');
      if (i == 0) td.innerText = '합계';
      else if (i == 3) td.innerText = numberWithCommas(totalCount);
      else if (i == 4) td.innerText = numberWithCommas(totalAmount);
      trLast.appendChild(td);
    }
    table.appendChild(trLast);

    return table;
  };

  // 차트 출력 함수
  const makeChart = (monthDiff = 0, category = 'menu', chartData) => {
    const dynamicColors = () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return 'rgb(' + r + ',' + g + ',' + b + ', 0.2)';
    };

    const chartEl = document.getElementById('myChart').getContext('2d');
    const colors = Object.keys(chartData).map(() => dynamicColors());
    const myChart = new Chart(chartEl, {
      type: category === 'menu' ? 'horizontalBar' : monthDiff ? 'bar' : 'line',
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: category === 'menu' ? CHART_MENU_INFO : CHART_SUM_INFO,
            data: Object.values(chartData),
            fill: monthDiff ? true : false,
            backgroundColor: colors,
            borderColor:
              category === 'menu'
                ? 'horizontalBar'
                : monthDiff
                  ? 'bar'
                  : 'line' === 'line'
                    ? 'rgba(36, 102, 250, 0.65)'
                    : '',
            borderWidth: 2,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    return myChart;
  };
}