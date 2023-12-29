document.getElementById('generatePdf').addEventListener('click', async () => {
    const fileInput = document.getElementById('pdfInput');
    if (fileInput.files.length === 0) {
        alert('Please select one or more PDF files.');
        return;
    }

    const newPdfDoc = await PDFLib.PDFDocument.create();

    for (const file of fileInput.files) {
        const originalPdf = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(originalPdf);

        // Copy the first two pages of each PDF
        const numPages = Math.min(1, pdfDoc.getPageCount());
        for (let i = 0; i < numPages; i++) {
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
            newPdfDoc.addPage(copiedPage);
        }
    }

    // Save and download the new concatenated PDF
    const pdfBytes = await newPdfDoc.save();
    download(pdfBytes, "final.pdf", "application/pdf");
});

function download(data, filename, type) {
    const file = new Blob([data], {type: type});
    const a = document.getElementById("downloadLink");
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.style.display = 'block';
    a.click();
}