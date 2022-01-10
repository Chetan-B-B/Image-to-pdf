import pdfkit from "pdfkit";
import blobstrem from "blob-stream";

const inputfile = document.querySelector(".inputfile");
const convert = document.querySelector("#convert");

inputfile.addEventListener("change", async (e) => {
  e.preventDefault();
  const doc = new pdfkit();
  const stream = doc.pipe(blobstrem());
  let len = e.target.files.length;
  for (const [_, value] of Object.entries(e.target.files)) {
    const read = await value.arrayBuffer();

    doc.image(Buffer.from(read), 0, 15, {
      align: "center",
      valign: "center",
      width: 650,
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
