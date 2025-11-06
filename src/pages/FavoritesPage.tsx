import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Car, Star, Location, Search } from '../components/IconSystem';
import { vehicleService } from '../services/authService';
import { getFavorites } from '../utils/favorites';

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

const CarIllustration = styled.div`
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

const FindFavoritesButton = styled.button`
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

const VehiclesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const VehicleCard = styled.div`
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

const VehicleImage = styled.div`
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

const VehicleInfo = styled.div`
  padding: 1.25rem;
`;

const VehicleTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  line-height: 1.3;
`;

const VehicleRatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const VehicleRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #1a1a1a;
  font-size: 0.95rem;
  font-weight: 600;
`;

const VehicleTrips = styled.span`
  color: #666;
  font-size: 0.85rem;
  font-weight: 400;
`;

const VehiclePriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const VehiclePrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
`;

const VehicleLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favoriteVehicles, setFavoriteVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = `${userData.firstName || 'Usuário'} ${userData.lastName || ''}`.trim() || 'Usuário';

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteIds = getFavorites();
      
      if (favoriteIds.length === 0) {
        setFavoriteVehicles([]);
        setLoading(false);
        return;
      }

      // Fetch vehicle details for each favorite ID
      const vehiclesPromises = favoriteIds.map((id: string) => 
        vehicleService.getVehicle(id).catch(() => null)
      );
      
      const vehicles = await Promise.all(vehiclesPromises);
      const validVehicles = vehicles.filter(v => v !== null);
      
      setFavoriteVehicles(validVehicles);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavoriteVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <PageTitle>{userName}'s favoritos</PageTitle>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Carregando favoritos...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>{userName}'s favoritos</PageTitle>

      {favoriteVehicles.length === 0 ? (
        <EmptyStateContainer>
          <CarIllustration>
            <Car size={120} />
          </CarIllustration>
          <EmptyStateTitle>Comece com Favoritos</EmptyStateTitle>
          <EmptyStateText>
            Toque no ícone de coração para salvar seus veículos favoritos em uma lista
          </EmptyStateText>
          <FindFavoritesButton onClick={() => navigate('/vehicles')}>
            <Search size={18} />
            Encontrar novos favoritos
          </FindFavoritesButton>
        </EmptyStateContainer>
      ) : (
        <VehiclesGrid>
          {favoriteVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} onClick={() => navigate(`/vehicle/${vehicle.id}`)}>
              <VehicleImage>
                <Car size={48} />
              </VehicleImage>
              <VehicleInfo>
                <VehicleTitle>{vehicle.make} {vehicle.model} {vehicle.year}</VehicleTitle>
                <VehicleRatingRow>
                  <VehicleRating>
                    <Star size={16} color="#8B5CF6" />
                    {vehicle.rating?.toFixed(2) || '4.9'}
                  </VehicleRating>
                  <VehicleTrips>({vehicle.totalBookings || 0} viagens)</VehicleTrips>
                </VehicleRatingRow>
                <VehiclePriceRow>
                  <VehiclePrice>R$ {Math.round(vehicle.dailyRate * 3)} por 3 dias</VehiclePrice>
                </VehiclePriceRow>
                <VehicleLocation>
                  <Location size={14} />
                  {vehicle.city}, {vehicle.state}
                </VehicleLocation>
              </VehicleInfo>
            </VehicleCard>
          ))}
        </VehiclesGrid>
      )}
    </Container>
  );
};

export default FavoritesPage;

