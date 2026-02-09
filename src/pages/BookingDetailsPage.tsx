import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/authService';
import { Car, Calendar, Location, Schedule, User, CreditCard, Check, Close, ArrowLeft } from '../components/IconSystem';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'confirmed': return '#dcfce7';
      case 'active': return '#dbeafe';
      case 'awaiting_return': return '#ede9fe';
      case 'completed': return '#d1fae5';
      case 'pending': return '#fef3c7';
      case 'cancelled': return '#fee2e2';
      case 'rejected': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'confirmed': return '#166534';
      case 'active': return '#1e40af';
      case 'awaiting_return': return '#7c3aed';
      case 'completed': return '#065f46';
      case 'pending': return '#92400e';
      case 'cancelled': return '#991b1b';
      case 'rejected': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #e5e7eb;
`;

const CardTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #8B5CF6;
  }
`;

const VehicleCard = styled(Card)`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const VehicleImage = styled.div`
  width: 180px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    color: white;
    opacity: 0.8;
  }

  @media (max-width: 600px) {
    width: 100%;
    height: 150px;
  }
`;

const VehicleInfo = styled.div`
  flex: 1;
`;

const VehicleName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const VehicleDetail = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VehiclePrice = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #8B5CF6;
  margin-top: 0.75rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.875rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoValue = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a1a1a;
  text-align: right;
`;

const TotalRow = styled(InfoRow)`
  border-top: 2px solid #e5e7eb;
  margin-top: 0.5rem;
  padding-top: 1rem;
`;

const TotalLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const TotalValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #8B5CF6;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' | 'success' | 'secondary' }>`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props => {
    switch(props.variant) {
      case 'danger':
        return `
          background: white;
          border: 2px solid #ef4444;
          color: #ef4444;
          &:hover {
            background: #fef2f2;
          }
        `;
      case 'success':
        return `
          background: #10b981;
          border: none;
          color: white;
          &:hover {
            background: #059669;
          }
        `;
      case 'secondary':
        return `
          background: white;
          border: 2px solid #e5e7eb;
          color: #374151;
          &:hover {
            background: #f9fafb;
            border-color: #d1d5db;
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          &:hover {
            opacity: 0.9;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OwnerCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OwnerAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
`;

const OwnerInfo = styled.div`
  flex: 1;
`;

const OwnerName = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const OwnerRole = styled.p`
  font-size: 0.85rem;
  color: #666;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;
  color: #ef4444;
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TimelineItem = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
  padding-bottom: 1.5rem;

  &:last-child {
    padding-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: 11px;
    top: 28px;
    width: 2px;
    height: calc(100% - 20px);
    background: ${props => props.completed ? '#10b981' : '#e5e7eb'};
  }

  &:last-child::before {
    display: none;
  }
`;

const TimelineDot = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => props.completed ? '#10b981' : props.active ? '#8B5CF6' : '#e5e7eb'};
  color: white;
  font-size: 12px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTitle = styled.p<{ active?: boolean }>`
  font-size: 0.95rem;
  font-weight: ${props => props.active ? '600' : '500'};
  color: ${props => props.active ? '#1a1a1a' : '#666'};
`;

const TimelineDate = styled.p`
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.25rem;
`;

const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'pending': 'Pendente',
    'confirmed': 'Confirmada',
    'active': 'Em andamento',
    'awaiting_return': 'Aguardando Devolução',
    'completed': 'Concluída',
    'cancelled': 'Cancelada',
    'rejected': 'Rejeitada',
    'expired': 'Expirada'
  };
  return statusMap[status?.toLowerCase()] || status;
};

const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleString('pt-BR', { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const BookingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLessor = booking?.lessorId === user.id || booking?.lessor?.id === user.id;
  const isLessee = booking?.lesseeId === user.id || booking?.lessee?.id === user.id;

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await bookingService.getBooking(id);
      setBooking(data);
    } catch (err: any) {
      setError('Não foi possível carregar os detalhes da reserva.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!id) return;
    try {
      setActionLoading(true);
      await bookingService.confirmBooking(id);
      await loadBooking();
    } catch (err: any) {
      setError('Erro ao confirmar reserva.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectBooking = async () => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja rejeitar esta reserva?')) return;
    try {
      setActionLoading(true);
      await bookingService.rejectBooking(id);
      await loadBooking();
    } catch (err: any) {
      setError('Erro ao rejeitar reserva.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReturn = async () => {
    if (!id) return;
    if (!window.confirm('Confirmar que o veículo foi devolvido?')) return;
    try {
      setActionLoading(true);
      await bookingService.confirmReturn(id);
      await loadBooking();
    } catch (err: any) {
      setError('Erro ao confirmar devolução.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja cancelar esta reserva?')) return;
    try {
      setActionLoading(true);
      await bookingService.cancelBooking(id, 'Cancelado pelo usuário');
      await loadBooking();
    } catch (err: any) {
      setError('Erro ao cancelar reserva.');
    } finally {
      setActionLoading(false);
    }
  };

  const getTimelineStatus = (step: string) => {
    const statusOrder = ['pending', 'confirmed', 'active', 'awaiting_return', 'completed'];
    const currentIndex = statusOrder.indexOf(booking?.status?.toLowerCase());
    const stepIndex = statusOrder.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Carregando detalhes da reserva...</LoadingContainer>
      </Container>
    );
  }

  if (error || !booking) {
    return (
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Voltar
        </BackButton>
        <ErrorContainer>{error || 'Reserva não encontrada.'}</ErrorContainer>
      </Container>
    );
  }

  const vehicle = booking.vehicle || {};
  const lessor = booking.lessor || {};
  const lessee = booking.lessee || {};
  const status = booking.status?.toLowerCase();

  const totalAmount = typeof booking.totalAmount === 'number' 
    ? booking.totalAmount 
    : parseFloat(booking.totalAmount) || 0;
  const platformFee = typeof booking.platformFee === 'number' 
    ? booking.platformFee 
    : parseFloat(booking.platformFee) || 0;
  const securityDeposit = typeof booking.securityDeposit === 'number' 
    ? booking.securityDeposit 
    : parseFloat(booking.securityDeposit) || 0;
  const dailyRate = typeof booking.dailyRate === 'number' 
    ? booking.dailyRate 
    : parseFloat(booking.dailyRate) || 0;

  // Calculate days
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const baseAmount = days * dailyRate;

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Voltar
      </BackButton>

      <PageTitle>
        <Calendar size={28} />
        Detalhes da Reserva
        <StatusBadge status={booking.status}>{getStatusLabel(booking.status)}</StatusBadge>
      </PageTitle>

      <ContentGrid>
        <MainContent>
          {/* Vehicle Info */}
          <VehicleCard>
            <VehicleImage>
              <Car size={48} />
            </VehicleImage>
            <VehicleInfo>
              <VehicleName>
                {vehicle.make || 'Veículo'} {vehicle.model || ''} {vehicle.year || ''}
              </VehicleName>
              <VehicleDetail>
                <Location size={16} />
                {vehicle.city || 'N/A'}, {vehicle.state || ''}
              </VehicleDetail>
              <VehicleDetail>
                Tipo: {vehicle.type || 'N/A'} • Câmbio: {vehicle.transmission || 'N/A'}
              </VehicleDetail>
              <VehicleDetail>
                Combustível: {vehicle.fuelType === 'eletrico' ? 'Elétrico' : vehicle.fuelType === 'combustao' ? 'Combustão' : vehicle.fuelType || 'N/A'} • {vehicle.seats || '5'} lugares
              </VehicleDetail>
              <VehiclePrice>R$ {dailyRate.toFixed(2)}/dia</VehiclePrice>
            </VehicleInfo>
          </VehicleCard>

          {/* Dates */}
          <Card>
            <CardTitle><Calendar size={20} /> Período da Locação</CardTitle>
            <InfoRow>
              <InfoLabel><Schedule size={16} /> Retirada</InfoLabel>
              <InfoValue>{formatDateTime(booking.startDate)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel><Schedule size={16} /> Devolução</InfoLabel>
              <InfoValue>{formatDateTime(booking.endDate)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Duração</InfoLabel>
              <InfoValue>{days} dia(s)</InfoValue>
            </InfoRow>
          </Card>

          {/* Timeline */}
          <Card>
            <CardTitle>Status da Reserva</CardTitle>
            <TimelineContainer>
              <TimelineItem 
                completed={getTimelineStatus('pending') === 'completed'}
                active={getTimelineStatus('pending') === 'active'}
              >
                <TimelineDot 
                  completed={getTimelineStatus('pending') === 'completed'}
                  active={getTimelineStatus('pending') === 'active'}
                >
                  {getTimelineStatus('pending') === 'completed' ? <Check size={14} /> : '1'}
                </TimelineDot>
                <TimelineContent>
                  <TimelineTitle active={getTimelineStatus('pending') === 'active'}>
                    Reserva Solicitada
                  </TimelineTitle>
                  <TimelineDate>{formatDateTime(booking.createdAt)}</TimelineDate>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem 
                completed={getTimelineStatus('confirmed') === 'completed'}
                active={getTimelineStatus('confirmed') === 'active'}
              >
                <TimelineDot 
                  completed={getTimelineStatus('confirmed') === 'completed'}
                  active={getTimelineStatus('confirmed') === 'active'}
                >
                  {getTimelineStatus('confirmed') === 'completed' ? <Check size={14} /> : '2'}
                </TimelineDot>
                <TimelineContent>
                  <TimelineTitle active={getTimelineStatus('confirmed') === 'active'}>
                    Aguardando Confirmação do Locador
                  </TimelineTitle>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem 
                completed={getTimelineStatus('active') === 'completed'}
                active={getTimelineStatus('active') === 'active'}
              >
                <TimelineDot 
                  completed={getTimelineStatus('active') === 'completed'}
                  active={getTimelineStatus('active') === 'active'}
                >
                  {getTimelineStatus('active') === 'completed' ? <Check size={14} /> : '3'}
                </TimelineDot>
                <TimelineContent>
                  <TimelineTitle active={getTimelineStatus('active') === 'active'}>
                    Viagem em Andamento
                  </TimelineTitle>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem 
                completed={getTimelineStatus('awaiting_return') === 'completed'}
                active={getTimelineStatus('awaiting_return') === 'active'}
              >
                <TimelineDot 
                  completed={getTimelineStatus('awaiting_return') === 'completed'}
                  active={getTimelineStatus('awaiting_return') === 'active'}
                >
                  {getTimelineStatus('awaiting_return') === 'completed' ? <Check size={14} /> : '4'}
                </TimelineDot>
                <TimelineContent>
                  <TimelineTitle active={getTimelineStatus('awaiting_return') === 'active'}>
                    Aguardando Devolução
                  </TimelineTitle>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem 
                completed={getTimelineStatus('completed') === 'completed'}
                active={getTimelineStatus('completed') === 'active'}
              >
                <TimelineDot 
                  completed={getTimelineStatus('completed') === 'completed'}
                  active={getTimelineStatus('completed') === 'active'}
                >
                  {getTimelineStatus('completed') === 'completed' ? <Check size={14} /> : '5'}
                </TimelineDot>
                <TimelineContent>
                  <TimelineTitle active={getTimelineStatus('completed') === 'active'}>
                    Concluída
                  </TimelineTitle>
                </TimelineContent>
              </TimelineItem>
            </TimelineContainer>
          </Card>
        </MainContent>

        <Sidebar>
          {/* Owner/Lessee Info */}
          <OwnerCard>
            <OwnerAvatar>
              {isLessee 
                ? (lessor.firstName?.[0] || lessor.name?.[0] || 'L')
                : (lessee.firstName?.[0] || lessee.name?.[0] || 'L')
              }
            </OwnerAvatar>
            <OwnerInfo>
              <OwnerName>
                {isLessee 
                  ? (lessor.firstName || lessor.name || 'Locador')
                  : (lessee.firstName || lessee.name || 'Locatário')
                }
              </OwnerName>
              <OwnerRole>{isLessee ? 'Proprietário do veículo' : 'Locatário'}</OwnerRole>
            </OwnerInfo>
          </OwnerCard>

          {/* Payment Summary */}
          <Card>
            <CardTitle><CreditCard size={20} /> Resumo do Pagamento</CardTitle>
            <InfoRow>
              <InfoLabel>Diária × {days}</InfoLabel>
              <InfoValue>R$ {baseAmount.toFixed(2)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Taxa da plataforma</InfoLabel>
              <InfoValue>R$ {platformFee.toFixed(2)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Caução</InfoLabel>
              <InfoValue>R$ {securityDeposit.toFixed(2)}</InfoValue>
            </InfoRow>
            <TotalRow>
              <TotalLabel>Total</TotalLabel>
              <TotalValue>R$ {totalAmount.toFixed(2)}</TotalValue>
            </TotalRow>
          </Card>

          {/* Actions */}
          <Card>
            <CardTitle>Ações</CardTitle>
            <ActionsGrid>
              {/* Lessor actions for pending bookings */}
              {isLessor && status === 'pending' && (
                <>
                  <ActionButton 
                    variant="success" 
                    onClick={handleConfirmBooking}
                    disabled={actionLoading}
                  >
                    <Check size={18} /> Aceitar Reserva
                  </ActionButton>
                  <ActionButton 
                    variant="danger" 
                    onClick={handleRejectBooking}
                    disabled={actionLoading}
                  >
                    <Close size={18} /> Rejeitar Reserva
                  </ActionButton>
                </>
              )}

              {/* Lessor action for awaiting return */}
              {isLessor && status === 'awaiting_return' && (
                <ActionButton 
                  variant="success" 
                  onClick={handleConfirmReturn}
                  disabled={actionLoading}
                >
                  <Check size={18} /> Confirmar Devolução
                </ActionButton>
              )}

              {/* Lessee can cancel pending or confirmed bookings */}
              {isLessee && (status === 'pending' || status === 'confirmed') && (
                <ActionButton 
                  variant="danger" 
                  onClick={handleCancelBooking}
                  disabled={actionLoading}
                >
                  <Close size={18} /> Cancelar Reserva
                </ActionButton>
              )}

              {/* View vehicle */}
              <ActionButton 
                variant="secondary"
                onClick={() => navigate(`/vehicle/${vehicle.id}`)}
              >
                <Car size={18} /> Ver Veículo
              </ActionButton>

              {/* Completed or cancelled - no actions */}
              {(status === 'completed' || status === 'cancelled' || status === 'rejected') && (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                  Nenhuma ação disponível
                </p>
              )}
            </ActionsGrid>
          </Card>
        </Sidebar>
      </ContentGrid>
    </Container>
  );
};

export default BookingDetailsPage;
