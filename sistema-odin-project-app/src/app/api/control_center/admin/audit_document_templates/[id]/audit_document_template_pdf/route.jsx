import { generateAuditDocumentTemplatePDF } from '@/pdfs/control_center/generateAuditDocumentTemplatePDF';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { id } = params;
  const { auditDocumentTemplateInfo, auditDocumentTemplateCheckpointsInfo } = await request.json();

  if (!auditDocumentTemplateInfo || !auditDocumentTemplateCheckpointsInfo) {
    return NextResponse.json(
      { message: "No se proporcionaron datos de la información del legajo de auditoría." },
      { status: 400 }
    );
  }

  try {
    const pdfBytes = await generateAuditDocumentTemplatePDF(auditDocumentTemplateInfo, auditDocumentTemplateCheckpointsInfo);

    // Asegúrate de extraer correctamente el título
    const audit_document_template_title = auditDocumentTemplateInfo.title || "Documento";

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${audit_document_template_title}_plantilla_de_auditoria.pdf`,
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
