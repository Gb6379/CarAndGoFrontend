import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Car, Star, Location, Calendar, Search } from '../components/IconSystem';
import { bookingService } from '../services/authService';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e5e5;

  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 0;
  border: none;
  background: none;
  color: ${props => props.active ? '#1a1a1a' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#1a1a1a' : 'transparent'};
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  margin-bottom: -2px;
  white-space: nowrap;

  &:hover {
    color: #1a1a1a;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 400px;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const TripIllustration = styled.div`
  width: 200px;
  height: 150px;
  margin-bottom: 2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 120px;
    color: #8B5CF6;
    opacity: 0.8;
  }

  &::before {
    content: '';
    position: absolute;
    width: 180px;
    height: 180px;
    border: 2px dashed #8B5CF6;
    border-radius: 50%;
    opacity: 0.3;
  }

  &::after {
    content: '';
    position: absolute;
    width: 120px;
    height: 120px;
    border: 2px dashed #e0e0e0;
    border-radius: 50%;
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 120px;
    
    svg {
      font-size: 90px;
    }

    &::before {
      width: 140px;
      height: 140px;
    }

    &::after {
      width: 100px;
      height: 100px;
    }
  }
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 400px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
`;

const FindTripsButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #8B5CF6;
    background: #fafafa;
  }

  svg {
    font-size: 18px;
  }
`;

const TripsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const TripCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border-color: rgba(0,0,0,0.12);
  }
`;

const TripImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #8B5CF6;
  position: relative;
  overflow: hidden;

  svg {
    position: relative;
    z-index: 1;
  }
`;

const TripInfo = styled.div`
  padding: 1.5rem;
`;

const TripHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const TripTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  line-height: 1.3;
  flex: 1;
`;

const TripStatus = styled.span<{ status: string }>`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 1rem;
  background: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'confirmed': return '#e8f5e8';
      case 'active': return '#d1ecf1';
      case 'awaiting_return': return '#ede9fe';
      case 'completed': return '#d4edda';
      case 'pending': return '#fff3cd';
      case 'cancelled': return '#f8d7da';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch(props.status?.toLowerCase()) {
      case 'confirmed': return '#155724';
      case 'active': return '#0c5460';
      case 'awaiting_return': return '#7c3aed';
      case 'completed': return '#155724';
      case 'pending': return '#856404';
      case 'cancelled': return '#721c24';
      default: return '#495057';
    }
  }};
`;

const TripLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const TripDates = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const TripFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
`;

const TripPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const TripAction = styled.button`
  background: none;
  border: 1px solid #e0e0e0;
  color: #1a1a1a;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #8B5CF6;
    color: #8B5CF6;
  }
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
    month: 'short',
    year: 'numeric'
  });
};

const TripsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const bookings = await bookingService.getBookings();
      
      // Filter bookings based on user type
      let userTrips: any[] = [];
      
      if (userData.userType === 'lessee') {
        // Show bookings where user is the lessee (renter)
        userTrips = bookings.filter((booking: any) => 
          booking.lesseeId === userData.id || booking.lessee?.id === userData.id
        );
      } else if (userData.userType === 'lessor') {
        // Show bookings where user is the lessor (car owner)
        userTrips = bookings.filter((booking: any) => 
          booking.lessorId === userData.id || booking.lessor?.id === userData.id
        );
      } else if (userData.userType === 'both') {
        // Show all bookings where user is either lessee or lessor
        userTrips = bookings.filter((booking: any) => 
          booking.lesseeId === userData.id || 
          booking.lessee?.id === userData.id ||
          booking.lessorId === userData.id || 
          booking.lessor?.id === userData.id
        );
      }

      setTrips(userTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
    const now = new Date();
    const endDate = new Date(trip.endDate);
    const status = trip.status?.toLowerCase();

    if (activeTab === 'upcoming') {
      return endDate >= now && status !== 'cancelled' && status !== 'completed';
    } else {
      return endDate < now || status === 'completed' || status === 'cancelled';
    }
  });

  if (loading) {
    return (
      <Container>
        <PageTitle>Viagens</PageTitle>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Carregando viagens...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>Viagens</PageTitle>

      <TabsContainer>
        <Tab 
          active={activeTab === 'upcoming'}
          onClick={() => setActiveTab('upcoming')}
        >
          Próximas
        </Tab>
        <Tab 
          active={activeTab === 'past'}
          onClick={() => setActiveTab('past')}
        >
          Passadas
        </Tab>
      </TabsContainer>

      {filteredTrips.length === 0 ? (
        <EmptyStateContainer>
          <TripIllustration>
            <Car size={120} />
          </TripIllustration>
          <EmptyStateTitle>
            {activeTab === 'upcoming' ? 'Nenhuma viagem programada' : 'Nenhuma viagem passada'}
          </EmptyStateTitle>
          <EmptyStateText>
            {activeTab === 'upcoming' 
              ? 'Quando você fizer uma reserva, ela aparecerá aqui'
              : 'Suas viagens concluídas aparecerão aqui'}
          </EmptyStateText>
          {activeTab === 'upcoming' && (
            <FindTripsButton onClick={() => navigate('/vehicles')}>
              <Search size={18} />
              Encontrar carros
            </FindTripsButton>
          )}
        </EmptyStateContainer>
      ) : (
        <TripsGrid>
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} onClick={() => navigate(`/vehicle/${trip.vehicleId || trip.vehicle?.id}`)}>
              <TripImage>
                <Car size={48} />
              </TripImage>
              <TripInfo>
                <TripHeader>
                  <TripTitle>
                    {trip.vehicle?.make || 'Veículo'} {trip.vehicle?.model || ''} {trip.vehicle?.year || ''}
                  </TripTitle>
                  <TripStatus status={trip.status}>
                    {getStatusLabel(trip.status)}
                  </TripStatus>
                </TripHeader>
                <TripLocation>
                  <Location size={16} />
                  {trip.vehicle?.city || 'Localização'} - {trip.vehicle?.state || ''}
                </TripLocation>
                <TripDates>
                  <Calendar size={16} />
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </TripDates>
                <TripFooter>
                  <TripPrice>R$ {typeof trip.totalAmount === 'number' ? trip.totalAmount.toFixed(2) : (parseFloat(trip.totalAmount) || 0).toFixed(2)}</TripPrice>
                  <TripAction onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/booking/${trip.id}/details`);
                  }}>
                    Ver detalhes
                  </TripAction>
                </TripFooter>
              </TripInfo>
            </TripCard>
          ))}
        </TripsGrid>
      )}
    </Container>
  );
};

export default TripsPage;

