import jsPDF from "jspdf";
import Swal from "sweetalert2";

const exportDocument = async (type = "pdf", title = "note", editorRef) => {
  const PRIMARY = "#00d616";
  const contentHTML = editorRef.current?.innerHTML || "";

  if (!contentHTML || contentHTML.trim().length === 0) {
    Swal.fire({
      icon: "error",
      title: "Export failed",
      text: "Document content is empty.",
    });
    return;
  }

  const styles = `
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");
@font-face {
  font-family: "QuranFont";
  src: url("/fonts/QuranFont.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "QuranSurah";
  src: url("/fonts/QuranSurah.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}
    body { font-family: 'Poppins', sans-serif; color: #111827; font-size: 12pt; }
    .note-title { font-size: 18pt; font-weight: 700; color: ${PRIMARY}; margin-bottom: 4mm; }
    .note-meta { font-size: 10pt; color: #6b7280; margin-bottom: 6mm; }
    .note-content { font-size: 12pt; line-height: 1.6; }
    img { max-width: 100%; }
  `;

  // Export as HTML
  if (type === "html") {
    const htmlDoc = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="note-title">${title}</div>
        <div class="note-meta">Exported: ${new Date().toLocaleString()}</div>
        <div class="note-content">${contentHTML}</div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlDoc], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\W+/g, "_")}.html`;
    link.click();
    Swal.fire({
      icon: "success",
      title: "HTML exported!",
      timer: 1500,
      showConfirmButton: false,
    });
    return;
  }

  // Otherwise, Export as PDF (text-based)
  const { value: opts } = await Swal.fire({
    title: "📄 Export PDF Settings",
    html: `
      <label>Orientation:</label>
      <select id="ori" class="swal2-input"><option value="p">Portrait</option><option value="l">Landscape</option></select>
      <label>Margin (mm):</label>
      <input id="mar" type="number" value="15" min="5" max="50" class="swal2-input" />
    `,
    focusConfirm: false,
    preConfirm: () => ({
      orientation: document.getElementById("ori").value,
      margin: parseInt(document.getElementById("mar").value || "15"),
    }),
    confirmButtonText: "Export PDF",
    showCancelButton: true,
    confirmButtonColor: PRIMARY,
  });

  if (!opts) return;

  Swal.fire({
    title: "Generating PDF...",
    html: "Please wait",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const pdf = new jsPDF({
      orientation: opts.orientation,
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // Create printable HTML
    const fullHTML = `
      <style>${styles}</style>
      <div class="note-title">${title}</div>
      <div class="note-meta">Exported: ${new Date().toLocaleString()}</div>
      <div class="note-content">${contentHTML}</div>
    `;

    // Convert HTML directly to text PDF (no image)
    await pdf.html(fullHTML, {
      margin: [opts.margin, opts.margin, opts.margin, opts.margin],
      autoPaging: "text",
      width: 190, // roughly A4 inner width
      windowWidth: 800,
      callback: function (doc) {
        doc.save(`${title.replace(/\W+/g, "_")}.pdf`);
        Swal.fire({
          icon: "success",
          title: "PDF ready!",
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  } catch (err) {
    console.error("PDF export error:", err);
    Swal.fire({
      icon: "error",
      title: "Export failed",
      html: `<pre style="white-space:pre-wrap">${err.message || err}</pre>`,
    });
  }
};

export default exportDocument;
