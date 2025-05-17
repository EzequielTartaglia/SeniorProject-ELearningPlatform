import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { calculateTextYOffset } from "../helpers/calculateTextYOffset";

export async function generateAuditDocumentTemplatePDF(
  auditDocumentTemplateInfo,
  auditDocumentTemplateCheckpointsInfo
) {
  const pdfDoc = await PDFDocument.create();
  const pageHeight = 842; // A4
  const pageWidth = 800; // A4
  const margin = 50;
  let YPosition = pageHeight - margin - 25;
  
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);

  // Función para agregar nueva página si se necesita
  function addNewPageIfNeeded() {
    if (YPosition < 180) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      YPosition = pageHeight - margin - 25;
    }
  }

  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const logoFileName = process.env.NEXT_PUBLIC_LOGO_FILE_NAME;
  const logoUrl = `${domain}/${logoFileName}`;

  try {
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(
      StandardFonts.TimesRomanBold
    );

    const logoImageBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoImageWidth = 150;
    const logoImageHeight = (logoImage.height / logoImage.width) * logoImageWidth;

    currentPage.drawImage(logoImage, {
      x: margin + 550,
      y: pageHeight - logoImageHeight - margin,
      width: logoImageWidth,
      height: logoImageHeight,
    });

    YPosition = pageHeight - margin - 25;

    // Título
    currentPage.drawText("Control de auditoria", {
      x: margin,
      y: YPosition,
      size: 24,
      font: timesRomanBoldFont,
      maxWidth: 500,
      color: rgb(0, 0, 0),
    });

    YPosition -= 25;
    currentPage.drawText("Información del documento:", {
      x: margin,
      y: YPosition,
      size: 18,
      font: timesRomanBoldFont,
      maxWidth: 500,
      color: rgb(0, 0, 0),
    });

    YPosition -= 25;

    const auditDocumentTemplateDetails = [
      {
        label: "Nombre del documento:",
        value: auditDocumentTemplateInfo.title || "N/A",
      },
      {
        label: "Descripcion:",
        value: auditDocumentTemplateInfo.description || "N/A",
      },
    ];

    auditDocumentTemplateDetails.forEach(({ label, value }) => {
      currentPage.drawText(label, {
        x: margin,
        y: YPosition,
        size: 14,
        font: timesRomanBoldFont,
        maxWidth: 500,
        color: rgb(0, 0, 0),
      });
      currentPage.drawText(value, {
        x: margin + 180,
        y: YPosition,
        size: 14,
        font: timesRomanFont,
        maxWidth: 500,
        color: rgb(0, 0, 0),
      });
      YPosition -= 80;
    });

    // Divisor
    YPosition -= 40;
    currentPage.drawLine({
      start: { x: margin, y: YPosition },
      end: { x: pageWidth - margin, y: YPosition },
      color: rgb(0.8, 0.8, 0.8),
      thickness: 1,
    });

    // Puntos de auditoría
    const checkpoints = auditDocumentTemplateCheckpointsInfo || [];

    if (checkpoints.length > 0) {
      YPosition -= 30;
      currentPage.drawText("Puntos de auditoría:", {
        x: margin,
        y: YPosition,
        size: 18,
        font: timesRomanBoldFont,
        maxWidth: 500,
        color: rgb(0, 0, 0),
      });
      YPosition -= 25;

      checkpoints.forEach((checkpoint, index) => {
        YPosition -= 25;

        const sectionName = checkpoint.section_name || "Seccion no disponible";
        const title = checkpoint.title || `Pregunta ${index + 1}`;
        const description = checkpoint.description;

        // Calcular desplazamientos Y dinámicamente
        const sectionNameYOffset = calculateTextYOffset(sectionName);
        const titleYOffset = calculateTextYOffset(title);
        const descriptionYOffset = calculateTextYOffset(description);

        addNewPageIfNeeded();
        currentPage.drawText(`Seccion:`, {
          x: margin,
          y: YPosition,
          size: 14,
          font: timesRomanBoldFont,
          maxWidth: 500,
          color: rgb(0, 0, 0),
        });
        currentPage.drawText(sectionName, {
          x: margin + 180,
          y: YPosition,
          size: 14,
          font: timesRomanFont,
          maxWidth: 500,
          color: rgb(0, 0, 0),
        });

        YPosition -= sectionNameYOffset;

        addNewPageIfNeeded();
        
        currentPage.drawText(`Título:`, {
          x: margin,
          y: YPosition,
          size: 14,
          font: timesRomanBoldFont,
          maxWidth: 500,
          color: rgb(0, 0, 0),
        });
        currentPage.drawText(title, {
          x: margin + 180,
          y: YPosition,
          size: 14,
          font: timesRomanFont,
          maxWidth: 500,
          color: rgb(0, 0, 0),
        });
        YPosition -= titleYOffset;
        
        if (description) {
          addNewPageIfNeeded();
          currentPage.drawText(`Descripción:`, {
            x: margin,
            y: YPosition,
            size: 14,
            font: timesRomanBoldFont,
            maxWidth: 500,
            color: rgb(0, 0, 0),
          });
          currentPage.drawText(description, {
            x: margin + 180,
            y: YPosition,
            size: 14,
            font: timesRomanFont,
            maxWidth: 500,
            color: rgb(0, 0, 0),
          });

          YPosition -= descriptionYOffset;
        }

        // Opciones de puntuación
        const scoreOptions = [
          { option: "a", description: "No verificado" },
          { option: "b", description: "Implementado" },
          { option: "c", description: "Parcialmente implementado" },
          { option: "d", description: "No implementado" },
          { option: "e", description: "No aplica" },
        ];

        addNewPageIfNeeded();
        currentPage.drawText("Opciones de puntuación:", {
          x: margin,
          y: YPosition,
          size: 14,
          font: timesRomanBoldFont,
          maxWidth: 500,
          color: rgb(0, 0, 0),
        });
        YPosition -= 20;

        scoreOptions.forEach(({ option, description }, idx) => {
          currentPage.drawText(`${option}. ${description}`, {
            x: margin + 20,
            y: YPosition,
            size: 14,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          YPosition -= 15;
        });

        YPosition -= 10;

        currentPage.drawLine({
          start: { x: margin, y: YPosition },
          end: { x: pageWidth - margin, y: YPosition },
          color: rgb(0.8, 0.8, 0.8),
          thickness: 1,
        });
        YPosition -= 15;
      });

      // Tabla de puntuación final
      addNewPageIfNeeded();
      YPosition -= 20;
      currentPage.drawText("Tabla de puntuación final:", {
        x: margin,
        y: YPosition,
        size: 18,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
      YPosition -= 35;

      const tableHeaders = ["Puntuación", "Total", "Comentarios"];
      const columnWidths = [200, 100, 400];
      const tableRows = [
        ["No verificado", "__________"],
        ["Implementado", "__________"],
        ["Parcialmente implementado", "__________"],
        ["No implementado", "__________"],
        ["No aplica", "__________"],
      ];

      // Dibujar los encabezados de la tabla
      tableHeaders.forEach((header, index) => {
        const x =
          margin +
          columnWidths.slice(0, index).reduce((acc, width) => acc + width, 0);
        currentPage.drawText(header, {
          x:
            x +
            (columnWidths[index] -
              timesRomanFont.widthOfTextAtSize(header, 14)) / 2,
          y: YPosition,
          size: 14,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        });
      });
      YPosition -= 20;

      // Dibujar las filas de la tabla
      tableRows.forEach((row) => {
        row.forEach((cell, index) => {
          const x =
            margin +
            columnWidths.slice(0, index).reduce((acc, width) => acc + width, 0);
          currentPage.drawText(cell.toString(), {
            x:
              x +
              (columnWidths[index] -
                timesRomanFont.widthOfTextAtSize(cell.toString(), 14)) / 2,
            y: YPosition,
            size: 14,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
        });
        YPosition -= 20;
      });

      const tableHeight = tableRows.length * 20 + 30;
      const tableWidth = columnWidths.reduce((acc, curr) => acc + curr, 0);

      currentPage.drawRectangle({
        x: margin,
        y: YPosition + 10,
        width: tableWidth,
        height: tableHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      let currentX = margin;
      tableHeaders.forEach((_, index) => {
        currentPage.drawLine({
          start: {
            x: currentX + columnWidths[index],
            y: YPosition + 10,
          },
          end: {
            x: currentX + columnWidths[index],
            y: YPosition + tableHeight,
          },
          color: rgb(0, 0, 0),
          thickness: 1,
        });
        currentX += columnWidths[index];
      });
    }

    // Finaliza y devuelve el documento PDF generado
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error(error);
    throw new Error("Error al generar el documento PDF");
  }
}
