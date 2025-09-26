import Papa from 'papaparse';

export const parseCSV = (file: File): Promise<{ data: any[], columns: string[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          return;
        }
        
        const data = results.data.map((row: any, index: number) => ({
          ...row,
          id: `row-${index}`,
        }));
        
        const columns = results.meta.fields || [];
        resolve({ data, columns });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const downloadCSV = (data: any[], filename: string = 'mapped-data.csv') => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

