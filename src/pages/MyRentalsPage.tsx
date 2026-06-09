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

const RentalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const RentalCard = styled.div`
  ${glassPanelCss}
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`;

const RentalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  align-items: flex-start;
`;

const RentalVehicle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  color: ${modernTheme.colors.ink};
`;

const RentalStatus = styled.span<{ $status: string }>`
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

const RentalLine = styled.div`
  color: ${modernTheme.colors.inkSoft};
  font-size: 0.92rem;
`;

const RentalDetailButton = styled.button`
  ${secondaryButtonCss}
  margin-top: 0.3rem;
  width: 100%;
  padding: 0.6rem 0.85rem;
  cursor: pointer;
  color: ${modernTheme.colors.inkSoft};
  font-weight: 600;
`;

const EmptyRentals = styled.div`
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

const formatDate = (value?: string | Date) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('pt-BR');
};

const getRemainingLabel = (endDate?: string | Date) => {
  if (!endDate) return 'Sem prazo definido';
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return 'Prazo inválido';
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days > 1) return `${days} dias restantes`;
  if (days === 1) return '1 dia restante';
  if (days === 0) return 'Termina hoje';
  return 'Prazo encerrado';
};

const MyRentalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lessorRentals, setLessorRentals] = useState<any[]>([]);

  useEffect(() => {
    const loadRentals = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.id) {
          setLessorRentals([]);
          return;
        }

        const bookings = await bookingService.getBookings().catch(() => []);
        const rentalsAsLessor = Array.isArray(bookings)
          ? bookings.filter((b: any) => b.lessorId === user.id || b.lessor?.id === user.id)
          : [];

        setLessorRentals(
          rentalsAsLessor
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

    void loadRentals();
  }, []);

  return (
    <Container>
      <PageTitle><Car size={24} /> Minhas locações</PageTitle>
      <Subtitle>
        Acompanhe o trâmite das reservas dos seus veículos, com status, período e prazo de devolução.
      </Subtitle>

      {loading ? (
        <EmptyRentals>Carregando locações...</EmptyRentals>
      ) : lessorRentals.length === 0 ? (
        <EmptyRentals>Você ainda não possui locações como locador.</EmptyRentals>
      ) : (
        <RentalsGrid>
          {lessorRentals.map((rental) => (
            <RentalCard key={rental.id}>
              <RentalHeader>
                <RentalVehicle>
                  {rental.vehicle
                    ? `${rental.vehicle.make || ''} ${rental.vehicle.model || ''} ${rental.vehicle.year || ''}`.trim()
                    : 'Veículo'}
                </RentalVehicle>
                <RentalStatus $status={String(rental.status || '')}>
                  {formatStatus(rental.status)}
                </RentalStatus>
              </RentalHeader>
              <RentalLine>
                Locatário: {rental.lessee ? `${rental.lessee.firstName || ''} ${rental.lessee.lastName || ''}`.trim() : '-'}
              </RentalLine>
              <RentalLine>
                <Calendar size={14} /> Período: {formatDate(rental.startDate)} até {formatDate(rental.endDate)}
              </RentalLine>
              <RentalLine>
                Devolução prevista: {formatDate(rental.endDate)}
              </RentalLine>
              <RentalLine>
                Tempo restante: {getRemainingLabel(rental.endDate)}
              </RentalLine>
              <RentalLine>
                Valor total: R$ {Number(rental.totalAmount || 0).toFixed(2)}
              </RentalLine>
              <RentalDetailButton
                type="button"
                onClick={() => navigate(`/booking/${rental.id}/details`)}
              >
                Ver detalhes da locação
              </RentalDetailButton>
            </RentalCard>
          ))}
        </RentalsGrid>
      )}
    </Container>
  );
};

export default MyRentalsPage;
