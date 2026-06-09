import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/authService';
import { Car, Calendar } from '../components/IconSystem';
import modernTheme from '../styles/modernTheme';
import { glassPanelCss, pageShellCss, secondaryButtonCss, titleCss } from '../styles/modernPrimitives';

const Container = styled.div`
  ${pageShellCss}
`;

const PageTitle = styled.h1`
  ${titleCss}
  font-size: 2rem;
  margin: 0 0 0.8rem;
`;

const Subtitle = styled.p`
  margin: 0 0 1.25rem;
  color: ${modernTheme.colors.muted};
`;

const BookingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const BookingCard = styled.div`
  ${glassPanelCss}
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  align-items: flex-start;
`;

const BookingVehicle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  color: ${modernTheme.colors.ink};
`;

const BookingStatus = styled.span<{ $status: string }>`
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: ${(props) => {
    const s = props.$status.toLowerCase();
    if (s === 'pending') return '#fff3cd';
    if (s === 'confirmed') return '#d1fae5';
    if (s === 'active') return '#dbeafe';
    if (s === 'awaiting_return') return '#ede9fe';
    if (s === 'completed') return '#e2e8f0';
    if (s === 'cancelled' || s === 'rejected') return '#fee2e2';
    return '#f1f5f9';
  }};
  color: ${(props) => {
    const s = props.$status.toLowerCase();
    if (s === 'pending') return '#854d0e';
    if (s === 'confirmed') return '#166534';
    if (s === 'active') return '#1d4ed8';
    if (s === 'awaiting_return') return '#6d28d9';
    if (s === 'completed') return '#334155';
    if (s === 'cancelled' || s === 'rejected') return '#991b1b';
    return '#334155';
  }};
`;

const BookingLine = styled.div`
  color: ${modernTheme.colors.inkSoft};
  font-size: 0.92rem;
`;

const BookingDetailButton = styled.button`
  ${secondaryButtonCss}
  margin-top: 0.3rem;
  width: 100%;
  padding: 0.6rem 0.85rem;
  cursor: pointer;
  color: ${modernTheme.colors.inkSoft};
  font-weight: 600;
`;

const EmptyBookings = styled.div`
  ${glassPanelCss}
  padding: 1.1rem;
  color: ${modernTheme.colors.muted};
`;

const formatStatus = (status?: string) => {
  const map: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    active: 'Em andamento',
    awaiting_return: 'Aguardando devolução',
    completed: 'Concluída',
    cancelled: 'Cancelada',
    rejected: 'Rejeitada',
    expired: 'Expirada',
  };
  return map[String(status || '').toLowerCase()] || status || 'Desconhecido';
};

const formatPaymentStatus = (paymentStatus?: string) => {
  const key = String(paymentStatus || '').toUpperCase();
  const map: Record<string, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    FAILED: 'Falhou',
    REFUNDED: 'Reembolsado',
    CANCELLED: 'Cancelado',
  };
  return map[key] || paymentStatus || 'Não informado';
};

const getApprovalLabel = (status?: string) => {
  const key = String(status || '').toLowerCase();
  if (key === 'pending') return 'Aguardando aprovação do locador';
  if (key === 'confirmed') return 'Aprovada pelo locador';
  if (key === 'rejected') return 'Recusada pelo locador';
  if (key === 'cancelled') return 'Cancelada';
  if (key === 'active' || key === 'awaiting_return') return 'Aprovada e em andamento';
  if (key === 'completed') return 'Finalizada';
  return 'Em análise';
};

const formatDate = (value?: string | Date) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('pt-BR');
};

const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lesseeBookings, setLesseeBookings] = useState<any[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.id) {
          setLesseeBookings([]);
          return;
        }

        const bookings = await bookingService.getBookings().catch(() => []);
        const bookingsAsLessee = Array.isArray(bookings)
          ? bookings.filter((b: any) => b.lesseeId === user.id || b.lessee?.id === user.id)
          : [];

        setLesseeBookings(
          bookingsAsLessee
            .slice()
            .sort((a: any, b: any) => {
              const dateA = new Date(a.startDate || a.createdAt || 0).getTime();
              const dateB = new Date(b.startDate || b.createdAt || 0).getTime();
              return dateB - dateA;
            }),
        );
      } finally {
        setLoading(false);
      }
    };

    void loadBookings();
  }, []);

  return (
    <Container>
      <PageTitle><Car size={24} /> Minhas reservas</PageTitle>
      <Subtitle>
        Veja os veículos que você locou e acompanhe o status da aprovação pelo locador.
      </Subtitle>

      {loading ? (
        <EmptyBookings>Carregando reservas...</EmptyBookings>
      ) : lesseeBookings.length === 0 ? (
        <EmptyBookings>Você ainda não possui reservas como locatário.</EmptyBookings>
      ) : (
        <BookingsGrid>
          {lesseeBookings.map((booking) => (
            <BookingCard key={booking.id}>
              <BookingHeader>
                <BookingVehicle>
                  {booking.vehicle
                    ? `${booking.vehicle.make || ''} ${booking.vehicle.model || ''} ${booking.vehicle.year || ''}`.trim()
                    : 'Veículo'}
                </BookingVehicle>
                <BookingStatus $status={String(booking.status || '')}>
                  {formatStatus(booking.status)}
                </BookingStatus>
              </BookingHeader>
              <BookingLine>
                Locador: {booking.lessor ? `${booking.lessor.firstName || ''} ${booking.lessor.lastName || ''}`.trim() : '-'}
              </BookingLine>
              <BookingLine>
                Aprovação: {getApprovalLabel(booking.status)}
              </BookingLine>
              <BookingLine>
                Pagamento: {formatPaymentStatus(booking.paymentStatus)}
              </BookingLine>
              <BookingLine>
                <Calendar size={14} /> Período: {formatDate(booking.startDate)} até {formatDate(booking.endDate)}
              </BookingLine>
              <BookingLine>
                Valor total: R$ {Number(booking.totalAmount || 0).toFixed(2)}
              </BookingLine>
              <BookingDetailButton
                type="button"
                onClick={() => navigate(`/booking/${booking.id}/details`)}
              >
                Ver detalhes da reserva
              </BookingDetailButton>
            </BookingCard>
          ))}
        </BookingsGrid>
      )}
    </Container>
  );
};

export default MyBookingsPage;
