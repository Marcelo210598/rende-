import { NextResponse } from 'next/server';
import { sendVerificationCode } from '@/lib/email';

export async function GET() {
  try {
    // Verificar se as variáveis de ambiente estão carregadas
    const hasResendKey = !!process.env.RESEND_API_KEY;
    const resendKeyPreview = process.env.RESEND_API_KEY 
      ? `${process.env.RESEND_API_KEY.substring(0, 8)}...` 
      : 'NOT SET';

    console.log('🔍 DEBUG - Environment Check:');
    console.log('- RESEND_API_KEY exists:', hasResendKey);
    console.log('- RESEND_API_KEY preview:', resendKeyPreview);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- USE_DATABASE:', process.env.USE_DATABASE);

    if (!hasResendKey) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY não configurada',
        debug: {
          hasResendKey,
          nodeEnv: process.env.NODE_ENV,
        }
      }, { status: 500 });
    }

    // Tentar enviar email de teste
    const testCode = '123456';
    const result = await sendVerificationCode('delivered@resend.dev', testCode);

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email de teste enviado com sucesso!' : 'Falha ao enviar email',
      debug: {
        hasResendKey,
        resendKeyPreview,
        nodeEnv: process.env.NODE_ENV,
        useDatabase: process.env.USE_DATABASE,
        devMode: result.devMode,
        error: result.error,
      }
    });

  } catch (error: any) {
    console.error('🔴 Erro no teste de email:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro desconhecido',
      stack: error.stack,
    }, { status: 500 });
  }
}
