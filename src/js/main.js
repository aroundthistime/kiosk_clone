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
});
