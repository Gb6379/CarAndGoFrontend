import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Car, Location, Star } from '../components/IconSystem';
import { vehicleService, bookingService } from '../services/authService';

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

    const loadCars = async () => {
      try {
        const [allVehicles, allBookings] = await Promise.all([
          vehicleService.getAllVehicles(),
          bookingService.getBookings().catch(() => []),
        ]);
        const list = Array.isArray(allVehicles) ? allVehicles : [];
        const bookings = Array.isArray(allBookings) ? allBookings : [];
        const myVehicles = list.filter(
          (v: any) => v.ownerId === user.id || v.owner?.id === user.id
        );
        // Calcular reservas e ganhos por veículo a partir das reservas reais
        const bookingsByVehicle: Record<string, { count: number; earnings: number }> = {};
        for (const b of bookings) {
          const vehicleId = b.vehicleId || b.vehicle?.id;
          if (!vehicleId) continue;
          if (!bookingsByVehicle[vehicleId]) {
            bookingsByVehicle[vehicleId] = { count: 0, earnings: 0 };
          }
          bookingsByVehicle[vehicleId].count += 1;
          const amount = typeof b.lessorAmount === 'number' ? b.lessorAmount : parseFloat(b.lessorAmount) || 0;
          bookingsByVehicle[vehicleId].earnings += amount;
        }
        const mapped = myVehicles.map((v: any) => {
          const stats = bookingsByVehicle[v.id] || { count: 0, earnings: 0 };
          return {
            id: v.id,
            title: [v.make, v.model, v.year].filter(Boolean).join(' ') || 'Veículo',
            dailyRate: Number(v.dailyRate) || 0,
            status: v.status || 'available',
            rating: v.rating != null ? Number(v.rating) : 0,
            totalBookings: stats.count,
            totalEarnings: stats.earnings,
            location: [v.city, v.state].filter(Boolean).join(', ') || '—',
          };
        });
        setCars(mapped);
      } catch (err) {
        console.error('Erro ao carregar veículos:', err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [navigate]);

  const handleEditCar = (carId: string) => {
    navigate(`/list-vehicle/edit/${carId}`);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Disponível',
      rented: 'Alugado',
      maintenance: 'Manutenção',
      active: 'Ativo',
    };
    return labels[status?.toLowerCase()] || status;
  };

  const handleDeleteCar = (carId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.')) {
      setCars(prev => prev.filter(car => car.id !== carId));
    }
  };

  const handleViewBookings = (carId: string) => {
    navigate(`/vehicle/${carId}`);
  };

  const handleAddCar = () => {
    navigate('/list-vehicle');
  };

  if (loading) {
    return (
      <Container>
        <Title>Meus Veículos</Title>
        <p>Carregando...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Meus Veículos</Title>
        <AddCarButton onClick={handleAddCar}>
          + Anunciar veículo
        </AddCarButton>
      </Header>

      {cars.length === 0 ? (
        <EmptyState>
          <h3>Nenhum veículo anunciado</h3>
          <p>Comece a ganhar dinheiro anunciando seu carro para locação.</p>
          <AddCarButton onClick={handleAddCar}>
            Anunciar seu primeiro veículo
          </AddCarButton>
        </EmptyState>
      ) : (
        <CarsGrid>
          {cars.map((car) => (
            <CarCard key={car.id}>
              <CarImage>
                <CarStatus status={car.status}>
                  {getStatusLabel(car.status)}
                </CarStatus>
                <Car size={24} />
              </CarImage>
              
              <CarInfo>
                <CarTitle>{car.title}</CarTitle>
                <CarDetails>
                  <CarPrice>R$ {car.dailyRate}/dia</CarPrice>
                  <CarRating><Star size={14} /> {car.rating}</CarRating>
                </CarDetails>
                
                <CarStats>
                  <Stat>
                    <StatNumber>{car.totalBookings}</StatNumber>
                    <StatLabel>Reservas</StatLabel>
                  </Stat>
                  <Stat>
                    <StatNumber>R$ {car.totalEarnings}</StatNumber>
                    <StatLabel>Ganhos</StatLabel>
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
                    Reservas
                  </ActionButton>
                  <ActionButton 
                    variant="primary"
                    onClick={() => handleEditCar(car.id)}
                  >
                    Editar
                  </ActionButton>
                  <ActionButton 
                    variant="danger"
                    onClick={() => handleDeleteCar(car.id)}
                  >
                    Excluir
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
