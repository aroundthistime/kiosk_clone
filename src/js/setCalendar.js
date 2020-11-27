import moment from 'moment';

document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    aspectRatio: 1, // 달력 가로세로 비율 설정
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
    selectable: true,
    dateClick: (info) => {
      const dateEl = document.getElementById('record-date');
      const recordEl = document.querySelector('.record-content');
      const datesWithRecord = localStorage.getItem('records');
      const arrayDates = JSON.parse(datesWithRecord);
      const record = arrayDates.find(
        (record) =>
          record.content &&
          moment(record.date).format('YYYY-MM-DD') === info.dateStr
      );
      dateEl.innerText = info.dateStr;
      record
        ? (recordEl.innerText = record.content)
        : (recordEl.innerText = '기록된 사항이 없습니다.');

      const editButton = document.querySelector('.far.fa-edit');
      const textarea = document.querySelector('.editable-area');
      const alertMsg = document.querySelector('.record-content');

      textarea.style.display = 'none';
      alertMsg.style.display = 'block';
      editButton.style.display = 'inline';
    },
  });
  calendar.render();

  let daysOnCalendar = document.querySelectorAll('.fc-daygrid-day.fc-day');
  const datesWithRecord = localStorage.getItem('records');
  const arrayDates = JSON.parse(datesWithRecord);

  // 특이사항 기록이 있는 날들 검사
  daysOnCalendar.forEach((day) => {
    const date = day.getAttribute('data-date');
    arrayDates.forEach((record) => {
      const theDay = moment(record.date).format('YYYY-MM-DD');
      if (theDay === date && record.content) {
        day.classList.add('with-record');
      }
    });
  });

  // 달력 이전 달, 다음 달 클릭 이벤트 설정
  const prevBtn = document.querySelector('.fc-prev-button');
  const nextBtn = document.querySelector('.fc-next-button');

  prevBtn.addEventListener('click', () => {
    const datesWithRecord = localStorage.getItem('records');
    const arrayDates = JSON.parse(datesWithRecord);
    daysOnCalendar = document.querySelectorAll('.fc-daygrid-day.fc-day');
    daysOnCalendar.forEach((day) => {
      const date = day.getAttribute('data-date');
      arrayDates.forEach((record) => {
        const theDay = moment(record.date).format('YYYY-MM-DD');
        if (theDay === date && record.content) {
          day.classList.add('with-record');
        }
      });
    });
  });
  nextBtn.addEventListener('click', () => {
    const datesWithRecord = localStorage.getItem('records');
    const arrayDates = JSON.parse(datesWithRecord);
    daysOnCalendar = document.querySelectorAll('.fc-daygrid-day.fc-day');
    daysOnCalendar.forEach((day) => {
      const date = day.getAttribute('data-date');
      arrayDates.forEach((record) => {
        const theDay = moment(record.date).format('YYYY-MM-DD');
        if (theDay === date && record.content) {
          day.classList.add('with-record');
        }
      });
    });
  });
});
