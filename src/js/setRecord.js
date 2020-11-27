import axios from 'axios';

const editButton = document.querySelector('.far.fa-edit');
const cancelButton = document.querySelector('.cancelBtn');
const textarea = document.querySelector('.editable-area');
const alertMsg = document.querySelector('.record-content');
const textareaRecord = document.getElementById('input-record');

let editStatus;
let records;

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

const editHandler = async () => {
  const today = document.querySelector('.record-title#record-date').textContent;
  const records = await axios.get('api/get-all-records');
  const record = records.data.find(
    (el) => el.content && el.date.substring(0, 10) === today
  );
  record
    ? (textareaRecord.value = record.content)
    : (textareaRecord.value = '');
};

// 특이사항 기록 제출 form 이벤트 정의
const form = document.getElementById('record-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const today = document.querySelector('.record-title#record-date').textContent;

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

  const recordEl = document.querySelector('.record-content');
  recordEl.innerText = content ? content : '기록된 사항이 없습니다.';

  const daysOnCalendar = document.querySelectorAll('.fc-daygrid-day.fc-day');
  daysOnCalendar.forEach((day) => {
    const date = day.getAttribute('data-date');
    records.forEach((record) => {
      const theDay = record.date.substring(0, 10);
      if (theDay === date && record.content) {
        day.classList.add('with-record');
      }
    });
  });

  const withRecords = document.querySelectorAll(
    '.fc-daygrid-day.fc-day.with-record'
  );
  withRecords.forEach((withRecord) => {
    let flag = false;
    const date = withRecord.getAttribute('data-date');
    records.some((record) => {
      const theDay = record.date.substring(0, 10);
      if (theDay === date && record.content) {
        flag = true;
      }
    });

    if (!flag) withRecord.classList.remove('with-record');
  });
});

editButton.addEventListener('click', setEditable);
cancelButton.addEventListener('click', setEditable);
editButton.addEventListener('click', editHandler);
