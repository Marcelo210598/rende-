"use client";

import { useState, useEffect } from 'react';
import { updateAllPrices } from '@/lib/priceService';
import { toast } from 'sonner';

export function usePriceUpdates(assets: any[], enabled: boolean = true) {
    const [updatedAssets, setUpdatedAssets] = useState(assets);
    const [isUpdating, setIsUpdating] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const updatePrices = async () => {
        if (!enabled || assets.length === 0) return;

        setIsUpdating(true);
        try {
            const updated = await updateAllPrices(assets);
            setUpdatedAssets(updated);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Failed to update prices:', error);
            toast.error('Preços não atualizados – tente novamente');
        } finally {
            setIsUpdating(false);
        }
    };

    // Auto-update on mount
    useEffect(() => {
        if (enabled && assets.length > 0) {
            updatePrices();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]);

    // Update when assets change
    useEffect(() => {
        setUpdatedAssets(assets);
    }, [assets]);

    return {
        assets: updatedAssets,
        isUpdating,
        lastUpdate,
        updatePrices,
    };
}
