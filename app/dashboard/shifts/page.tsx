'use client';

import { useState, useCallback } from 'react';
import { ShiftHeader } from '@/components/dashboard/shifts/ShiftHeader';
import { ShiftStats } from '@/components/dashboard/shifts/ShiftStats';
import { ShiftTabs } from '@/components/dashboard/shifts/ShiftTabs';
import { ShiftCard } from '@/components/dashboard/shifts/ShiftCard';
import { ShiftTable } from '@/components/dashboard/shifts/ShiftTable';
import { EmptyState } from '@/components/dashboard/shifts/EmptyState';
import { OpenShiftDialog } from '@/components/dashboard/shifts/OpenShiftDialog';
import { CloseShiftDialog } from '@/components/dashboard/shifts/CloseShiftDialog';
import { ShiftDetailsDialog } from '@/components/dashboard/shifts/ShiftDetailsDialog';
import { useShifts } from '@/components/dashboard/shifts/hooks/useShifts';
import { Shift, ModalType, TabType } from '@/components/dashboard/shifts/types';
import { COLORS, SPACING } from '@/components/dashboard/shifts/constants';

export default function ShiftsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [tab, setTab] = useState<TabType>('all');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [modal, setModal] = useState<ModalType>(null);

  const { shifts, activeShifts, currentShift, loading, totalPages, refresh } = useShifts({
    page,
    statusFilter,
  });

  const handleModalClose = useCallback(() => {
    setModal(null);
    setSelectedShift(null);
  }, []);

  const handleSuccess = useCallback(() => {
    setModal(null);
    setSelectedShift(null);
    refresh();
  }, [refresh]);

  const handleTabChange = useCallback((newFilter: string, newTab: TabType) => {
    setStatusFilter(newFilter);
    setTab(newTab);
    setPage(1);
  }, []);

  const handleDetailsClick = useCallback((shift: Shift) => {
    setSelectedShift(shift);
    setModal('details');
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.dark,
        color: COLORS.text,
        fontFamily: "'Geist', 'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <ShiftHeader
        currentShift={currentShift}
        onOpenShift={() => setModal('open')}
        onCloseShift={() => setModal('close')}
      />

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: `${SPACING.xl}px ${SPACING.xxl}px` }}>
        {/* Active shift banner */}
        <ShiftStats shift={currentShift} />

        {/* Main card */}
        <div
          style={{
            background: COLORS.darkCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {/* Card header with tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${SPACING.lg}px ${SPACING.xl}px`,
              borderBottom: `1px solid ${COLORS.borderLight}`,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 500,
                  color: COLORS.text,
                }}
              >
                {tab === 'active' ? 'Active Shifts' : 'All Shifts'}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: COLORS.textMuted }}>
                {tab === 'active'
                  ? `${activeShifts.length} cashiers currently on shift`
                  : 'Latest activity'}
              </p>
            </div>

            <ShiftTabs
              tab={tab}
              statusFilter={statusFilter}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Active shifts grid view */}
          {tab === 'active' && (
            <div style={{ padding: SPACING.xl }}>
              {activeShifts.length === 0 ? (
                <EmptyState />
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: SPACING.md,
                  }}
                >
                  {activeShifts.map((shift) => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onClick={() => handleDetailsClick(shift)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All shifts table view */}
          {tab === 'all' && (
            <ShiftTable
              shifts={shifts}
              loading={loading}
              onRowClick={handleDetailsClick}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {modal === 'open' && (
        <OpenShiftDialog onClose={handleModalClose} onSuccess={handleSuccess} />
      )}
      {modal === 'close' && currentShift && (
        <CloseShiftDialog
          shift={currentShift}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
      {modal === 'details' && selectedShift && (
        <ShiftDetailsDialog shift={selectedShift} onClose={handleModalClose} />
      )}
    </div>
  );
}
