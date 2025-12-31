export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin" />
                <p className="text-white/50 text-sm">Carregando...</p>
            </div>
        </div>
    );
}
