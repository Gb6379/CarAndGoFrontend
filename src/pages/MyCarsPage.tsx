import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Car, Location, Star } from '../components/IconSystem';
import { vehicleService, bookingService } from '../services/authService';
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
  ${titleCss}
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const AddCarButton = styled.button`
  ${primaryButtonCss}
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const CarCard = styled.div`
  ${glassPanelCss}
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CarImage = styled.div<{ $photoUrl?: string }>`
  height: 200px;
  background: ${props => props.$photoUrl
    ? `url(${props.$photoUrl})`
    : `linear-gradient(135deg, rgba(246, 136, 92, 0.18) 0%, rgba(139, 92, 246, 0.22) 100%)`};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: ${modernTheme.colors.brandStrong};
  position: relative;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
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
  color: ${modernTheme.colors.ink};
`;

const CarDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const CarPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${modernTheme.colors.brandStrong};
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

  @media (max-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.72);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.78);
`;

const StatNumber = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${modernTheme.colors.ink};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${modernTheme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CarActions = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: ${modernTheme.radii.pill};
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;

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
          background: rgba(255, 255, 255, 0.72);
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
            photos: Array.isArray(v.photos) ? v.photos : [],
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

  const handleViewBookings = (e: React.MouseEvent, carId: string) => {
    e.stopPropagation();
    navigate(`/vehicle/${carId}`);
  };

  const handleViewAd = (carId: string) => {
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
            <CarCard key={car.id} onClick={() => handleViewAd(car.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleViewAd(car.id)}>
              <CarImage $photoUrl={car.photos?.[0]}>
                <CarStatus status={car.status}>
                  {getStatusLabel(car.status)}
                </CarStatus>
                {!car.photos?.length && <Car size={24} />}
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
                    onClick={(e) => handleViewBookings(e, car.id)}
                  >
                    Reservas
                  </ActionButton>
                  <ActionButton 
                    variant="primary"
                    onClick={(e) => { e.stopPropagation(); handleEditCar(car.id); }}
                  >
                    Editar
                  </ActionButton>
                  <ActionButton 
                    variant="danger"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCar(car.id); }}
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
