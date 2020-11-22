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
      dateEl.innerText = info.dateStr + ' ';
    }
  });
  calendar.render();

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
