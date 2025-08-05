export const downloadCsv = (csvData: string, filename?: string) => {
  // Create a blob from the CSV string
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  // Set the download attributes
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    filename ||
      `price-monitor-products-${new Date().toISOString().split('T')[0]}.csv`
  );
  link.style.visibility = 'hidden';

  // Append to document, click, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
};
