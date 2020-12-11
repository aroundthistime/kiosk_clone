import moment from 'moment';

if (window.location.pathname === '/salesControll') {
  const ASPECTRATIO = 1;  // 달력 가로세로 비율 설정
  const calendarEl = document.getElementById('calendar'); // 달력 영역 지정
  const RECORD_TITLE_CLASSNAME = '.content-area__record-content'; // 특이사항 제목 클래스명
  const DATE_FORMAT = 'YYYY-MM-DD'; // 날짜 출력 형식 지정
  const NO_RECORD_MESSAGE = '기록된 사항이 없습니다.'; // 특이사항 기록이 없을 시 출력 메시지
  const CALENDAR_TYPE = 'dayGridMonth'; // 캘린더 출력 형식 리터럴 상수 정의
  const LOCALSTORAGE_RECORD = 'records'; // localstorage에 저장된 레코드 관련 ID

  if (calendarEl) {
    document.addEventListener('DOMContentLoaded', () => {
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: CALENDAR_TYPE,
        aspectRatio: ASPECTRATIO,
        headerToolbar: {
          left: 'prev',
          center: 'title',
          right: 'next',
        },
        selectable: true,
        dateClick: (info) => {
          const dateEl = document.getElementById('record-date');
          const recordEl = document.querySelector(RECORD_TITLE_CLASSNAME);
          const datesWithRecord = localStorage.getItem(LOCALSTORAGE_RECORD);
          const arrayDates = JSON.parse(datesWithRecord);
          const record = arrayDates.find((record) => record.content && moment(record.date).format(DATE_FORMAT) === info.dateStr);

          dateEl.innerText = info.dateStr;
          record ? (recordEl.innerText = record.content) : (recordEl.innerText = NO_RECORD_MESSAGE);

          const editButton = document.querySelector('.far.fa-edit');
          const textarea = document.querySelector('.editable-area');
          const alertMsg = document.querySelector(RECORD_TITLE_CLASSNAME);

          textarea.style.display = 'none';
          alertMsg.style.display = 'block';
          editButton.style.display = 'inline';
        },
      });
      calendar.render();

      let daysOnCalendar = document.querySelectorAll('.fc-daygrid-day.fc-day');
      const datesWithRecord = localStorage.getItem(LOCALSTORAGE_RECORD);
      const arrayDates = JSON.parse(datesWithRecord);

      // 특이사항 기록이 있는 날들 검사
      daysOnCalendar.forEach((day) => {
        const date = day.getAttribute('data-date');
        arrayDates.forEach((record) => {
          const theDay = moment(record.date).format(DATE_FORMAT);
          if (theDay === date && record.content) {
            day.classList.add('with-record');
          }
        });
      });

      // 달력 이전 달, 다음 달 클릭 이벤트 설정
      const prevBtn = document.querySelector('.fc-prev-button');
      const nextBtn = document.querySelector('.fc-next-button');

      prevBtn.addEventListener('click', () => {
        const datesWithRecord = localStorage.getItem(LOCALSTORAGE_RECORD);
        const arrayDates = JSON.parse(datesWithRecord);
        daysOnCalendar = document.querySelectorAll('.fc-daygrid-day.fc-day');
        daysOnCalendar.forEach((day) => {
          const date = day.getAttribute('data-date');
          arrayDates.forEach((record) => {
            const theDay = moment(record.date).format(DATE_FORMAT);
            if (theDay === date && record.content) {
              day.classList.add('with-record');
            }
          });
        });
      });
      nextBtn.addEventListener('click', () => {
        const datesWithRecord = localStorage.getItem(LOCALSTORAGE_RECORD);
        const arrayDates = JSON.parse(datesWithRecord);
        daysOnCalendar = document.querySelectorAll('.fc-daygrid-day.fc-day');
        daysOnCalendar.forEach((day) => {
          const date = day.getAttribute('data-date');
          arrayDates.forEach((record) => {
            const theDay = moment(record.date).format(DATE_FORMAT);
            if (theDay === date && record.content) {
              day.classList.add('with-record');
            }
          });
        });
      });
    });
  }
}
