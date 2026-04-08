import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Car, Location } from '../components/IconSystem';
import modernTheme from '../styles/modernTheme';
import {
  glassPanelCss,
  pageShellCss,
  primaryButtonCss,
  secondaryButtonCss,
  titleCss,
} from '../styles/modernPrimitives';

const Container = styled.div`
  ${pageShellCss}
`;

const Title = styled.h1`
  ${titleCss}
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0.35rem;
  border-radius: ${modernTheme.radii.pill};
  background: rgba(15, 23, 42, 0.05);

  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: ${modernTheme.radii.pill};
  background: ${props => props.active ? modernTheme.gradients.brand : 'transparent'};
  color: ${props => props.active ? 'white' : modernTheme.colors.muted};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: ${props => props.active ? modernTheme.shadows.glow : 'none'};

  &:hover {
    color: ${props => props.active ? 'white' : modernTheme.colors.brandStrong};
  }

  @media (max-width: 640px) {
    padding: 0.85rem 1rem;
    white-space: nowrap;
  }
`;

const BookingsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const BookingCard = styled.div`
  ${glassPanelCss}
  padding: 2rem;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const BookingId = styled.div`
  font-size: 0.9rem;
  color: ${modernTheme.colors.muted};
`;

const BookingStatus = styled.div<{ status: string }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'confirmed': return '#e8f5e8';
      case 'pending': return '#fff3cd';
      case 'cancelled': return '#f8d7da';
      case 'completed': return '#d1ecf1';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'confirmed': return '#155724';
      case 'pending': return '#856404';
      case 'cancelled': return '#721c24';
      case 'completed': return '#0c5460';
      default: return '#495057';
    }
  }};
`;

const CarInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const CarImage = styled.div`
  width: 100px;
  height: 70px;
  background: linear-gradient(135deg, rgba(246, 136, 92, 0.18) 0%, rgba(139, 92, 246, 0.18) 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${modernTheme.colors.brandStrong};
`;

const CarDetails = styled.div`
  flex: 1;
`;

const CarTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${modernTheme.colors.ink};
`;

const CarLocation = styled.p`
  color: ${modernTheme.colors.muted};
  margin: 0;
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  h4 {
    font-size: 0.9rem;
    color: ${modernTheme.colors.muted};
    margin: 0 0 0.25rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  p {
    font-size: 1rem;
    color: ${modernTheme.colors.ink};
    margin: 0;
    font-weight: 500;
  }
`;

const PriceInfo = styled.div`
  background: rgba(255, 255, 255, 0.72);
  padding: 1rem;
  border-radius: 16px;
  margin-bottom: 1.5rem;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
    font-weight: 600;
    font-size: 1.1rem;
    color: ${modernTheme.colors.ink};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: ${modernTheme.radii.pill};
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  ${props => {
    switch(props.variant) {
      case 'primary':
        return `
          background: ${modernTheme.gradients.brand};
          color: white;
          box-shadow: ${modernTheme.shadows.glow};
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
          color: white;
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.74);
          color: ${modernTheme.colors.inkSoft};
          border: 1px solid rgba(15, 23, 42, 0.08);
          &:hover { background: white; }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${modernTheme.colors.muted};
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${modernTheme.colors.ink};
  }
  
  p {
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      navigate('/login');
      return;
    }

    // Simulate loading bookings
    setTimeout(() => {
      setBookings([
        {
          id: 'BK001',
          car: {
            title: 'Toyota Corolla 2022',
            location: 'São Paulo, SP'
          },
          startDate: '2024-01-15',
          endDate: '2024-01-17',
          totalAmount: 450,
          status: 'confirmed',
          pickupLocation: 'Shopping Iguatemi',
          returnLocation: 'Shopping Iguatemi'
        },
        {
          id: 'BK002',
          car: {
            title: 'Honda Civic 2021',
            location: 'Rio de Janeiro, RJ'
          },
          startDate: '2024-01-20',
          endDate: '2024-01-22',
          totalAmount: 540,
          status: 'pending',
          pickupLocation: 'Copacabana',
          returnLocation: 'Copacabana'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const filteredBookings = bookings.filter(booking => {
    switch(activeTab) {
      case 'upcoming':
        return booking.status === 'confirmed' || booking.status === 'pending';
      case 'past':
        return booking.status === 'completed' || booking.status === 'cancelled';
      default:
        return true;
    }
  });

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    }
  };

  const handleViewDetails = (bookingId: string) => {
    navigate(`/booking/${bookingId}`);
  };

  if (loading) {
    return (
      <Container>
        <Title>My Bookings</Title>
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>My Bookings</Title>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'upcoming'} 
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length})
        </Tab>
        <Tab 
          active={activeTab === 'past'} 
          onClick={() => setActiveTab('past')}
        >
          Past ({bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').length})
        </Tab>
      </TabsContainer>

      {filteredBookings.length === 0 ? (
        <EmptyState>
          <h3>No bookings found</h3>
          <p>You don't have any {activeTab} bookings yet.</p>
          <ActionButton 
            variant="primary"
            onClick={() => navigate('/vehicles')}
          >
            Find a Car
          </ActionButton>
        </EmptyState>
      ) : (
        <BookingsGrid>
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id}>
              <BookingHeader>
                <BookingId>Booking #{booking.id}</BookingId>
                <BookingStatus status={booking.status}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </BookingStatus>
              </BookingHeader>

              <CarInfo>
                <CarImage><Car size={24} /></CarImage>
                <CarDetails>
                  <CarTitle>{booking.car.title}</CarTitle>
                  <CarLocation><Location size={16} /> {booking.car.location}</CarLocation>
                </CarDetails>
              </CarInfo>

              <BookingDetails>
                <DetailItem>
                  <h4>Pickup Date</h4>
                  <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                </DetailItem>
                <DetailItem>
                  <h4>Return Date</h4>
                  <p>{new Date(booking.endDate).toLocaleDateString()}</p>
                </DetailItem>
                <DetailItem>
                  <h4>Pickup Location</h4>
                  <p>{booking.pickupLocation}</p>
                </DetailItem>
                <DetailItem>
                  <h4>Return Location</h4>
                  <p>{booking.returnLocation}</p>
                </DetailItem>
              </BookingDetails>

              <PriceInfo>
                <PriceRow>
                  <span>Total Amount</span>
                  <span>R$ {booking.totalAmount}</span>
                </PriceRow>
              </PriceInfo>

              <Actions>
                <ActionButton 
                  variant="secondary"
                  onClick={() => handleViewDetails(booking.id)}
                >
                  View Details
                </ActionButton>
                {booking.status === 'confirmed' || booking.status === 'pending' ? (
                  <ActionButton 
                    variant="danger"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </ActionButton>
                ) : null}
              </Actions>
            </BookingCard>
          ))}
        </BookingsGrid>
      )}
    </Container>
  );
};

export default BookingsPage;
