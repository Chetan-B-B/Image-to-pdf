import pdfkit from "pdfkit";
import blobstrem from "blob-stream";

const inputfile = document.querySelector(".inputfile");
const convert = document.querySelector("#convert");
const page = document.querySelector("#page");
let pageSize = "A4";
page.addEventListener("change", (e) => {
  pageSize = e.target.value;
});

//page width and height based on pageSize

const PAGEWH = {
  A1: {
    width: 1683.78,
    height: 2383.94,
  },
  A2: { width: 1190.55, height: 1683.78 },
  A3: { width: 841.89, height: 1190.55 },
  A4: { width: 595.28, height: 841.89 },
  A5: { width: 419.53, height: 595.28 },
  A6: { width: 297.64, height: 419.53 },
  A7: { width: 209.76, height: 297.64 },
  A8: { width: 147.4, height: 209.76 },
  A9: { width: 104.88, height: 147.4 },
};

inputfile.addEventListener("change", async (e) => {
  e.preventDefault();
  const doc = new pdfkit({ size: pageSize });
  const stream = doc.pipe(blobstrem());
  let len = e.target.files.length;

  for (const [_, value] of Object.entries(e.target.files)) {
    const read = await value.arrayBuffer();

    doc.image(Buffer.from(read), 0, 15, {
      align: "center",
      valign: "center",
      // width: 650,
      width: PAGEWH[pageSize].width,
      height: PAGEWH[pageSize].height,
    });

    //to prevent extra adding page
    len > 1 && doc.addPage();
    len--;
  }
  doc.end();
  stream.on("finish", () => {
    convert.href = stream.toBlobURL("application/pdf");
  });
});
