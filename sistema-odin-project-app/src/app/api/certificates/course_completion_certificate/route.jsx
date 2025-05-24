import { generateCertificateOfCompletion } from "@/src/views/Platform/CoursesPage/Course[id]/generateCertificateOfCompletion";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const userDniSsn = searchParams.get("userDniSsn");
  const courseName = searchParams.get("courseName");
  const courseDuration = searchParams.get("courseDuration");

  if (!name || !courseName || !courseDuration) {
    return NextResponse.json(
      {
        message:
          "El nombre, nombre del curso, duración del curso y URL del logo son requeridos",
      },
      { status: 400 }
    );
  }

  try {
    const pdfBytes = await generateCertificateOfCompletion(
      name,
      userDniSsn,
      courseName,
      courseDuration
    );

    const response = new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Certificado-${name}.pdf`,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
