import { generateAuditDocumentPDF } from "@/pdfs/control_center/generateAuditDocumentPDF";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { id } = params;
  const { audit, auditCheckpoints, ratingOptions, client, templateCheckpoints } = await request.json();

  if (!audit || !auditCheckpoints || !ratingOptions || !client || !templateCheckpoints) {
    return NextResponse.json(
      {
        message:
          "No se proporcionaron datos de la información de la auditoría.",
      },
      { status: 400 }
    );
  }

  try {
    const pdfBytes = await generateAuditDocumentPDF(
      audit,
      auditCheckpoints,
      ratingOptions,
      client,
      templateCheckpoints
    );

    // Asegúrate de extraer correctamente el título
    const audit_document_date = audit.date || "Fecha";
    const client_name = client.name || "Cliente";

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${audit_document_date}_${client_name}_auditoria.pdf`,
      },
    });
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    return NextResponse.json(
      { message: "Error generando el PDF" },
      { status: 500 }
    );
  }
}
