import formatDate from "@/src/helpers/formatDate";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { calculateTextYOffset } from "../helpers/calculateTextYOffset";

export async function generateAuditDocumentPDF(
  audit,
  auditCheckpoints,
  ratingOptions,
  client,
  templateCheckpoints
) {
  const pdfDoc = await PDFDocument.create();
  const pageHeight = 842; // A4
  const pageWidth = 800; // A4
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  const margin = 50;
  let YPosition = pageHeight - margin - 25;

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

    const logoImageBytes = await fetch(logoUrl).then((res) =>
      res.arrayBuffer()
    );
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoImageWidth = 150;
    const logoImageHeight =
      (logoImage.height / logoImage.width) * logoImageWidth;

    currentPage.drawImage(logoImage, {
      x: margin + 550,
      y: pageHeight - logoImageHeight - margin,
      width: logoImageWidth,
      height: logoImageHeight,
    });

    YPosition = pageHeight - margin - 25;

    // Title
    currentPage.drawText("Auditoria", {
      x: margin,
      y: YPosition,
      size: 24,
      font: timesRomanBoldFont,
      maxWidth: 500,
      color: rgb(0, 0, 0),
    });

    YPosition -= 25;
    currentPage.drawText("Información de la auditoria:", {
      x: margin,
      y: YPosition,
      size: 18,
      font: timesRomanBoldFont,
      maxWidth: 500,
      color: rgb(0, 0, 0),
    });

    YPosition -= 25;

    const auditDetails = [
      { label: "Fecha:", value: formatDate(audit.date) || "N/A" },
      { label: "Cliente:", value: client.name || "N/A" },
    ];

    auditDetails.forEach(({ label, value }) => {
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
      YPosition -= 20;
    });

    // Divider
    YPosition -= 40;
    currentPage.drawLine({
      start: { x: margin, y: YPosition },
      end: { x: pageWidth - margin, y: YPosition },
      color: rgb(0.8, 0.8, 0.8),
      thickness: 1,
    });

    // Questions Section
    const checkpointsTemplates = templateCheckpoints || [];

    if (checkpointsTemplates.length > 0) {
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

      checkpointsTemplates.forEach((checkpointsTemplate, index) => {
        const checkpointAnswer = auditCheckpoints.find(
          (auditCheckpoint) =>
            auditCheckpoint.cc_audit_document_template_checkpoint_id ===
            checkpointsTemplate.id
        );

        if (checkpointAnswer) {
          YPosition -= 25;

          const section_name =
            checkpointsTemplate.section_name || `Sección no disponible`;
          const title = checkpointsTemplate.title || `Pregunta ${index + 1}`;
          const description = checkpointsTemplate.description;
          const checkpointAnswerDescription =
            checkpointAnswer?.description || "Respuesta no disponible";

          const checkpointAnswerHasImage1 =
            checkpointAnswer?.has_image_preview_1 || false;
          const checkpointAnswerImageUrl1 =
            checkpointAnswer?.image_preview_link_1 || false;

          const checkpointAnswerHasImage2 =
            checkpointAnswer?.has_image_preview_2 || false;
          const checkpointAnswerImageUrl2 =
            checkpointAnswer?.image_preview_link_2 || false;

          const checkpointAnswerHasImage3 =
            checkpointAnswer?.has_image_preview_3 || false;
          const checkpointAnswerImageUrl3 =
            checkpointAnswer?.image_preview_link_3 || false;

          const checkpointAnswerHasImage4 =
            checkpointAnswer?.has_image_preview_4 || false;
          const checkpointAnswerImageUrl4 =
            checkpointAnswer?.image_preview_link_4 || false;

          const checkpointAnswerHasImage5 =
            checkpointAnswer?.has_image_preview_5 || false;
          const checkpointAnswerImageUrl5 =
            checkpointAnswer?.image_preview_link_5 || false;

          const checkpointAnswerRatingId =
            checkpointAnswer?.cc_audit_document_rating_option_id || "N/A";
          const checkpointAnswerRating = ratingOptions.find(
            (ratingOption) => ratingOption.id === checkpointAnswerRatingId
          )?.name;

          const sectionNameYOffset = calculateTextYOffset(section_name);
          const titleYOffset = calculateTextYOffset(title);
          const descriptionYOffset = calculateTextYOffset(description);
          const answerDescriptionYOffset = calculateTextYOffset(
            checkpointAnswerDescription
          );

          addNewPageIfNeeded();
          currentPage.drawText(`Sección:`, {
            x: margin,
            y: YPosition,
            size: 14,
            font: timesRomanBoldFont,
            maxWidth: 500,
            color: rgb(0, 0, 0),
          });
          currentPage.drawText(section_name, {
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

          addNewPageIfNeeded();
          currentPage.drawText(`Puntuación:`, {
            x: margin,
            y: YPosition,
            size: 14,
            font: timesRomanBoldFont,
            maxWidth: 500,
            color: rgb(0, 0, 0),
          });
          currentPage.drawText(checkpointAnswerRating, {
            x: margin + 180,
            y: YPosition,
            size: 14,
            font: timesRomanFont,
            maxWidth: 500,
            color: rgb(0, 0, 0),
          });
          YPosition -= 20;

          if (checkpointAnswerDescription) {
            addNewPageIfNeeded();
            currentPage.drawText(`Comentarios:`, {
              x: margin,
              y: YPosition,
              size: 14,
              font: timesRomanBoldFont,
              maxWidth: 500,
              color: rgb(0, 0, 0),
            });
            currentPage.drawText(checkpointAnswerDescription, {
              x: margin + 180,
              y: YPosition,
              size: 14,
              font: timesRomanFont,
              maxWidth: 500,
              color: rgb(0, 0, 0),
            });
            YPosition -= answerDescriptionYOffset + 20;
          }

          if (checkpointAnswerHasImage1 && checkpointAnswerImageUrl1) {
            addNewPageIfNeeded();
            currentPage.drawText(`Link de imagen:`, {
              x: margin,
              y: YPosition,
              size: 14,
              font: timesRomanBoldFont,
              maxWidth: 500,
              color: rgb(0, 0, 0),
            });
            currentPage.drawText(checkpointAnswerImageUrl1, {
              x: margin + 180,
              y: YPosition,
              size: 10,
              font: timesRomanFont,
              maxWidth: 500,
              color: rgb(0, 0, 1),
            });
            YPosition -= 20;
          }

          if (checkpointAnswerHasImage2 && checkpointAnswerImageUrl2) {
            addNewPageIfNeeded();
            currentPage.drawText(`Link de imagen 2:`, {
              x: margin,
              y: YPosition,
              size: 14,
              font: timesRomanBoldFont,
              maxWidth: 500,
              color: rgb(0, 0, 0),
            });
            currentPage.drawText(checkpointAnswerImageUrl2, {
              x: margin + 180,
              y: YPosition,
              size: 10,
              font: timesRomanFont,
              maxWidth: 500,
              color: rgb(0, 0, 1),
            });
            YPosition -= 20;
          }

          if (checkpointAnswerHasImage3 && checkpointAnswerImageUrl3) {
            addNewPageIfNeeded();
            currentPage.drawText(`Link de imagen 3:`, {
              x: margin,
              y: YPosition,
              size: 14,
              font: timesRomanBoldFont,
              maxWidth: 500,
              color: rgb(0, 0, 0),
            });
            currentPage.drawText(checkpointAnswerImageUrl3, {
              x: margin + 180,
              y: YPosition,
              size: 10,
              font: timesRomanFont,
              maxWidth: 500,
              color: rgb(0, 0, 1),
            });
            YPosition -= 20;
          }

          if (checkpointAnswerHasImage4 && checkpointAnswerImageUrl4) {
            addNewPageIfNeeded();
            currentPage.drawText(`Link de imagen 4:`, {
              x: margin,
              y: YPosition,
              size: 14,
              font: timesRomanBoldFont,
              maxWidth: 500,
              color: rgb(0, 0, 0),
            });
            currentPage.drawText(checkpointAnswerImageUrl4, {
              x: margin + 180,
              y: YPosition,
              size: 10,
              font: timesRomanFont,
              maxWidth: 500,
              color: rgb(0, 0, 1),
            });
            YPosition -= 20;
          }

          if (checkpointAnswerHasImage5 && checkpointAnswerImageUrl5) {
            addNewPageIfNeeded();
            currentPage.drawText(`Link de imagen 5:`, {
              x: margin,
              y: YPosition,
              size: 14,
              font: timesRomanBoldFont,
              maxWidth: 500,
              color: rgb(0, 0, 0),
            });
            currentPage.drawText(checkpointAnswerImageUrl5, {
              x: margin + 180,
              y: YPosition,
              size: 10,
              font: timesRomanFont,
              maxWidth: 500,
              color: rgb(0, 0, 1),
            });
            YPosition -= 20;
          }

          addNewPageIfNeeded();
          currentPage.drawLine({
            start: { x: margin, y: YPosition },
            end: { x: pageWidth - margin, y: YPosition },
            color: rgb(0.8, 0.8, 0.8),
            thickness: 1,
          });
          YPosition -= 25;
        }
      });
    }

    // Totals table
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

    const tableHeaders = ["Puntuación", "Total"];
    const columnWidths = [250, 250];

    const tableRows = [
      ["No verificado", audit.total_not_verified_points || "0"],
      ["Implementado", audit.total_implemented_points || "0"],
      [
        "Parcialmente implementado",
        audit.total_partially_implemented_points || "0",
      ],
      ["No implementado", audit.total_not_implemented_points || "0"],
      ["No aplica", audit.total_excluded_points || "0"],
    ];

    tableHeaders.forEach((header, index) => {
      const x =
        margin +
        columnWidths.slice(0, index).reduce((acc, width) => acc + width, 0);
      currentPage.drawText(header, {
        x:
          x +
          (columnWidths[index] - timesRomanFont.widthOfTextAtSize(header, 14)) /
            2,
        y: YPosition,
        size: 14,
        font: timesRomanBoldFont,
        color: rgb(0, 0, 0),
      });
    });
    YPosition -= 20;

    tableRows.forEach((row) => {
      row.forEach((cell, index) => {
        const x =
          margin +
          columnWidths.slice(0, index).reduce((acc, width) => acc + width, 0);
        currentPage.drawText(cell.toString(), {
          x:
            x +
            (columnWidths[index] -
              timesRomanFont.widthOfTextAtSize(cell.toString(), 14)) /
              2,
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
          y: YPosition + tableHeight + 10,
        },
        color: rgb(0, 0, 0),
        thickness: 1,
      });
      currentX += columnWidths[index];
    });

    YPosition -= 20;

    addNewPageIfNeeded();

    const finalCommentsYOffset = calculateTextYOffset(audit?.final_comments);

    currentPage.drawText(`Comentarios finales:`, {
      x: margin,
      y: YPosition,
      size: 18,
      font: timesRomanBoldFont,
      maxWidth: 500,
      color: rgb(0, 0, 0),
    });

    YPosition -= 20;

    addNewPageIfNeeded();
    const finalComments = audit.final_comments || "Sin comentarios";
    currentPage.drawText(finalComments, {
      x: margin,
      y: YPosition,
      font: timesRomanFont,
      size: 15,
      maxWidth: 500,
      color: rgb(0, 0, 0),
    });
    YPosition -= finalCommentsYOffset;

    // PDF generation finalization (page number, etc.)
    currentPage.drawText(`Auditoria completada`, {
      x: margin,
      y: YPosition,
      size: 12,
      font: timesRomanFont,
      maxWidth: 500,
      color: rgb(0, 0, 0),
    });

    // Footer
    addNewPageIfNeeded();
    const footerText = "Descargado a través del Sistema Odin";
    const footerTextWidth = timesRomanFont.widthOfTextAtSize(footerText, 12);
    const footerXPosition = (pageWidth - footerTextWidth) / 2;
    currentPage.drawText(footerText, {
      x: footerXPosition,
      y: 30,
      size: 12,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
  } catch (error) {
    console.error("Error generating audit document:", error);
  }

  return await pdfDoc.save();
}
