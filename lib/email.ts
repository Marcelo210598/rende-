import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendVerificationCode(email: string, code: string) {
  // Modo de desenvolvimento sem Resend configurado
  if (!resend) {
    console.log('\n🔐 ================================');
    console.log('📧 CÓDIGO DE VERIFICAÇÃO');
    console.log('================================');
    console.log(`Para: ${email}`);
    console.log(`Código: ${code}`);
    console.log('================================\n');

    return {
      success: true,
      data: { id: 'dev-mode' },
      devMode: true
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Rende+ <onboarding@resend.dev>',
      to: [email],
      subject: 'Seu código de verificação - Rende+',
      html: getEmailTemplate(code),
    });

    if (error) {
      console.error('❌ Resend API Error:', {
        name: error.name,
        message: error.message,
        statusCode: (error as any).statusCode,
      });
      return { success: false, error };
    }

    console.log('✅ Email enviado com sucesso para:', email);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Exception ao enviar email:', {
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error };
  }
}

function getEmailTemplate(code: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Código de Verificação</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 24px; padding: 40px;">
              
              <!-- Logo -->
              <tr>
                <td align="center" style="padding-bottom: 32px;">
                  <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 48px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);">
                    💰
                  </div>
                </td>
              </tr>

              <!-- Title -->
              <tr>
                <td align="center" style="padding-bottom: 16px;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">Rende+</h1>
                </td>
              </tr>

              <!-- Description -->
              <tr>
                <td align="center" style="padding-bottom: 32px;">
                  <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.7); line-height: 1.5;">
                    Use o código abaixo para fazer login na sua conta:
                  </p>
                </td>
              </tr>

              <!-- Code Box -->
              <tr>
                <td align="center" style="padding-bottom: 32px;">
                  <div style="background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; border-radius: 16px; padding: 24px; display: inline-block;">
                    <div style="font-size: 48px; font-weight: bold; letter-spacing: 8px; color: #10b981; font-family: 'Courier New', monospace;">
                      ${code}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Expiration Notice -->
              <tr>
                <td align="center" style="padding-bottom: 24px;">
                  <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.5);">
                    ⏱️ Este código expira em <strong style="color: #10b981;">5 minutos</strong>
                  </p>
                </td>
              </tr>

              <!-- Security Notice -->
              <tr>
                <td align="center">
                  <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 16px;">
                    <p style="margin: 0; font-size: 13px; color: rgba(255, 255, 255, 0.6); line-height: 1.5;">
                      🔒 Se você não solicitou este código, ignore este email.<br>
                      Nunca compartilhe seu código com ninguém.
                    </p>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding-top: 32px;">
            <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.4);">
              © ${new Date().getFullYear()} Rende+ - Controle de gastos simples e rápido
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
