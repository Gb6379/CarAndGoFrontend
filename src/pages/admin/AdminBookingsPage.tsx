import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { adminService } from '../../services/authService';
import { getErrorMessage, errorToDisplay } from '../../utils/errorUtils';
import modernTheme from '../../styles/modernTheme';
import { glassPanelCss, titleCss } from '../../styles/modernPrimitives';

const Title = styled.h1`
  ${titleCss}
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
`;

const TableWrap = styled.div`
  ${glassPanelCss}
  border-radius: 20px;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  th {
    background: rgba(255,255,255,0.72);
    font-weight: 600;
    color: ${modernTheme.colors.ink};
  }
  tr:hover td {
    background: rgba(255,255,255,0.58);
  }

  @media (max-width: 768px) {
    min-width: 560px;

    th, td {
      padding: 0.75rem;
      font-size: 0.9rem;
    }
  }
`;

const Badge = styled.span<{ $status?: string }>`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
  background: ${p => p.$status === 'pending' ? '#fef3c7' : p.$status === 'confirmed' || p.$status === 'active' ? '#ffedd5' : p.$status === 'completed' ? '#d1fae5' : p.$status === 'cancelled' || p.$status === 'rejected' ? '#fee2e2' : '#e5e7eb'};
  color: ${p => p.$status === 'pending' ? '#92400e' : p.$status === 'confirmed' || p.$status === 'active' ? '#1e40af' : p.$status === 'completed' ? '#065f46' : p.$status === 'cancelled' || p.$status === 'rejected' ? '#991b1b' : '#374151'};
`;

const Btn = styled.button<{ $variant?: 'primary' | 'danger' }>`
  padding: 0.4rem 0.75rem;
  border-radius: ${modernTheme.radii.pill};
  border: none;
  font-size: 0.85rem;
  cursor: pointer;
  margin-right: 0.5rem;
  background: ${p => p.$variant === 'danger' ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : modernTheme.gradients.brand};
  color: white;
  box-shadow: ${p => p.$variant === 'danger' ? '0 18px 32px rgba(185, 28, 28, 0.18)' : modernTheme.shadows.glow};
  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  color: #c00;
  margin-top: 1rem;
`;

interface BookingRow {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  lessee?: { firstName: string; lastName: string; email: string };
  lessor?: { firstName: string; lastName: string; email: string };
  vehicle?: { make: string; model: string; year?: number };
}

const statusLower = (s: string) => String(s || '').toLowerCase();

const AdminBookingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminService.getBookings()
      .then((data: BookingRow[]) => setBookings(Array.isArray(data) ? data : []))
      .catch((err: any) => setError(getErrorMessage(err, 'Erro ao carregar reservas')))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filteredBookings = useMemo(() => {
    if (!statusFilter) return bookings;
    return bookings.filter((b) => statusLower(b.status) === statusFilter.toLowerCase());
  }, [bookings, statusFilter]);

  const handleApprove = (id: string) => {
    setActionId(id);
    adminService.approveBooking(id)
      .then(load)
      .catch((err: any) => alert(err.response?.data?.message || 'Erro ao aprovar'))
      .finally(() => setActionId(null));
  };

  const handleCancel = (id: string) => {
    const reason = window.prompt('Motivo do cancelamento (opcional):') || 'Cancelado pelo administrador';
    setActionId(id);
    adminService.cancelBooking(id, reason)
      .then(load)
      .catch((err: any) => alert(err.response?.data?.message || 'Erro ao cancelar'))
      .finally(() => setActionId(null));
  };

  const handleReject = (id: string) => {
    const reason = window.prompt('Motivo da rejeição (opcional):');
    setActionId(id);
    adminService.rejectBooking(id, reason || undefined)
      .then(load)
      .catch((err: any) => alert(err.response?.data?.message || 'Erro ao rejeitar'))
      .finally(() => setActionId(null));
  };

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';

  const statusLabel: Record<string, string> = {
    pending: 'Pendentes',
    active: 'Ativas',
    completed: 'Concluídas',
    cancelled: 'Canceladas',
    confirmed: 'Confirmadas',
  };
  const filterLabel = statusFilter ? statusLabel[statusFilter.toLowerCase()] || statusFilter : null;

  return (
    <>
      <Title>Reservas{filterLabel ? ` — ${filterLabel}` : ''}</Title>
      {error && <ErrorMsg>{errorToDisplay(error)}</ErrorMsg>}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Veículo</th>
                <th>Locatário</th>
                <th>Período</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => {
                const status = statusLower(b.status);
                const canApprove = status === 'pending';
                const canCancel = ['pending', 'confirmed', 'active'].includes(status);
                const canReject = status === 'pending';
                return (
                  <tr key={b.id}>
                    <td>{b.vehicle ? `${b.vehicle.make} ${b.vehicle.model} ${b.vehicle.year || ''}` : '-'}</td>
                    <td>{b.lessee ? `${b.lessee.firstName} ${b.lessee.lastName}` : '-'}</td>
                    <td>{formatDate(b.startDate)} – {formatDate(b.endDate)}</td>
                    <td>R$ {Number(b.totalAmount).toLocaleString('pt-BR')}</td>
                    <td><Badge $status={status}>{b.status}</Badge></td>
                    <td>
                      {canApprove && (
                        <Btn onClick={() => handleApprove(b.id)} disabled={!!actionId}>Aprovar</Btn>
                      )}
                      {canReject && (
                        <Btn $variant="danger" onClick={() => handleReject(b.id)} disabled={!!actionId}>Rejeitar</Btn>
                      )}
                      {canCancel && (
                        <Btn $variant="danger" onClick={() => handleCancel(b.id)} disabled={!!actionId}>Cancelar</Btn>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </>
  );
};

export default AdminBookingsPage;
