import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import axios from "axios";

function splitTextIntoLines(text, font, fontSize, maxWidth) {
  let lines = [];
  let currentLine = "";
  let words = text.split(" ");

  for (let word of words) {
    let testLine = currentLine + (currentLine.length > 0 ? " " : "") + word;
    let testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

export async function generateCertificateOfCompletion(
  name,
  userDniSsn,
  courseName,
  courseDuration
) {
  // PDF Settings
  const pdfDoc = await PDFDocument.create();
  const pageHeight = 595;
  const pageWidth = 842;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Construct logo URL from environment variables
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME;
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const logoFileName = process.env.NEXT_PUBLIC_LOGO_FILE_NAME;
  const signatureFileName = process.env.NEXT_PUBLIC_SIGNATURE_FILE_NAME;

  const logoUrl = `${domain}/${logoFileName}`;
  const logoUrlSystem = `${domain}/logo.png`;
  const backgroundUrl = `${domain}/diploma-background.jpg`;
  const signatureUrl = `${domain}/${signatureFileName}`;

  try {
    // Fetch and embed background image
    const backgroundImageBytes = (
      await axios.get(backgroundUrl, { responseType: "arraybuffer" })
    ).data;
    const backgroundImage = await pdfDoc.embedJpg(backgroundImageBytes);
    page.drawImage(backgroundImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });

    // Fetch and embed logo image from URL
    const logoImageBytes = (
      await axios.get(logoUrl, { responseType: "arraybuffer" })
    ).data;
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDimensions = logoImage.scale(0.3);

    // Fetch and embed system logo image from URL
    const logoImageBytesSystem = (
      await axios.get(logoUrlSystem, { responseType: "arraybuffer" })
    ).data;
    const logoImageSystem = await pdfDoc.embedPng(logoImageBytesSystem);

    // Draw the logo on the PDF (positioned to the left)
    page.drawImage(logoImage, {
      x: 40,
      y: pageHeight - logoDimensions.height - 40,
      width: logoDimensions.width,
      height: logoDimensions.height,
    });

    // Font
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(
      StandardFonts.TimesRomanBold
    );

    // Course Name
    const courseNameLines = splitTextIntoLines(
      courseName,
      timesRomanBoldFont,
      30,
      pageWidth - 100
    );
    let yPositionCourseName = pageHeight - 275; 
    courseNameLines.forEach((line) => {
      const textWidthCourseName = timesRomanBoldFont.widthOfTextAtSize(
        line,
        30
      );
      page.drawText(line, {
        x: (pageWidth - textWidthCourseName) / 2,
        y: yPositionCourseName,
        size: 30,
        font: timesRomanBoldFont,
        color: rgb(8 / 255, 55 / 255, 98 / 255),
        lineHeight: 30,
      });
      yPositionCourseName -= 30; 
    });

    let yPositionQualification = pageHeight - 320;

    // Name
    const nameLines = splitTextIntoLines(
      name,
      timesRomanBoldFont,
      30,
      pageWidth - 100
    );
    let yPositionName = yPositionQualification - 20;

    nameLines.forEach((line) => {
      const textWidthName = timesRomanBoldFont.widthOfTextAtSize(line, 30);
      page.drawText(line, {
        x: (pageWidth - textWidthName) / 2,
        y: yPositionName,
        size: 30,
        font: timesRomanBoldFont,
        color: rgb(8 / 255, 55 / 255, 98 / 255),
        lineHeight: 40,
      });
      yPositionName -= 40;
    });

    // Course Details
    const detailsText = `Habiendo realizado y completado con éxito su curso en ${brandName}. La duración fue de ${courseDuration}.Cumpliendo todos los requisitos académicos exigidos.`;
    const detailsLines = splitTextIntoLines(
      detailsText,
      timesRomanFont,
      18,
      pageWidth - 190
    );
    let yPositionDetails = yPositionName - 0;

    detailsLines.forEach((line) => {
      page.drawText(line, {
        x: 110,
        y: yPositionDetails,
        size: 18,
        font: timesRomanFont,
        color: rgb(8 / 255, 55 / 255, 98 / 255),
        lineHeight: 24,
      });
      yPositionDetails -= 24;
    });

    // Signature
    const ceoName = process.env.NEXT_PUBLIC_CEO_NAME || "Ezequiel M Tartaglia";
    const fontSize = 16;
    const ceoText = "CEO";

    const ceoNameWidth = timesRomanFont.widthOfTextAtSize(ceoName, fontSize);
    const ceoTextWidth = timesRomanFont.widthOfTextAtSize(ceoText, fontSize);

    const ceoNameX = pageWidth - 100 - ceoNameWidth;
    const ceoTextX = pageWidth - 150 - ceoTextWidth;

    const signatureY = 75;

    // Fetch and embed the signature image
    const signatureImageBytes = (
      await axios.get(signatureUrl, { responseType: "arraybuffer" })
    ).data;
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    const signatureDimensions = signatureImage.scale(0.5);

    // Draw the signature image
    page.drawImage(signatureImage, {
      x: ceoNameX - 20,
      y: signatureY - 0,
      width: signatureDimensions.width,
      height: signatureDimensions.height,
    });

    // CEO's Name
    page.drawText(ceoName, {
      x: ceoNameX,
      y: signatureY + 20,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(8 / 255, 55 / 255, 98 / 255),
    });

    // "CEO" title
    page.drawText(ceoText, {
      x: ceoTextX,
      y: signatureY,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(8 / 255, 55 / 255, 98 / 255),
    });

    // Footer with logo and text
    const footerText = "Descargado a través de Sistema Odin";
    const footerFontSize = 12;
    const logoFooterDimensions = logoImage.scale(0.04);
    const logoWidth = logoFooterDimensions.width;
    const footerTextWidth = timesRomanFont.widthOfTextAtSize(
      footerText,
      footerFontSize
    );
    const totalWidth = logoWidth + 10 + footerTextWidth;

    // Position the logo and text
    let yPositionFooter = 10;
    page.drawImage(logoImageSystem, {
      x: (pageWidth - totalWidth) / 2,
      y: yPositionFooter - 5,
      width: logoWidth,
      height: logoFooterDimensions.height,
    });
    page.drawText(footerText, {
      x: (pageWidth - totalWidth) / 2 + logoWidth + 10,
      y: yPositionFooter,
      size: footerFontSize,
      font: timesRomanFont,
      color: rgb(8 / 255, 55 / 255, 98 / 255),
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error("Error generating PDF:", error.message);
    throw error;
  }
}
