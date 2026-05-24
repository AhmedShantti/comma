'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shift } from '../types';
import { shiftsApi } from '@/lib/api/shifts';

interface UseShiftsOptions {
  page?: number;
  statusFilter?: string;
}

export function useShifts({ page = 1, statusFilter = '' }: UseShiftsOptions = {}) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [activeShifts, setActiveShifts] = useState<Shift[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [listRes, activeRes] = await Promise.all([
        shiftsApi.getAll(page, 10, statusFilter || undefined),
        shiftsApi.getActive(),
      ]);

      setShifts(listRes.data);
      setTotalPages(listRes.meta.totalPages);
      setActiveShifts(activeRes);

      try {
        const cur = await shiftsApi.current();
        setCurrentShift(cur);
      } catch {
        setCurrentShift(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load shifts';
      setError(message);
      console.error('Failed to load shifts:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    shifts,
    activeShifts,
    currentShift,
    loading,
    totalPages,
    error,
    refresh,
  };
}
