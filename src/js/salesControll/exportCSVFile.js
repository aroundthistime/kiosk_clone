if (window.location.pathname === '/salesControll') {

  const FILENAME = 'file.csv';  // 다운로드 파일이름 저장
  const DOWNLOAD_TYPE = 'text/csv; charset=utf8'; // 다운로드 타입 지정

  const csvBtn = document.querySelector('.button-area__button-export--csv');

  if (csvBtn) {
    csvBtn.addEventListener('click', () => {
      const fileName = FILENAME;
      const BOM = '\uFEFF'; // 개행문자 따옴표 인식문제 방지
      const table = document.querySelector('.table-area table');
      let csvString = BOM;
      for (let rowCount = 0; rowCount < table.rows.length; rowCount++) {
        let rowData = table.rows[rowCount].cells;
        for (let colCount = 0; colCount < rowData.length; colCount++) {
          let colData = rowData[colCount].innerHTML;
          if (colData === null || colData.length === 0) {
            // 따옴표 처리
            colData = ''.replace(/"/g, '""');
          } else {
            colData = colData.toString().replace(/"/g, '""');
          }
          csvString = csvString + '"' + colData + '",';
        }
        // 테이블 줄 단위로 각각 데이터 구분 처리
        csvString = csvString.substring(0, csvString.length - 1);
        csvString = csvString + '\r\n';
      }
      csvString = csvString.substring(0, csvString.length - 1);

      // Binary Large Object로 CSV 파일 생성 후 다운오드
      const blob = new Blob([csvString], { type: DOWNLOAD_TYPE });
      const csvUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      a.setAttribute('href', csvUrl);
      a.setAttribute('download', fileName);
      document.body.appendChild(a);

      a.click();
      a.remove();
    });
  }
}