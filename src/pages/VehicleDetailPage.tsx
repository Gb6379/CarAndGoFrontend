import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { vehicleService } from '../services/authService';
import { Electric, Car, LocationOn, Star, CheckCircle, Phone, Map, Lock, Shield, Usb, Bluetooth, AirConditioning } from '../components/IconSystem';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;

  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const VehicleTitle = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const VehicleSubtitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #666;
  font-size: 1.1rem;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffa500;
  font-weight: 600;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Photo Gallery
const PhotoGallery = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const MainPhoto = styled.div`
  height: 400px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  position: relative;
  cursor: pointer;
`;

const PhotoThumbnails = styled.div`
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  overflow-x: auto;
`;

const Thumbnail = styled.div<{ active?: boolean }>`
  width: 80px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#667eea' : 'transparent'};
  opacity: ${props => props.active ? 1 : 0.7};
  transition: all 0.3s;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

// Vehicle Info Section
const VehicleInfoSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
`;

// Features Section
const FeaturesSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const FeatureIcon = styled.span`
  font-size: 1.5rem;
`;

const FeatureText = styled.span`
  color: #333;
  font-weight: 500;
`;

// Booking Section
const BookingSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 2rem;
`;

const PriceDisplay = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DailyPrice = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
`;

const PriceUnit = styled.span`
  color: #666;
  font-size: 1rem;
`;

const TotalPrice = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
`;

const TotalLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const TotalAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
`;

const BookingButton = styled.button`
  width: 100%;
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

// Host Section
const HostSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const HostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const HostAvatar = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
`;

const HostDetails = styled.div`
  flex: 1;
`;

const HostName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const HostStats = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const HostBadge = styled.div`
  background: #4CAF50;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

// Reviews Section
const ReviewsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const ReviewItem = styled.div`
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ReviewInfo = styled.div`
  flex: 1;
`;

const ReviewerName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const ReviewDate = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffa500;
`;

const ReviewText = styled.div`
  color: #333;
  line-height: 1.6;
`;

// Safety Section
const SafetySection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const SafetyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const SafetyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const SafetyIcon = styled.span`
  color: #4CAF50;
  font-size: 1.5rem;
`;

const SafetyText = styled.span`
  color: #333;
  font-weight: 500;
`;

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [selectedDates, setSelectedDates] = useState({
    startDate: '',
    endDate: ''
  });

  // Parse URL parameters for dates
  const searchParams = new URLSearchParams(location.search);
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  useEffect(() => {
    if (id) {
      loadVehicle(id);
    }
  }, [id]);

  useEffect(() => {
    setSelectedDates({
      startDate,
      endDate
    });
  }, [startDate, endDate]);

  const loadVehicle = async (vehicleId: string) => {
    try {
      setLoading(true);
      setError(null);
      const vehicleData = await vehicleService.getVehicle(vehicleId);
      setVehicle(vehicleData);
    } catch (error) {
      console.error('Error loading vehicle:', error);
      setError('Falha ao carregar detalhes do veículo.');
      // Fallback to mock data
      setVehicle({
        id: vehicleId,
        make: 'Ford',
        model: 'Mustang Mach-E',
        year: 2023,
        type: 'SUV',
        fuelType: 'ELECTRIC',
        dailyRate: 286,
        rating: 5.0,
        totalBookings: 3,
        city: 'São Paulo',
        state: 'SP',
        address: 'Av. Paulista, 1000',
        latitude: -23.5613,
        longitude: -46.6565,
        seats: 5,
        transmission: 'Automatic',
        color: 'Blue',
        mileage: 15000,
        engineCapacity: 0,
        airConditioning: true,
        gps: true,
        bluetooth: true,
        usbCharger: true,
        photos: [],
        owner: {
          firstName: 'Carlos',
          lastName: 'Silva',
          rating: 4.9,
          totalTrips: 25
        },
        reviews: [
          {
            id: '1',
            reviewerName: 'Ana Costa',
            rating: 5,
            date: '2024-09-15',
            text: 'Excelente carro! Muito confortável e econômico. O Carlos foi muito atencioso.'
          },
          {
            id: '2',
            reviewerName: 'Pedro Santos',
            rating: 5,
            date: '2024-09-10',
            text: 'Carro em perfeito estado, entrega pontual. Recomendo!'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    // Navigate to booking page with vehicle and date info
    const params = new URLSearchParams({
      vehicleId: id || '',
      startDate: selectedDates.startDate,
      endDate: selectedDates.endDate
    });
    navigate(`/booking?${params.toString()}`);
  };

  const getVehicleImage = (index: number) => {
    if (vehicle?.photos && vehicle.photos[index]) {
      return vehicle.photos[index];
    }
    return vehicle?.fuelType === 'ELECTRIC' ? <Electric size={20} /> : <Car size={20} />;
  };

  const calculateTotalPrice = () => {
    if (!selectedDates.startDate || !selectedDates.endDate || !vehicle) return 0;
    
    const start = new Date(selectedDates.startDate);
    const end = new Date(selectedDates.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return days * vehicle.dailyRate;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>
          Carregando detalhes do veículo...
        </div>
      </Container>
    );
  }

  if (error || !vehicle) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Veículo Não Encontrado</h2>
          <p>{error || 'O veículo que você está procurando não existe.'}</p>
          <button 
            onClick={() => navigate('/vehicles')}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Navegar por Outros Veículos
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <Breadcrumb>
          <a href="/vehicles">Carros</a>
          <span>›</span>
          <span>{vehicle.city}, {vehicle.state}</span>
          <span>›</span>
          <span>{vehicle.make} {vehicle.model}</span>
        </Breadcrumb>
        
        <VehicleTitle>{vehicle.make} {vehicle.model} {vehicle.year}</VehicleTitle>
        
        <VehicleSubtitle>
          <RatingSection>
            <Star size={16} /> {vehicle.rating} ({vehicle.totalBookings} trips)
          </RatingSection>
          <span><LocationOn size={16} /> {vehicle.address}</span>
        </VehicleSubtitle>
      </Header>

      <MainContent>
        <LeftColumn>
          {/* Photo Gallery */}
          <PhotoGallery>
            <MainPhoto>
              {getVehicleImage(selectedPhoto)}
            </MainPhoto>
            <PhotoThumbnails>
              {[0, 1, 2, 3, 4].map((index) => (
                <Thumbnail
                  key={index}
                  active={selectedPhoto === index}
                  onClick={() => setSelectedPhoto(index)}
                >
                  {getVehicleImage(index)}
                </Thumbnail>
              ))}
            </PhotoThumbnails>
          </PhotoGallery>

          {/* Vehicle Information */}
          <VehicleInfoSection>
            <SectionTitle>Detalhes do Veículo</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Ano</InfoLabel>
                <InfoValue>{vehicle.year}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Tipo</InfoLabel>
                <InfoValue>{vehicle.type}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Tipo de Combustível</InfoLabel>
                <InfoValue>{vehicle.fuelType}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Transmissão</InfoLabel>
                <InfoValue>{vehicle.transmission || 'Automatic'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Assentos</InfoLabel>
                <InfoValue>{vehicle.seats}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Cor</InfoLabel>
                <InfoValue>{vehicle.color || 'Blue'}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Quilometragem</InfoLabel>
                <InfoValue>{vehicle.mileage?.toLocaleString()} km</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Localização</InfoLabel>
                <InfoValue>{vehicle.city}, {vehicle.state}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </VehicleInfoSection>

          {/* Features */}
          <FeaturesSection>
            <SectionTitle>Recursos e Comodidades</SectionTitle>
            <FeaturesGrid>
              <FeatureItem>
                <FeatureIcon><AirConditioning size={20} /></FeatureIcon>
                <FeatureText>Ar Condicionado</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon><Bluetooth size={20} /></FeatureIcon>
                <FeatureText>Bluetooth</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon><Usb size={20} /></FeatureIcon>
                <FeatureText>USB Charger</FeatureText>
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon><Map size={20} /></FeatureIcon>
                <FeatureText>Navegação GPS</FeatureText>
              </FeatureItem>
              {vehicle.fuelType === 'ELECTRIC' && (
                <FeatureItem>
                  <FeatureIcon><Electric size={20} /></FeatureIcon>
                  <FeatureText>Veículo Elétrico</FeatureText>
                </FeatureItem>
              )}
            </FeaturesGrid>
          </FeaturesSection>

          {/* Reviews */}
          <ReviewsSection>
            <SectionTitle>Avaliações ({vehicle.reviews?.length || 0})</SectionTitle>
            {vehicle.reviews?.map((review: any) => (
              <ReviewItem key={review.id}>
                <ReviewHeader>
                  <ReviewInfo>
                    <ReviewerName>{review.reviewerName}</ReviewerName>
                    <ReviewDate>{new Date(review.date).toLocaleDateString()}</ReviewDate>
                  </ReviewInfo>
                  <ReviewRating>
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} />)}
                  </ReviewRating>
                </ReviewHeader>
                <ReviewText>{review.text}</ReviewText>
              </ReviewItem>
            ))}
          </ReviewsSection>

          {/* Safety */}
          <SafetySection>
            <SectionTitle>Segurança e Confiança</SectionTitle>
            <SafetyGrid>
              <SafetyItem>
                <SafetyIcon><CheckCircle size={18} /></SafetyIcon>
                <SafetyText>Proprietário Verificado</SafetyText>
              </SafetyItem>
              <SafetyItem>
                <SafetyIcon><Lock size={18} /></SafetyIcon>
                <SafetyText>Pagamento Seguro</SafetyText>
              </SafetyItem>
              <SafetyItem>
                <SafetyIcon><Shield size={18} /></SafetyIcon>
                <SafetyText>Cobertura de Seguro</SafetyText>
              </SafetyItem>
              <SafetyItem>
                <SafetyIcon><Phone size={18} /></SafetyIcon>
                <SafetyText>Suporte 24/7</SafetyText>
              </SafetyItem>
            </SafetyGrid>
          </SafetySection>
        </LeftColumn>

        <RightColumn>
          {/* Booking Section */}
          <BookingSection>
            <PriceDisplay>
              <DailyPrice>R$ {vehicle.dailyRate}</DailyPrice>
              <PriceUnit>por dia</PriceUnit>
            </PriceDisplay>

            {selectedDates.startDate && selectedDates.endDate && (
              <TotalPrice>
                <TotalLabel>Total para sua viagem</TotalLabel>
                <TotalAmount>R$ {calculateTotalPrice()}</TotalAmount>
              </TotalPrice>
            )}

            <BookingButton onClick={handleBooking}>
              Continuar para Reservar
            </BookingButton>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '1rem', 
              fontSize: '0.9rem', 
              color: '#666' 
            }}>
              Cancelamento gratuito disponível
            </div>
          </BookingSection>

          {/* Host Section */}
          <HostSection>
            <SectionTitle>Conheça seu anfitrião</SectionTitle>
            <HostInfo>
              <HostAvatar>
                {getInitials(vehicle.owner.firstName, vehicle.owner.lastName)}
              </HostAvatar>
              <HostDetails>
                <HostName>{vehicle.owner.firstName} {vehicle.owner.lastName}</HostName>
                <HostStats>
                  <Star size={14} /> {vehicle.owner.rating} • {vehicle.owner.totalTrips} viagens hospedadas
                </HostStats>
              </HostDetails>
              <HostBadge>Anfitrião Estrela</HostBadge>
            </HostInfo>
            
            <div style={{ 
              color: '#666', 
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}>
              Anfitrião experiente com excelentes avaliações. Sempre disponível para ajudar com as necessidades da sua viagem.
            </div>
          </HostSection>
        </RightColumn>
      </MainContent>
    </Container>
  );
};

export default VehicleDetailPage;