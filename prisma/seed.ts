import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultCategories = [
    { id: 'default-comida', name: 'Comida', emoji: '🍔', isDefault: true },
    { id: 'default-transporte', name: 'Transporte', emoji: '🚗', isDefault: true },
    { id: 'default-moradia', name: 'Moradia', emoji: '🏠', isDefault: true },
    { id: 'default-lazer', name: 'Lazer', emoji: '🎮', isDefault: true },
    { id: 'default-saude', name: 'Saúde', emoji: '❤️', isDefault: true },
    { id: 'default-educacao', name: 'Educação', emoji: '📚', isDefault: true },
    { id: 'default-compras', name: 'Compras', emoji: '🛍️', isDefault: true },
    { id: 'default-contas', name: 'Contas', emoji: '💡', isDefault: true },
    { id: 'default-dividas', name: 'Dívidas', emoji: '💳', isDefault: true },
    { id: 'default-cartao', name: 'Cartão de Crédito', emoji: '💳', isDefault: true },
    { id: 'default-balada', name: 'Balada', emoji: '🎉', isDefault: true },
    { id: 'default-churrasco', name: 'Churrasco', emoji: '🥩', isDefault: true },
    { id: 'default-igreja', name: 'Igreja/Dízimo', emoji: '⛪', isDefault: true },
    { id: 'default-outros', name: 'Outros', emoji: '❓', isDefault: true },
]

async function main() {
    console.log('🌱 Seeding database...')

    for (const category of defaultCategories) {
        await prisma.category.upsert({
            where: { id: category.id },
            update: {},
            create: {
                id: category.id,
                name: category.name,
                emoji: category.emoji,
                isDefault: true,
                userId: null,
            },
        })
        console.log(`✅ Created category: ${category.emoji} ${category.name}`)
    }

    console.log('🎉 Seeding complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
