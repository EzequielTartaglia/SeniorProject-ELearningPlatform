import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_EMAIL_API_KEY);
const domain = process.env.NEXT_PUBLIC_DOMAIN;
const logoFileName = process.env.NEXT_PUBLIC_LOGO_FILE_NAME;
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_RESEND_EMAIL;

export async function POST(request) {
  try {
    const { firstName, lastName, phone, email, message } = await request.json();

    if (!contactEmail) {
      throw new Error("No contact email found in platform settings.");
    }

    const logoUrl = `${domain}/${logoFileName}`;

    const response = await resend.emails.send({
      from: `sistemas.odin@resend.dev`,
      to: contactEmail, 
      subject: "Nuevo mensaje de contacto",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: auto;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
              }
              .header img {
                max-width: 200px;
              }
              .content {
                font-size: 16px;
                line-height: 1.5;
              }
              .footer {
                text-align: center;
                font-size: 14px;
                color: #777;
                margin-top: 20px;
              }
              .footer a {
                color: #007bff;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="content">
                <p><strong>Nombre:</strong> ${firstName}</p>
                <p><strong>Apellido:</strong> ${lastName}</p>
                <p><strong>Teléfono:</strong> ${phone}</p>
                <p><strong>Correo electrónico:</strong> ${email}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
              </div>
              <div class="footer">
                <div class="header">
                    <img src="${logoUrl}" width="200" height="200" alt="Company Logo" />
                </div>
                <p>¡El correo electrónico ha sido enviado por Sistema Odin!</p>
                <p>Si necesitas más información, por favor contacta al equipo de desarrollo en <a href="mailto:ezequielmtartaglia@gmail.com">ezequielmtartaglia@gmail.com</a>.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent response:", response);

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
