import ExcelJS from 'exceljs';

// Check if localStorage is available
function isLocalStorageAvailable() {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

if (!isLocalStorageAvailable()) {
  console.error('LocalStorage is not available. Archiving and exporting features will not work.');
  return;
}

async function exportArchivedNewsToExcel() {
  const archivedNews = JSON.parse(localStorage.getItem('archivedNews')) || [];
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Archived News');

  // Add headers
  worksheet.columns = [
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Description', key: 'description', width: 50 },
    { header: 'Published At', key: 'publishedAt', width: 20 },
    { header: 'URL', key: 'url', width: 50 },
  ];

  // Add rows
  archivedNews.forEach((article) => {
    worksheet.addRow(article);
  });

  // Export to Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'archived-news.xlsx';
  a.click();

  URL.revokeObjectURL(url);
}

document.getElementById('export-button').addEventListener('click', exportArchivedNewsToExcel);