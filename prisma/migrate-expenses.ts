import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateExpensesToMonthly() {
    console.log('🔄 Migrando gastos existentes para incluir mês/ano...')

    // Buscar todos os gastos
    const expenses = await prisma.expense.findMany()

    console.log(`📊 Encontrados ${expenses.length} gastos para migrar`)

    for (const expense of expenses) {
        const date = new Date(expense.date)
        const month = date.getMonth() + 1 // 0-11 → 1-12
        const year = date.getFullYear()

        await prisma.$executeRaw`
            UPDATE "Expense" 
            SET month = ${month}, year = ${year}
            WHERE id = ${expense.id}
        `

        console.log(`✅ Migrado: ${expense.id} → ${month}/${year}`)
    }

    console.log('🎉 Migração concluída!')
}

migrateExpensesToMonthly()
    .catch((e) => {
        console.error('❌ Erro na migração:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
