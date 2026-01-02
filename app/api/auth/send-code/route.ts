import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationCode } from '@/lib/email';
import { devCodes } from '@/lib/devStorage';

// Forçar modo dev até configurar Resend e fazer db push
const isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.USE_DATABASE;

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            );
        }

        // Normalizar email (lowercase)
        const normalizedEmail = email.toLowerCase().trim();

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
            console.error('❌ Falha ao enviar email:', {
                email: normalizedEmail,
                error: emailResult.error,
                hasApiKey: !!process.env.RESEND_API_KEY,
                apiKeyPreview: process.env.RESEND_API_KEY?.substring(0, 8) + '...'
            });
            
            return NextResponse.json(
                { 
                    error: 'Erro ao enviar email. Verifique se o endereço está correto e tente novamente.',
                    code: 'EMAIL_SEND_FAILED',
                    debug: process.env.NODE_ENV === 'development' ? emailResult.error : undefined
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
