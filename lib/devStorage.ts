// In-memory storage for development (quando não tem banco)
// Usando global para persistir entre hot reloads
const globalForDevCodes = global as unknown as {
    devCodes: Map<string, { code: string; expiresAt: Date }>
};

export const devCodes = globalForDevCodes.devCodes || new Map<string, { code: string; expiresAt: Date }>();

if (!globalForDevCodes.devCodes) {
    globalForDevCodes.devCodes = devCodes;
}

