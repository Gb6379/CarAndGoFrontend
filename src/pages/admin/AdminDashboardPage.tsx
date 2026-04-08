import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { adminService } from '../../services/authService';
import { getErrorMessage, errorToDisplay } from '../../utils/errorUtils';
import { People, Calendar, TrendingUp, Money, Timer, CheckCircle, Error as ErrorIcon, ArrowRight, Shield } from '../../components/IconSystem';
import modernTheme from '../../styles/modernTheme';
import { darkPanelCss, glassPanelCss, primaryButtonCss, secondaryButtonCss, subtitleCss, titleCss } from '../../styles/modernPrimitives';

const PageStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Title = styled.h1`
  ${titleCss}
  font-size: 1.9rem;
  margin: 0;
`;

const Subtitle = styled.p`
  ${subtitleCss}
  margin: 0;
  max-width: 720px;
`;

const HeroGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) minmax(280px, 0.95fr);
  gap: 1.25rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const HeroCard = styled.article`
  ${darkPanelCss}
  padding: 2rem;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.85fr);
  gap: 1.25rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: auto -6% -22% auto;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: rgba(246, 136, 92, 0.18);
    filter: blur(70px);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.84);
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h2`
  margin: 0 0 0.85rem;
  font-size: clamp(1.9rem, 2vw, 2.5rem);
  line-height: 1.08;
  letter-spacing: -0.03em;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  max-width: 620px;
  color: rgba(255,255,255,0.74);
  line-height: 1.7;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.5rem;
`;

const HeroButton = styled.button<{ $secondary?: boolean }>`
  ${p => p.$secondary ? secondaryButtonCss : primaryButtonCss}
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.9rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  ${p => p.$secondary && `
    background: rgba(255,255,255,0.1);
    color: white;
    border-color: rgba(255,255,255,0.12);
  `}
`;

const HeroAside = styled.div`
  display: grid;
  gap: 0.85rem;
  position: relative;
  z-index: 1;
`;

const HeroMiniCard = styled.div`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 22px;
  padding: 1rem 1.1rem;

  small {
    display: block;
    color: rgba(255,255,255,0.66);
    margin-bottom: 0.35rem;
    font-size: 0.82rem;
  }

  strong {
    display: block;
    font-size: 1.45rem;
    line-height: 1.1;
  }

  span {
    display: block;
    margin-top: 0.35rem;
    color: rgba(255,255,255,0.7);
    font-size: 0.88rem;
  }
`;

const SideStats = styled.div`
  display: grid;
  gap: 1rem;
`;

const SideStatCard = styled.article`
  ${glassPanelCss}
  border-radius: 24px;
  padding: 1.25rem;
`;

const SideStatLabel = styled.span`
  display: block;
  color: ${modernTheme.colors.muted};
  font-size: 0.82rem;
  margin-bottom: 0.4rem;
`;

const SideStatValue = styled.strong`
  display: block;
  color: ${modernTheme.colors.ink};
  font-size: 1.7rem;
  line-height: 1.1;
`;

const SideStatMeta = styled.span`
  display: block;
  margin-top: 0.4rem;
  color: ${modernTheme.colors.inkSoft};
  font-size: 0.9rem;
`;

const MetricGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled.article<{ $accent?: string; $clickable?: boolean }>`
  ${glassPanelCss}
  border-radius: 24px;
  padding: 1.2rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  ${p => p.$clickable && 'cursor: pointer;'}

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
    height: 4px;
    background: ${p => p.$accent || modernTheme.colors.brand};
  }

  &:hover {
    transform: ${p => p.$clickable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${p => p.$clickable ? '0 24px 52px rgba(15, 23, 42, 0.14)' : modernTheme.shadows.soft};
  }
`;

const MetricIcon = styled.div<{ $accent?: string }>`
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.85rem;
  background: ${p => p.$accent ? `${p.$accent}18` : 'rgba(246, 136, 92, 0.14)'};
  color: ${p => p.$accent || modernTheme.colors.brandStrong};
`;

const MetricLabel = styled.div`
  color: ${modernTheme.colors.muted};
  font-size: 0.86rem;
`;

const MetricValue = styled.div`
  font-size: 1.85rem;
  font-weight: 700;
  color: ${modernTheme.colors.ink};
  margin-top: 0.25rem;
`;

const MetricMeta = styled.div`
  margin-top: 0.4rem;
  color: ${modernTheme.colors.inkSoft};
  font-size: 0.9rem;
`;

const InsightGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const InsightCard = styled.article`
  ${glassPanelCss}
  border-radius: 28px;
  padding: 1.4rem;
  min-height: 100%;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.08rem;
  color: ${modernTheme.colors.ink};
`;

const CardSubtitle = styled.p`
  margin: 0.3rem 0 0;
  color: ${modernTheme.colors.muted};
  font-size: 0.92rem;
  line-height: 1.6;
`;

const DistributionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-top: 1.25rem;
`;

const DistributionRow = styled.button`
  border: none;
  background: rgba(255,255,255,0.52);
  border-radius: 18px;
  padding: 0.9rem 1rem;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.1);
  }
`;

const DistributionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.6rem;
`;

const DistributionLabel = styled.span`
  color: ${modernTheme.colors.ink};
  font-weight: 600;
`;

const DistributionValue = styled.span`
  color: ${modernTheme.colors.inkSoft};
  font-size: 0.88rem;
`;

const DistributionTrack = styled.div`
  height: 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  overflow: hidden;
`;

const DistributionFill = styled.div<{ $accent?: string; $width: number }>`
  height: 100%;
  width: ${p => (p.$width <= 0 ? 0 : Math.max(6, p.$width))}%;
  border-radius: inherit;
  background: ${p => p.$accent || modernTheme.colors.brand};
`;

const RingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.35rem 0 1rem;
`;

const ProgressRing = styled.div<{ $value: number }>`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  background:
    conic-gradient(
      ${modernTheme.colors.brand} 0 ${p => p.$value}%,
      rgba(15, 23, 42, 0.08) ${p => p.$value}% 100%
    );

  &::before {
    content: '';
    position: absolute;
    inset: 14px;
    border-radius: 50%;
    background: rgba(255,255,255,0.96);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
  }
`;

const ProgressRingCenter = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;

  strong {
    display: block;
    color: ${modernTheme.colors.ink};
    font-size: 2rem;
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 0.35rem;
    color: ${modernTheme.colors.muted};
    font-size: 0.88rem;
  }
`;

const HealthStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
`;

const HealthStat = styled.div`
  background: rgba(255,255,255,0.52);
  border-radius: 18px;
  padding: 0.9rem 1rem;

  strong {
    display: block;
    font-size: 1.2rem;
    color: ${modernTheme.colors.ink};
  }

  span {
    color: ${modernTheme.colors.muted};
    font-size: 0.84rem;
  }
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
  const totalBookings = Number(bookings.totalBookings || 0);
  const pendingBookings = Number(bookings.pendingBookings || 0);
  const activeBookings = Number(bookings.activeBookings || 0);
  const completedBookings = Number(bookings.completedBookings || 0);
  const cancelledBookings = Number(bookings.cancelledBookings || 0);
  const totalRevenue = Number(bookings.totalRevenue || 0);
  const totalUsers = Number(users.totalUsers || 0);
  const lessors = Number(users.lessors || 0);
  const lessees = Number(users.lessees || 0);
  const avgRevenuePerBooking = totalBookings ? totalRevenue / totalBookings : 0;
  const completionRate = totalBookings ? Math.round((completedBookings / totalBookings) * 100) : 0;
  const operationalLoad = totalBookings ? Math.round(((activeBookings + pendingBookings) / totalBookings) * 100) : 0;
  const lessorShare = totalUsers ? Math.round((lessors / totalUsers) * 100) : 0;
  const bookingMix = [
    { label: 'Pendentes', value: pendingBookings, accent: '#f59e0b', onClick: () => goToBookings('pending') },
    { label: 'Ativas', value: activeBookings, accent: modernTheme.colors.brand, onClick: () => goToBookings('active') },
    { label: 'Concluídas', value: completedBookings, accent: '#10b981', onClick: () => goToBookings('completed') },
    { label: 'Canceladas', value: cancelledBookings, accent: '#ef4444', onClick: () => goToBookings('cancelled') },
  ];
  const userMix = [
    { label: 'Locadores', value: lessors, accent: modernTheme.colors.brand, onClick: () => goToUsers('lessor') },
    { label: 'Locatários', value: lessees, accent: '#8b5cf6', onClick: () => goToUsers('lessee') },
    { label: 'Demais perfis', value: Math.max(totalUsers - lessors - lessees, 0), accent: '#38bdf8', onClick: () => goToUsers() },
  ];
  const maxBookingValue = Math.max(...bookingMix.map((item) => item.value), 1);
  const maxUserValue = Math.max(...userMix.map((item) => item.value), 1);
  const formatCompactCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const handleCardKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <PageStack>
      <TitleBlock>
        <Title>Painel administrativo</Title>
        <Subtitle>
          Visão central da operação do CarAndGo com foco em usuários, reservas e receita.
        </Subtitle>
      </TitleBlock>

      <HeroGrid>
        <HeroCard>
          <HeroContent>
            <HeroEyebrow>
              <Shield size={14} />
              Centro de controle
            </HeroEyebrow>
            <HeroTitle>Monitore a operação inteira em um só lugar.</HeroTitle>
            <HeroSubtitle>
              Acompanhe gargalos de aprovação, movimentação financeira e crescimento da base com o mesmo visual dos painéis internos.
            </HeroSubtitle>
            <HeroActions>
              <HeroButton type="button" onClick={() => goToUsers()}>
                Ver usuários
                <ArrowRight size={16} />
              </HeroButton>
              <HeroButton type="button" $secondary onClick={() => goToBookings()}>
                Abrir reservas
              </HeroButton>
            </HeroActions>
          </HeroContent>
          <HeroAside>
            <HeroMiniCard>
              <small>Usuários totais</small>
              <strong>{totalUsers}</strong>
              <span>{lessors} locadores e {lessees} locatários</span>
            </HeroMiniCard>
            <HeroMiniCard>
              <small>Pontos de atenção</small>
              <strong>{pendingBookings + cancelledBookings}</strong>
              <span>Pendências e cancelamentos para acompanhar</span>
            </HeroMiniCard>
            <HeroMiniCard>
              <small>Receita acumulada</small>
              <strong>{formatCompactCurrency(totalRevenue)}</strong>
              <span>Média de {formatCompactCurrency(avgRevenuePerBooking)} por reserva</span>
            </HeroMiniCard>
          </HeroAside>
        </HeroCard>

        <SideStats>
          <SideStatCard>
            <SideStatLabel>Taxa de conclusão</SideStatLabel>
            <SideStatValue>{completionRate}%</SideStatValue>
            <SideStatMeta>{completedBookings} reservas concluídas</SideStatMeta>
          </SideStatCard>
          <SideStatCard>
            <SideStatLabel>Operação em andamento</SideStatLabel>
            <SideStatValue>{operationalLoad}%</SideStatValue>
            <SideStatMeta>{activeBookings + pendingBookings} reservas ativas ou pendentes</SideStatMeta>
          </SideStatCard>
          <SideStatCard>
            <SideStatLabel>Share de locadores</SideStatLabel>
            <SideStatValue>{lessorShare}%</SideStatValue>
            <SideStatMeta>Base ativa que oferta veículos na plataforma</SideStatMeta>
          </SideStatCard>
        </SideStats>
      </HeroGrid>

      <MetricGrid>
        <MetricCard
          $accent={modernTheme.colors.brand}
          $clickable
          role="button"
          tabIndex={0}
          onClick={() => goToUsers()}
          onKeyDown={(event) => handleCardKeyDown(event, () => goToUsers())}
        >
          <MetricIcon $accent={modernTheme.colors.brand}>
            <People size={22} />
          </MetricIcon>
          <MetricLabel>Total de usuários</MetricLabel>
          <MetricValue>{totalUsers}</MetricValue>
          <MetricMeta>Base consolidada da plataforma</MetricMeta>
        </MetricCard>

        <MetricCard
          $accent="#f59e0b"
          $clickable
          role="button"
          tabIndex={0}
          onClick={() => goToBookings('pending')}
          onKeyDown={(event) => handleCardKeyDown(event, () => goToBookings('pending'))}
        >
          <MetricIcon $accent="#f59e0b">
            <Timer size={22} />
          </MetricIcon>
          <MetricLabel>Reservas pendentes</MetricLabel>
          <MetricValue>{pendingBookings}</MetricValue>
          <MetricMeta>Demandam ação operacional</MetricMeta>
        </MetricCard>

        <MetricCard
          $accent={modernTheme.colors.brandStrong}
          $clickable
          role="button"
          tabIndex={0}
          onClick={() => goToBookings('active')}
          onKeyDown={(event) => handleCardKeyDown(event, () => goToBookings('active'))}
        >
          <MetricIcon $accent={modernTheme.colors.brandStrong}>
            <TrendingUp size={22} />
          </MetricIcon>
          <MetricLabel>Reservas ativas</MetricLabel>
          <MetricValue>{activeBookings}</MetricValue>
          <MetricMeta>Operações em curso agora</MetricMeta>
        </MetricCard>

        <MetricCard
          $accent="#10b981"
          $clickable
          role="button"
          tabIndex={0}
          onClick={() => goToBookings('completed')}
          onKeyDown={(event) => handleCardKeyDown(event, () => goToBookings('completed'))}
        >
          <MetricIcon $accent="#10b981">
            <CheckCircle size={22} />
          </MetricIcon>
          <MetricLabel>Reservas concluídas</MetricLabel>
          <MetricValue>{completedBookings}</MetricValue>
          <MetricMeta>Fluxo finalizado com sucesso</MetricMeta>
        </MetricCard>

        <MetricCard
          $accent="#ef4444"
          $clickable
          role="button"
          tabIndex={0}
          onClick={() => goToBookings('cancelled')}
          onKeyDown={(event) => handleCardKeyDown(event, () => goToBookings('cancelled'))}
        >
          <MetricIcon $accent="#ef4444">
            <ErrorIcon size={22} />
          </MetricIcon>
          <MetricLabel>Canceladas</MetricLabel>
          <MetricValue>{cancelledBookings}</MetricValue>
          <MetricMeta>Indicador de risco e atrito</MetricMeta>
        </MetricCard>

        <MetricCard
          $accent="#7c3aed"
          $clickable
          role="button"
          tabIndex={0}
          onClick={() => goToBookings()}
          onKeyDown={(event) => handleCardKeyDown(event, () => goToBookings())}
        >
          <MetricIcon $accent="#7c3aed">
            <Money size={22} />
          </MetricIcon>
          <MetricLabel>Receita total</MetricLabel>
          <MetricValue>{formatCompactCurrency(totalRevenue)}</MetricValue>
          <MetricMeta>{totalBookings} reservas registradas</MetricMeta>
        </MetricCard>
      </MetricGrid>

      <InsightGrid>
        <InsightCard>
          <CardTitle>Distribuição das reservas</CardTitle>
          <CardSubtitle>Resumo por status para agir rápido nas filas mais críticas.</CardSubtitle>
          <DistributionList>
            {bookingMix.map((item) => (
              <DistributionRow key={item.label} type="button" onClick={item.onClick}>
                <DistributionHeader>
                  <DistributionLabel>{item.label}</DistributionLabel>
                  <DistributionValue>{item.value} reservas</DistributionValue>
                </DistributionHeader>
                <DistributionTrack>
                  <DistributionFill $accent={item.accent} $width={(item.value / maxBookingValue) * 100} />
                </DistributionTrack>
              </DistributionRow>
            ))}
          </DistributionList>
        </InsightCard>

        <InsightCard>
          <CardTitle>Saúde operacional</CardTitle>
          <CardSubtitle>Leitura rápida da qualidade do fluxo com base nos dados do painel.</CardSubtitle>
          <RingWrap>
            <ProgressRing $value={completionRate}>
              <ProgressRingCenter>
                <strong>{completionRate}%</strong>
                <span>conclusão</span>
              </ProgressRingCenter>
            </ProgressRing>
          </RingWrap>
          <HealthStats>
            <HealthStat>
              <strong>{totalBookings}</strong>
              <span>reservas totais</span>
            </HealthStat>
            <HealthStat>
              <strong>{activeBookings + pendingBookings}</strong>
              <span>em acompanhamento</span>
            </HealthStat>
            <HealthStat>
              <strong>{formatCompactCurrency(avgRevenuePerBooking)}</strong>
              <span>ticket médio</span>
            </HealthStat>
            <HealthStat>
              <strong>{cancelledBookings}</strong>
              <span>eventos cancelados</span>
            </HealthStat>
          </HealthStats>
        </InsightCard>

        <InsightCard>
          <CardTitle>Mix de usuários</CardTitle>
          <CardSubtitle>Composição da base entre oferta, demanda e demais perfis.</CardSubtitle>
          <DistributionList>
            {userMix.map((item) => (
              <DistributionRow key={item.label} type="button" onClick={item.onClick}>
                <DistributionHeader>
                  <DistributionLabel>{item.label}</DistributionLabel>
                  <DistributionValue>{item.value} contas</DistributionValue>
                </DistributionHeader>
                <DistributionTrack>
                  <DistributionFill $accent={item.accent} $width={(item.value / maxUserValue) * 100} />
                </DistributionTrack>
              </DistributionRow>
            ))}
          </DistributionList>
        </InsightCard>
      </InsightGrid>
    </PageStack>
  );
};

export default AdminDashboardPage;
