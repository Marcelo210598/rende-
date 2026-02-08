import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-off-white text-dark-grey p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="text-accent-blue hover:underline mb-8 block">
          ← Voltar para Home
        </Link>

        <h1 className="text-3xl font-bold mb-4">
          Política de Privacidade - Rende+ Sync
        </h1>
        <p className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">1. Introdução</h2>
          <p>
            O Rende+ Sync ("Aplicativo") é uma ferramenta complementar da
            plataforma RendePlus, desenvolvida para automatizar o registro
            financeiro através da leitura de notificações. Sua privacidade é
            nossa prioridade.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            2. Permissões e Dados Coletados
          </h2>
          <p>
            Para funcionar, o Aplicativo solicita a permissão de{" "}
            <strong>Acesso a Notificações</strong> do dispositivo Android.
            <br />
            <strong>O que coletamos:</strong> Apenas notificações provenientes
            de aplicativos financeiros selecionados (ex: Nubank, Inter, Itaú).
            Extraímos o nome do estabelecimento, valor e data da transação.
            <br />
            <strong>O que NÃO coletamos:</strong> O Aplicativo ignora
            notificações de mensagens (WhatsApp, Telegram), redes sociais ou
            qualquer outro app não financeiro. Nenhum conteúdo de mensagem
            pessoal é lido ou armazenado.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">3. Uso dos Dados</h2>
          <p>
            Os dados extraídos são enviados de forma segura (criptografada) para
            os servidores do RendePlus e utilizados exclusivamente para criar
            registros de despesas na sua conta pessoal. Nenhum dado é
            compartilhado com terceiros, anunciantes ou parceiros.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">4. Segurança</h2>
          <p>
            A comunicação entre o App e o Servidor utiliza um Token de
            Sincronização único, gerado pelo usuário. Todas as conexões são
            feitas via HTTPS.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">5. Contato</h2>
          <p>
            Em caso de dúvidas sobre esta política, entre em contato através do
            email: suporte@rendeplus.com
          </p>
        </section>
      </div>
    </div>
  );
}
