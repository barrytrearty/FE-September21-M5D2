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
      { text: blogObject.category, style: "subHeader" },
      { text: blogObject.title, style: "header" },
      { text: blogObject.author.name, style: "subHeader" },
      { text: blogObject.content },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: 10,
      },
      subHeader: {
        fontSize: 13,
        bold: true,
        margin: 10,
      },
    },
  };

  //   const options = {
  //     // ...
  //   };

  const pdfDoc = printer.createPdfKitDocument(docDefinition, {});
  pdfDoc.end();

  //pdfDoc is a readable stream in pdf format

  return pdfDoc;
};
