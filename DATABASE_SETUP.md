# 🚀 Configuração do Banco de Dados - Guia Rápido

## Passo 1: Criar Conta no Neon (PostgreSQL Gratuito)

1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Clique em "Create a project"
4. Dê um nome ao projeto (ex: "rendeplus")
5. Escolha a região mais próxima
6. Clique em "Create project"

## Passo 2: Copiar Connection String

1. No dashboard do Neon, vá em "Connection Details"
2. Copie a **Connection String** (deve começar com `postgresql://`)
3. Certifique-se de que está copiando a string completa com `?sslmode=require` no final

## Passo 3: Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie um arquivo `.env.local` (se ainda não existir)
2. Adicione a seguinte linha com sua connection string:

```env
DATABASE_URL="postgresql://seu-usuario:sua-senha@seu-host.neon.tech/neondb?sslmode=require"
```

**Substitua** `postgresql://seu-usuario...` pela connection string que você copiou do Neon.

## Passo 4: Executar Migração do Banco

Execute o seguinte comando no terminal:

```bash
npx prisma db push
```

Este comando irá:
- Criar as tabelas `User` e `Asset` no banco de dados
- Sincronizar o schema do Prisma com o banco

## Passo 5: Verificar (Opcional)

Para ver as tabelas criadas, execute:

```bash
npx prisma studio
```

Isso abrirá uma interface visual no navegador onde você pode ver e editar os dados.

---

## ✅ Pronto!

Agora você pode:
1. Fazer login no app
2. Adicionar ativos em `/adicionar-ativo`
3. Ver seus ativos em `/carteira`
4. Os dados persistem mesmo após recarregar a página!

---

## 🔧 Comandos Úteis

```bash
# Ver dados no navegador
npx prisma studio

# Resetar banco de dados (CUIDADO: apaga tudo)
npx prisma db push --force-reset

# Gerar Prisma Client novamente
npx prisma generate
```

---

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env.local` no Git
- O `.gitignore` já está configurado para ignorá-lo
- Cada desenvolvedor deve ter seu próprio `.env.local`
