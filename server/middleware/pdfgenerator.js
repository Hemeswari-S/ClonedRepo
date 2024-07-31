// generators/pdfGenerator.js
import PDFDocument from 'pdfkit';

export const generatePDF = (data) => {
  const doc = new PDFDocument();
  
  // Set response header
  doc.info['Title'] = 'Data PDF';
  
  // Add some content to the PDF
  doc.fontSize(25).text('Data Report', { align: 'center' });
  doc.moveDown();
  
  // Iterate through data and add it to the PDF
  data.forEach((item, index) => {
    doc.fontSize(12).text(`${index + 1}. ${item}`, { align: 'left' });
    doc.moveDown();
  });

  // Finalize the PDF and end the stream
  doc.end();
  
  return doc;
};
