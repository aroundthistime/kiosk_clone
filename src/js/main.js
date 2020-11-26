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

  const csvBtn = document.getElementById('export-csv');
  csvBtn.addEventListener('click', () => {
    const fileName = 'file.csv';
    const BOM = '\uFEFF';
    const table = document.querySelector('.table-area table');
    let csvString = BOM;
    for(let rowCount = 0; rowCount < table.rows.length; rowCount++) {
      let rowData = table.rows[rowCount].cells;
      for(let colCount = 0; colCount < rowData.length; colCount++) {
        let colData = rowData[colCount].innerHTML;
        if(colData === null || colData.length === 0) {    // 따옴표 처리
          colData = "".replace(/"/g, '""');
        } else {
          colData = colData.toString().replace(/"/g,'""');
        }
        csvString = csvString + '"' + colData + '",';
      }
      csvString = csvString.substring(0, csvString.length - 1);
      csvString = csvString + "\r\n";
    }
    csvString = csvString.substring(0, csvString.length - 1);

    const blob = new Blob([csvString], { type: 'text/csv; charset=utf8' });
    const csvUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    a.setAttribute('href', csvUrl);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);

    a.click();
    a.remove();
  })

});
