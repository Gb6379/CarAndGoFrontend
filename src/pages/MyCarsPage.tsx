import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Car, Location, Star } from '../components/IconSystem';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin: 0;
  font-weight: 700;
`;

const AddCarButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #5a6fd8;
  }
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const CarCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CarImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  position: relative;
`;

const CarStatus = styled.div<{ status: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'available': return '#e8f5e8';
      case 'rented': return '#fff3cd';
      case 'maintenance': return '#f8d7da';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'available': return '#155724';
      case 'rented': return '#856404';
      case 'maintenance': return '#721c24';
      default: return '#495057';
    }
  }};
`;

const CarInfo = styled.div`
  padding: 1.5rem;
`;

const CarTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const CarDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CarPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
`;

const CarRating = styled.div`
  color: #ffa500;
  font-weight: 600;
`;

const CarStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Stat = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const StatNumber = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CarActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;

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

const MyCarsPage: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      navigate('/login');
      return;
    }

    // Simulate loading user cars
    setTimeout(() => {
      setCars([
        {
          id: 'CAR001',
          title: 'Toyota Corolla 2022',
          dailyRate: 150,
          status: 'available',
          rating: 4.9,
          totalBookings: 12,
          totalEarnings: 1800,
          location: 'São Paulo, SP'
        },
        {
          id: 'CAR002',
          title: 'Honda Civic 2021',
          dailyRate: 180,
          status: 'rented',
          rating: 4.8,
          totalBookings: 8,
          totalEarnings: 1440,
          location: 'Rio de Janeiro, RJ'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleEditCar = (carId: string) => {
    navigate(`/vehicle/edit/${carId}`);
  };

  const handleDeleteCar = (carId: string) => {
    if (window.confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      setCars(prev => prev.filter(car => car.id !== carId));
    }
  };

  const handleViewBookings = (carId: string) => {
    navigate(`/vehicle/${carId}/bookings`);
  };

  const handleAddCar = () => {
    navigate('/vehicle/add');
  };

  if (loading) {
    return (
      <Container>
        <Title>My Cars</Title>
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My Cars</Title>
        <AddCarButton onClick={handleAddCar}>
          + Add New Car
        </AddCarButton>
      </Header>

      {cars.length === 0 ? (
        <EmptyState>
          <h3>No cars listed yet</h3>
          <p>Start earning money by listing your car for rent.</p>
          <AddCarButton onClick={handleAddCar}>
            List Your First Car
          </AddCarButton>
        </EmptyState>
      ) : (
        <CarsGrid>
          {cars.map((car) => (
            <CarCard key={car.id}>
              <CarImage>
                <CarStatus status={car.status}>
                  {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
                </CarStatus>
                <Car size={24} />
              </CarImage>
              
              <CarInfo>
                <CarTitle>{car.title}</CarTitle>
                <CarDetails>
                  <CarPrice>R$ {car.dailyRate}/day</CarPrice>
                  <CarRating><Star size={14} /> {car.rating}</CarRating>
                </CarDetails>
                
                <CarStats>
                  <Stat>
                    <StatNumber>{car.totalBookings}</StatNumber>
                    <StatLabel>Bookings</StatLabel>
                  </Stat>
                  <Stat>
                    <StatNumber>R$ {car.totalEarnings}</StatNumber>
                    <StatLabel>Earnings</StatLabel>
                  </Stat>
                  <Stat>
                    <StatNumber><Location size={16} /></StatNumber>
                    <StatLabel>{car.location.split(',')[0]}</StatLabel>
                  </Stat>
                </CarStats>

                <CarActions>
                  <ActionButton 
                    variant="secondary"
                    onClick={() => handleViewBookings(car.id)}
                  >
                    Bookings
                  </ActionButton>
                  <ActionButton 
                    variant="primary"
                    onClick={() => handleEditCar(car.id)}
                  >
                    Edit
                  </ActionButton>
                  <ActionButton 
                    variant="danger"
                    onClick={() => handleDeleteCar(car.id)}
                  >
                    Delete
                  </ActionButton>
                </CarActions>
              </CarInfo>
            </CarCard>
          ))}
        </CarsGrid>
      )}
    </Container>
  );
};

export default MyCarsPage;
