import axios from 'axios';
import moment from 'moment';

if (window.location.pathname === '/salesControll') {

  const RECORD_CONTENT_CLASSNAME = '.content-area__record-content';       // 특이사항 내용 클래스명
  const RECORD_TITLE_CLASSNAME = '.title-area__record-title#record-date'; // 특이사항 제목 클래스명
  const NO_REACORD_MESSAGE = '기록된 사항이 없습니다.'; // 특이사항 없을 시 출력 메시지
  const DATE_FORMAT = 'YYYY-MM-DD'; // 날짜 출력 형식 지정
  const editButton = document.querySelector('.far.fa-edit');
  const cancelButton = document.querySelector('.button-area__button--cancel');
  const textarea = document.querySelector('.editable-area');
  const alertMsg = document.querySelector(RECORD_CONTENT_CLASSNAME);
  const textareaRecord = document.getElementById('input-record');

  let editStatus; // 레코드의 현재 수정 상태를 저장
  let records;

  // 특이사항 수정 입력 폼 변경 가능 상태로 생성 함수
  const setEditable = () => {
    editStatus = editButton.style.display;

    if (editStatus === 'inline') {
      alertMsg.style.display = 'none';
      editButton.style.display = 'none';
      textarea.style.display = 'flex';
    } else {
      textarea.style.display = 'none';
      alertMsg.style.display = 'block';
      editButton.style.display = 'inline';
    }
  };

  // 특이사항 변경 기록 반영 함수
  const editHandler = async () => {
    const today = document.querySelector(RECORD_TITLE_CLASSNAME).textContent;
    const records = await axios.get('api/get-all-records');
    const record = records.data.find(
      (record) =>
        record.content && moment(record.date).format(DATE_FORMAT) === today
    );
    record
      ? (textareaRecord.value = record.content)
      : (textareaRecord.value = '');
  };

  // 특이사항 기록 제출 form 이벤트 정의
  const form = document.getElementById('record-form');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const today = document.querySelector(RECORD_TITLE_CLASSNAME)
        .textContent;

      const content = document.getElementById('input-record').value;
      textarea.style.display = 'none';
      alertMsg.style.display = 'block';
      editButton.style.display = 'inline';

      const { data } = await axios.post('api/submit-record', {
        date: today,
        content,
      });

      records = data;
      localStorage.setItem('records', JSON.stringify(records));

      const recordEl = document.querySelector(RECORD_CONTENT_CLASSNAME);
      recordEl.innerText = content ? content : NO_REACORD_MESSAGE;

      const daysOnCalendar = document.querySelectorAll('.fc-daygrid-day.fc-day');
      daysOnCalendar.forEach((day) => {
        const date = day.getAttribute('data-date');
        records.forEach((record) => {
          const theDay = moment(record.date).format(DATE_FORMAT);
          if (theDay === date && record.content) {
            day.classList.add('with-record');
          }
        });
      });

      const withRecords = document.querySelectorAll('.fc-daygrid-day.fc-day.with-record');
      withRecords.forEach((withRecord) => {
        let flag = false;
        const date = withRecord.getAttribute('data-date');
        records.some((record) => {
          const theDay = moment(record.date).format(DATE_FORMAT);
          if (theDay === date && record.content) {
            flag = true;
          }
        });

        if (!flag) withRecord.classList.remove('with-record');
      });
    });
  }

  if (editButton && cancelButton) {
    editButton.addEventListener('click', setEditable);
    cancelButton.addEventListener('click', setEditable);
    editButton.addEventListener('click', editHandler);
  }
}