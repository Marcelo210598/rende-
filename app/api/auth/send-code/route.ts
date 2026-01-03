import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationCode } from '@/lib/email';
import { devCodes } from '@/lib/devStorage';
import { checkRateLimit } from '@/lib/rateLimit';

// Forçar modo dev até configurar Resend e fazer db push
const isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.USE_DATABASE;

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate email format
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email é obrigatório', code: 'MISSING_EMAIL' },
                { status: 400 }
            );
        }

        if (!email.includes('@') || !email.includes('.')) {
            return NextResponse.json(
                { error: 'Formato de email inválido', code: 'INVALID_EMAIL_FORMAT' },
                { status: 400 }
            );
        }

        // Normalizar email (lowercase)
        const normalizedEmail = email.toLowerCase().trim();

        // Check rate limit
        const rateLimitCheck = checkRateLimit(normalizedEmail);
        if (!rateLimitCheck.allowed) {
            console.warn(`⚠️ Rate limit exceeded for: ${normalizedEmail}`);
            return NextResponse.json(
                {
                    error: `Muitas tentativas. Tente novamente em ${rateLimitCheck.resetIn} minutos.`,
                    code: 'RATE_LIMIT_EXCEEDED',
                    resetIn: rateLimitCheck.resetIn
                },
                { status: 429 }
            );
        }

        console.log(`📨 Solicitação de código para: ${normalizedEmail}`);

        // Gerar código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        if (isDevelopmentMode) {
            // Modo desenvolvimento sem banco de dados
            devCodes.set(normalizedEmail, { code, expiresAt });

            console.log('\n🔧 MODO DESENVOLVIMENTO (SEM BANCO)');
            console.log('🔐 ================================');
            console.log('📧 CÓDIGO DE VERIFICAÇÃO');
            console.log('================================');
            console.log(`Para: ${normalizedEmail}`);
            console.log(`Código: ${code}`);
            console.log(`Expira em: 5 minutos`);
            console.log('================================\n');
        } else {
            // Modo produção com banco de dados
            // Deletar códigos antigos deste email
            await prisma.verificationCode.deleteMany({
                where: { email: normalizedEmail }
            });

            await prisma.verificationCode.create({
                data: {
                    email: normalizedEmail,
                    code,
                    expiresAt,
                }
            });
        }

        // Enviar email
        console.log('📧 Tentando enviar email para:', normalizedEmail);
        const emailResult = await sendVerificationCode(normalizedEmail, code);

        if (!emailResult.success) {
            const errorDetails = {
                email: normalizedEmail,
                error: emailResult.error,
                errorName: (emailResult.error as any)?.name,
                errorMessage: (emailResult.error as any)?.message,
                hasApiKey: !!process.env.RESEND_API_KEY,
                apiKeyPreview: process.env.RESEND_API_KEY?.substring(0, 8) + '...'
            };
            
            console.error('❌ Falha ao enviar email:', errorDetails);
            
            // Check if it's a Resend API restriction
            const errorMsg = (emailResult.error as any)?.message || '';
            let userMessage = 'Erro ao enviar email. Tente novamente mais tarde.';
            let errorCode = 'EMAIL_SEND_FAILED';
            
            if (errorMsg.includes('not verified') || errorMsg.includes('not allowed')) {
                userMessage = 'Este endereço de email não pode receber mensagens no momento. Use um email diferente ou entre em contato com o suporte.';
                errorCode = 'EMAIL_NOT_ALLOWED';
                console.error('🚫 Resend restriction: Email not in allowed list (Testing Mode)');
            }
            
            return NextResponse.json(
                { 
                    error: userMessage,
                    code: errorCode,
                    debug: process.env.NODE_ENV === 'development' ? errorDetails : undefined
                },
                { status: 500 }
            );
        }

        console.log('✅ Email enviado com sucesso!', {
            email: normalizedEmail,
            devMode: emailResult.devMode
        });

        return NextResponse.json({
            success: true,
            message: 'Código enviado para seu email!',
            expiresAt: expiresAt.toISOString(),
            devMode: isDevelopmentMode || !process.env.RESEND_API_KEY
        });

    } catch (error) {
        console.error('Erro ao enviar código:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
