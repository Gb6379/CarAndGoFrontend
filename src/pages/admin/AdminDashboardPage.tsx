import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { adminService } from '../../services/authService';
import { getErrorMessage, errorToDisplay } from '../../utils/errorUtils';
import { People, Calendar, TrendingUp, Money, Timer, CheckCircle, Error as ErrorIcon } from '../../components/IconSystem';

const Title = styled.h1`
  font-size: 1.75rem;
  color: #1a1d29;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ $color?: string; $clickable?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border-left: 4px solid ${p => p.$color || '#F6885C'};
  ${p => p.$clickable && `
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }
  `}
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1d29;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
`;

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<{
    bookings?: { totalBookings: number; pendingBookings: number; activeBookings: number; completedBookings: number; cancelledBookings: number; totalRevenue: number };
    users?: { totalUsers: number; lessors: number; lessees: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService.getDashboard()
      .then(setData)
      .catch((err: any) => setError(getErrorMessage(err, 'Erro ao carregar indicadores')))
      .finally(() => setLoading(false));
  }, []);

  const goToUsers = (userType?: string) => {
    const q = userType ? `?userType=${userType}` : '';
    navigate(`/admin/users${q}`);
  };

  const goToBookings = (status?: string) => {
    const q = status ? `?status=${status}` : '';
    navigate(`/admin/bookings${q}`);
  };

  if (loading) return <Title>Carregando indicadores...</Title>;
  if (error) return <Title style={{ color: '#c00' }}>{errorToDisplay(error)}</Title>;
  if (!data) return null;

  const { bookings = {} as any, users = {} as any } = data;

  return (
    <>
      <Title>Indicadores</Title>

      <Section>
        <SectionTitle>Usuários</SectionTitle>
        <StatsGrid>
          <StatCard $color="#F6885C" $clickable onClick={() => goToUsers()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goToUsers()}>
            <StatLabel><People size={14} /> Total de usuários</StatLabel>
            <StatValue>{users.totalUsers ?? 0}</StatValue>
          </StatCard>
          <StatCard $color="#10b981" $clickable onClick={() => goToUsers('lessor')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goToUsers('lessor')}>
            <StatLabel>Locadores</StatLabel>
            <StatValue>{users.lessors ?? 0}</StatValue>
          </StatCard>
          <StatCard $color="#F6885C" $clickable onClick={() => goToUsers('lessee')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goToUsers('lessee')}>
            <StatLabel>Locatários</StatLabel>
            <StatValue>{users.lessees ?? 0}</StatValue>
          </StatCard>
        </StatsGrid>
      </Section>

      <Section>
        <SectionTitle>Reservas</SectionTitle>
        <StatsGrid>
          <StatCard $color="#6b7280" $clickable onClick={() => goToBookings()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goToBookings()}>
            <StatLabel><Calendar size={14} /> Total</StatLabel>
            <StatValue>{bookings.totalBookings ?? 0}</StatValue>
          </StatCard>
          <StatCard $color="#f59e0b" $clickable onClick={() => goToBookings('pending')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goToBookings('pending')}>
            <StatLabel><Timer size={14} /> Pendentes</StatLabel>
            <StatValue>{bookings.pendingBookings ?? 0}</StatValue>
          </StatCard>
          <StatCard $color="#F6885C" $clickable onClick={() => goToBookings('active')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goToBookings('active')}>
            <StatLabel><TrendingUp size={14} /> Ativas</StatLabel>
            <StatValue>{bookings.activeBookings ?? 0}</StatValue>
          </StatCard>
          <StatCard $color="#10b981" $clickable onClick={() => goToBookings('completed')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goToBookings('completed')}>
            <StatLabel><CheckCircle size={14} /> Concluídas</StatLabel>
            <StatValue>{bookings.completedBookings ?? 0}</StatValue>
          </StatCard>
          <StatCard $color="#ef4444" $clickable onClick={() => goToBookings('cancelled')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goToBookings('cancelled')}>
            <StatLabel><ErrorIcon size={14} /> Canceladas</StatLabel>
            <StatValue>{bookings.cancelledBookings ?? 0}</StatValue>
          </StatCard>
          <StatCard $color="#ea580c" $clickable onClick={() => goToBookings()} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goToBookings()}>
            <StatLabel><Money size={14} /> Receita (R$)</StatLabel>
            <StatValue>{Number(bookings.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</StatValue>
          </StatCard>
        </StatsGrid>
      </Section>
    </>
  );
};

export default AdminDashboardPage;
