import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Car, Location } from '../components/IconSystem';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 700;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  border: none;
  background: none;
  color: ${props => props.active ? '#667eea' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#667eea' : 'transparent'};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    color: #667eea;
  }
`;

const BookingsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
`;

const BookingId = styled.div`
  font-size: 0.9rem;
  color: #666;
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
`;

const CarImage = styled.div`
  width: 100px;
  height: 70px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`;

const CarDetails = styled.div`
  flex: 1;
`;

const CarTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const CarLocation = styled.p`
  color: #666;
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
    color: #666;
    margin: 0 0 0.25rem 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  p {
    font-size: 1rem;
    color: #333;
    margin: 0;
    font-weight: 500;
  }
`;

const PriceInfo = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
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
    color: #333;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  ${props => {
    switch(props.variant) {
      case 'primary':
        return `
          background: #667eea;
          color: white;
          &:hover { background: #5a6fd8; }
        `;
      case 'danger':
        return `
          background: #e74c3c;
          color: white;
          &:hover { background: #c0392b; }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #333;
          border: 1px solid #ddd;
          &:hover { background: #e9ecef; }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    margin-bottom: 2rem;
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
