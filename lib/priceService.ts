// Price update service for fetching real-time asset prices

export interface PriceData {
    symbol: string;
    price: number;
    change24h?: number;
}

export interface ExchangeRate {
    usd: number;
    brl: number;
}

/**
 * Fetch BRL/USD exchange rate from CoinGecko
 */
export async function getExchangeRate(): Promise<number> {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=brl'
        );

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rate');
        }

        const data = await response.json();
        return data.usd.brl;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        // Fallback to approximate rate
        return 5.0;
    }
}

/**
 * Fetch cryptocurrency prices from CoinGecko
 */
export async function getCryptoPrices(symbols: string[]): Promise<Record<string, number>> {
    try {
        // Map common symbols to CoinGecko IDs
        const symbolToId: Record<string, string> = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'USDT': 'tether',
            'BNB': 'binancecoin',
            'SOL': 'solana',
            'XRP': 'ripple',
            'ADA': 'cardano',
            'DOGE': 'dogecoin',
        };

        const ids = symbols
            .map(s => symbolToId[s.toUpperCase()])
            .filter(Boolean)
            .join(',');

        if (!ids) return {};

        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl&include_24hr_change=true`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch crypto prices');
        }

        const data = await response.json();

        // Convert back to symbol-based object
        const prices: Record<string, number> = {};
        symbols.forEach(symbol => {
            const id = symbolToId[symbol.toUpperCase()];
            if (id && data[id]) {
                prices[symbol] = data[id].brl;
            }
        });

        return prices;
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        return {};
    }
}

/**
 * Fetch B3 stock/FII prices (mock for now, can be replaced with real API)
 */
export async function getB3Prices(tickers: string[]): Promise<Record<string, number>> {
    // Mock implementation with realistic prices
    // In production, replace with real B3 API or Alpha Vantage
    const mockPrices: Record<string, number> = {
        'PETR4': 38.50 + (Math.random() - 0.5) * 2,
        'VALE3': 62.30 + (Math.random() - 0.5) * 3,
        'ITUB4': 28.90 + (Math.random() - 0.5) * 1,
        'BBDC4': 14.20 + (Math.random() - 0.5) * 0.5,
        'ABEV3': 12.80 + (Math.random() - 0.5) * 0.5,
        'WEGE3': 42.10 + (Math.random() - 0.5) * 2,
        'MGLU3': 3.50 + (Math.random() - 0.5) * 0.3,
        // FIIs
        'HGLG11': 165.00 + (Math.random() - 0.5) * 5,
        'KNRI11': 135.00 + (Math.random() - 0.5) * 4,
        'MXRF11': 10.50 + (Math.random() - 0.5) * 0.3,
        'VISC11': 95.00 + (Math.random() - 0.5) * 3,
    };

    const prices: Record<string, number> = {};
    tickers.forEach(ticker => {
        const upperTicker = ticker.toUpperCase();
        prices[ticker] = mockPrices[upperTicker] || 100 + Math.random() * 50;
    });

    return prices;
}

/**
 * Fetch CDI/Selic rate from Banco Central
 */
export async function getCDIRate(): Promise<number> {
    try {
        // Banco Central API for CDI rate
        const response = await fetch(
            'https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados/ultimos/1?formato=json'
        );

        if (!response.ok) {
            throw new Error('Failed to fetch CDI rate');
        }

        const data = await response.json();
        if (data && data.length > 0) {
            return parseFloat(data[0].valor);
        }

        // Fallback
        return 11.75;
    } catch (error) {
        console.error('Error fetching CDI rate:', error);
        // Fallback to approximate current rate
        return 11.75;
    }
}

/**
 * Fetch Selic rate from Banco Central
 */
export async function getSelicRate(): Promise<number> {
    try {
        // Banco Central API for Selic rate
        const response = await fetch(
            'https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json'
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Selic rate');
        }

        const data = await response.json();
        if (data && data.length > 0) {
            return parseFloat(data[0].valor);
        }

        // Fallback
        return 11.75;
    } catch (error) {
        console.error('Error fetching Selic rate:', error);
        // Fallback to approximate current rate
        return 11.75;
    }
}

/**
 * Update all asset prices based on type
 */
export async function updateAllPrices(assets: any[]): Promise<any[]> {
    try {
        // Group assets by type
        const cryptoAssets = assets.filter(a => a.type === 'crypto');
        const stockAssets = assets.filter(a => a.type === 'stock' || a.type === 'fii');

        // Fetch prices in parallel
        const [cryptoPrices, stockPrices] = await Promise.all([
            cryptoAssets.length > 0
                ? getCryptoPrices(cryptoAssets.map(a => a.symbol))
                : Promise.resolve({}),
            stockAssets.length > 0
                ? getB3Prices(stockAssets.map(a => a.symbol))
                : Promise.resolve({})
        ]);

        // Update asset prices
        return assets.map(asset => {
            let updatedPrice = asset.currentPrice;

            if (asset.type === 'crypto' && asset.symbol && asset.symbol in cryptoPrices) {
                updatedPrice = cryptoPrices[asset.symbol as keyof typeof cryptoPrices];
            } else if ((asset.type === 'stock' || asset.type === 'fii') && asset.symbol && asset.symbol in stockPrices) {
                updatedPrice = stockPrices[asset.symbol as keyof typeof stockPrices];
            }

            // Calculate profit/loss
            const totalValue = updatedPrice * asset.quantity;
            const totalInvested = asset.averagePrice * asset.quantity;
            const profitLoss = totalValue - totalInvested;
            const profitLossPercent = ((updatedPrice - asset.averagePrice) / asset.averagePrice) * 100;

            return {
                ...asset,
                currentPrice: updatedPrice,
                totalValue,
                profitLoss,
                profitLossPercent
            };
        });
    } catch (error) {
        console.error('Error updating prices:', error);
        throw error;
    }
}
