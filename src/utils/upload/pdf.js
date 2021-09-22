import PdfPrinter from "pdfmake";

export const getPdfReadableStream = (blogObject) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      blogObject.category,
      blogObject.title,
      blogObject.author.name,
      blogObject.content,
      blogObject.readTime.value,
      blogObject.readTime.unit,
    ],
  };

  //   const options = {
  //     // ...
  //   };

  const pdfDoc = printer.createPdfKitDocument(docDefinition, {});
  pdfDoc.end();

  //pdfDoc is a readable stream in pdf format

  return pdfDoc;
};
