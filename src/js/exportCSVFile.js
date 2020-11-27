const csvBtn = document.getElementById('export-csv');
csvBtn.addEventListener('click', () => {
  const fileName = 'file.csv';
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
    csvString = csvString.substring(0, csvString.length - 1);
    csvString = csvString + '\r\n';
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
});
