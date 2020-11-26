import moment from 'moment';

// 달력 관련 설정
document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    aspectRatio: 1,
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    selectable: true,
    dateClick: (info) => {
      const dateEl = document.getElementById('record-date');
      const recordEl = document.querySelector('.record-content');
      const datesWithRecord = localStorage.getItem('records');
      const arrayDates = JSON.parse(datesWithRecord);
      const record = arrayDates.find(el => el.content && moment(el.date).format('YYYY-MM-DD') === info.dateStr);
      dateEl.innerText = info.dateStr;
      record ? recordEl.innerText = record.content : recordEl.innerText = "기록된 사항이 없습니다.";
    
      const editButton = document.querySelector('.far.fa-edit');
      const textarea = document.querySelector('.editable-area');
      const alertMsg = document.querySelector('.record-content');

      textarea.style.display = 'none';
      alertMsg.style.display = 'block';
      editButton.style.display = 'inline';
    }
  });
  calendar.render();



  let ttt = document.querySelectorAll('.fc-daygrid-day.fc-day');
  const datesWithRecord = localStorage.getItem('records');
  const arrayDates = JSON.parse(datesWithRecord);

  ttt.forEach(el => {
    const date = el.getAttribute('data-date');
    arrayDates.forEach(d => {
      const dd = moment(d.date).format('YYYY-MM-DD');
      if(dd === date && d.content) {
        el.classList.add('with-record');
      }
    })
  })

  const prevBtn = document.querySelector('.fc-prev-button');
  const nextBtn = document.querySelector('.fc-next-button');

  prevBtn.addEventListener('click', () => {
    const datesWithRecord = localStorage.getItem('records');
    const arrayDates = JSON.parse(datesWithRecord);
    ttt = document.querySelectorAll('.fc-daygrid-day.fc-day');
    ttt.forEach(el => {
      const date = el.getAttribute('data-date');
      arrayDates.forEach(d => {
        const dd = moment(d.date).format('YYYY-MM-DD');
        if(dd === date && d.content) {
          el.classList.add('with-record');
        }
      })
    })
  })
  nextBtn.addEventListener('click', () => {
    const datesWithRecord = localStorage.getItem('records');
    const arrayDates = JSON.parse(datesWithRecord);
    ttt = document.querySelectorAll('.fc-daygrid-day.fc-day');
    ttt.forEach(el => {
      const date = el.getAttribute('data-date');
      arrayDates.forEach(d => {
        const dd = moment(d.date).format('YYYY-MM-DD');
        if(dd === date && d.content) {
          el.classList.add('with-record');
        }
      })
    })
  })

  const chartEl = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(chartEl, {
    type: 'bar',
    data: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      datasets: [{
          label: '단위(만원) ',
          data: [120, 190, 30, 50, 20, 30, 20, 20 ,30, 40, 80],
          backgroundColor: [
            'rgba(36, 102, 250, 0.2)', 'rgba(36, 12, 50, 0.2)', 'rgba(3, 102, 20, 0.2)', 'rgba(36, 182, 50, 0.2)',
            'rgba(136, 202, 200, 0.2)', 'rgba(36, 182, 50, 0.2)', 'rgba(36, 202, 150, 0.2)', 'rgba(60, 12, 250, 0.2)',
            'rgba(36, 122, 150, 0.2)', 'rgba(236, 152, 250, 0.2)', 'rgba(136, 152, 250, 0.2)', 'rgba(160, 12, 50, 0.2)',
          ],
          borderWidth: 2
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
    }
  }); 
});
