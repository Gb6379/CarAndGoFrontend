import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Search, Car, Check, Phone, Calendar, Edit, Smartphone, Money, Shield, Lock, Star, Location, Map, ArrowRight, FlightTakeoff, BarChart } from '../components/IconSystem';
import heroBg from '../assets/one-way-car-rentals.png';
import { PlayArrow } from '@mui/icons-material';
import { vehicleService } from '../services/authService';

// Hero Section with Search - Turo Style
const HeroSection = styled.section`
  background: linear-gradient(
    135deg, 
    rgba(10, 50, 80, 0.9) 0%, 
    rgba(15, 70, 110, 0.95) 100%
  ), url(${heroBg});
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  color: white;
  padding: 3rem 2rem 2.5rem;
  min-height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${heroBg});
    background-size: cover;
    background-position: center;
    filter: blur(3px) brightness(0.4);
    opacity: 0.5;
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem 1.5rem;
  }
`;

const HeroWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeroContent = styled.div`
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 10;
  width: 100%;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  opacity: 1;
  max-width: none;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  line-height: 1.5;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.25rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 12px;
  }
`;

const SearchForm = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;

  &:not(:last-child) {
    border-right: 1px solid #e5e5e5;
  }

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 1.25rem 1.5rem;
  background: white;
  color: #333;
  transition: all 0.2s ease;
  height: 64px;
  box-sizing: border-box;
  font-weight: 400;
  width: 100%;

  &:focus {
    background: #fafafa;
  }

  &::placeholder {
    color: #999;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    height: 56px;
    padding: 1rem 1.25rem;
  }
`;

const DateTimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  position: relative;

  &:not(:last-child) {
    border-right: 1px solid #e5e5e5;
  }

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    flex-direction: column;
    
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

const DateInput = styled.input`
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 1.25rem 1.5rem;
  background: white;
  color: #333;
  transition: all 0.2s ease;
  height: 64px;
  box-sizing: border-box;
  font-weight: 400;
  flex: 1;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    background: #fafafa;
  }

  &::placeholder {
    color: #999;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    height: 56px;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e5e5e5;
  }
`;

const TimeSelect = styled.select`
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 1.25rem 1.5rem;
  background: white;
  color: #333;
  transition: all 0.2s ease;
  height: 64px;
  box-sizing: border-box;
  font-weight: 400;
  flex: 1;
  cursor: pointer;
  border-left: 1px solid #e5e5e5;
  min-width: 120px;

  &:focus {
    background: #fafafa;
  }

  @media (max-width: 768px) {
    height: 56px;
    padding: 1rem 1.25rem;
    border-left: none;
    border-bottom: 1px solid #e5e5e5;
  }
`;

const SearchButton = styled.button`
  background: #F6885CFF;
  color: white;
  border: none;
  padding: 0;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 64px;
  width: 64px;
  min-width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: #ED733AFF;
  }

  &:active {
    background: #D95128FF;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 56px;
    border-radius: 0 0 12px 12px;
  }
`;

const GetToKnowButton = styled.button`
  background: #000000;
  color: white;
  border: none;
  padding: 0.75rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

  &:hover {
    background: #1a1a1a;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
    margin-top: 1.25rem;
  }
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #1a1a1a;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.85rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 400;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2.5rem;
  border: 2px solid ${props => props.active ? '#667eea' : '#e0e0e0'};
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)'};

  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5'};
    transform: translateY(-2px);
    box-shadow: ${props => props.active ? '0 6px 16px rgba(102, 126, 234, 0.35)' : '0 4px 12px rgba(0,0,0,0.08)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StepCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.12);
    border-color: rgba(102, 126, 234, 0.15);
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const StepDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

// Featured Cars Section - Turo Style
const FeaturedSection = styled.section`
  padding: 3rem 2rem;
  background: white;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const SectionTitleWithArrow = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #8B5CF6;
  }
`;

const CarsScrollContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 1rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;

    &:hover {
      background: #555;
    }
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const CarCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.08);
  min-width: 320px;
  max-width: 320px;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border-color: rgba(0,0,0,0.12);
  }

  @media (max-width: 768px) {
    min-width: 280px;
    max-width: 280px;
  }
`;

const CarImage = styled.div`
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

const CarInfo = styled.div`
  padding: 1.25rem;
`;

const CarTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  line-height: 1.3;
`;

const CarRatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const CarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #1a1a1a;
  font-size: 0.95rem;
  font-weight: 600;
`;

const CarTrips = styled.span`
  color: #666;
  font-size: 0.85rem;
  font-weight: 400;
`;

const CarPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const CarPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
`;

const CarSave = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: #10b981;
`;

const ViewAllButton = styled.button`
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 1.125rem 2.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  display: block;
  margin: 4rem auto 0;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Trust Section
const TrustSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
`;

const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TrustCard = styled.div`
  text-align: center;
  padding: 2rem;
`;

const TrustIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const TrustTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const TrustDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

// CTA Section
const CTASection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

// Filter Bar Section
const FilterBarSection = styled.section`
  background: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  justify-content: center;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 0.5rem;
    justify-content: flex-start;
  }
`;

const FilterOption = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#e5e5e5' : 'transparent'};
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    background: ${props => props.active ? '#d5d5d5' : '#f5f5f5'};
  }

  svg {
    font-size: 1rem;
    color: #333;
  }
`;

// Cars Grid Section
const CarsGridSection = styled.section`
  padding: 2rem;
  background: white;
`;

const CTAButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 1.25rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.75rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);

  &:hover {
    background: #f8f9fa;
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.25);
    color: #5568d3;
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    margin: 0.5rem;
    padding: 1rem 2.5rem;
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    fromDate: '',
    fromTime: '10:00',
    untilDate: '',
    untilTime: '10:00'
  });
  const [activeTab, setActiveTab] = useState('rent');
  const [activeFilter, setActiveFilter] = useState('all');
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);

  const handleSearch = () => {
    // Navigate to vehicles page with search parameters
    const params = new URLSearchParams({
      location: searchData.location,
      from: searchData.fromDate,
      until: searchData.untilDate
    });
    navigate(`/vehicles?${params.toString()}`);
  };

  const filterOptions = [
    { id: 'all', label: 'Todos', icon: <Car size={16} /> },
    { id: 'airports', label: 'Aeroportos', icon: <FlightTakeoff size={16} /> },
    { id: 'monthly', label: 'Mensal', icon: <Calendar size={16} /> },
    { id: 'nearby', label: 'Próximo', icon: <Location size={16} /> },
    { id: 'delivered', label: 'Entregue', icon: <ArrowRight size={16} /> },
    { id: 'cities', label: 'Cidades', icon: <BarChart size={16} /> },
  ];

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    // You can add additional logic here to filter cars based on the selected filter
  };

  useEffect(() => {
    const loadFeaturedCars = async () => {
      try {
        setLoadingCars(true);
        const vehicles = await vehicleService.getAllVehicles();
        
        // Take first 6 vehicles and format them for display
        const formattedCars = vehicles.slice(0, 6).map((vehicle: any, index: number) => ({
          id: vehicle.id,
          title: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
          price: Math.round(vehicle.dailyRate * 3).toString(),
          days: 3,
          rating: vehicle.rating?.toFixed(2) || '4.9',
          trips: vehicle.totalBookings || 0,
          save: index < 3 ? Math.floor(Math.random() * 5) + 2 : null,
          location: `${vehicle.city}, ${vehicle.state}`,
          dailyRate: vehicle.dailyRate
        }));
        
        setFeaturedCars(formattedCars);
      } catch (error) {
        console.error('Error loading featured cars:', error);
        // Fallback to mock data if API fails
        setFeaturedCars([
          {
            id: '1',
            title: 'Toyota Corolla 2022',
            price: '133',
            days: 3,
            rating: '5.0',
            trips: 21,
            save: 3,
            location: 'São Paulo, SP'
          },
          {
            id: '2',
            title: 'Honda Civic 2021',
            price: '149',
            days: 3,
            rating: '5.0',
            trips: 24,
            save: 4,
            location: 'Rio de Janeiro, RJ'
          },
          {
            id: '3',
            title: 'Volkswagen Golf 2020',
            price: '126',
            days: 3,
            rating: '4.99',
            trips: 189,
            save: null,
            location: 'Belo Horizonte, MG'
          },
          {
            id: '4',
            title: 'BMW 320i 2021',
            price: '280',
            days: 3,
            rating: '4.9',
            trips: 45,
            save: 5,
            location: 'São Paulo, SP'
          },
          {
            id: '5',
            title: 'Audi A3 2020',
            price: '250',
            days: 3,
            rating: '4.8',
            trips: 32,
            save: null,
            location: 'Rio de Janeiro, RJ'
          },
          {
            id: '6',
            title: 'Fiat Argo 2021',
            price: '100',
            days: 3,
            rating: '4.9',
            trips: 67,
            save: 2,
            location: 'Brasília, DF'
          }
        ]);
      } finally {
        setLoadingCars(false);
      }
    };

    loadFeaturedCars();
  }, []);

  const renterSteps = [
    {
      icon: <Search size={24} />,
      title: 'Busque e Escolha',
      description: 'Encontre o carro perfeito na sua região em nossa ampla seleção de veículos.'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Reserve e Pague',
      description: 'Reserve seu carro com pagamento seguro. Receba confirmação instantânea.'
    },
    {
      icon: <Car size={24} />,
      title: 'Retire e Dirija',
      description: 'Encontre seu anfitrião, pegue as chaves e comece sua aventura.'
    }
  ];

  const ownerSteps = [
    {
      icon: <Edit size={24} />,
      title: 'Anuncie Seu Carro',
      description: 'Adicione detalhes do seu carro, fotos e defina seus preços.'
    },
    {
      icon: <Smartphone size={24} />,
      title: 'Receba Reservas',
      description: 'Receba solicitações de reserva e comunique-se com hóspedes.'
    },
    {
      icon: <Money size={24} />,
      title: 'Ganhe Dinheiro',
      description: 'Ganhe dinheiro quando seu carro não estiver em uso. Fique com 70% dos ganhos.'
    }
  ];


  const trustFeatures = [
    {
      icon: <Shield size={24} />,
      title: 'Totalmente Segurado',
      description: 'Todas as viagens são cobertas por seguro abrangente'
    },
    {
      icon: <Check size={24} />,
      title: 'Anfitriões Verificados',
      description: 'Cada anfitrião é verificado com RG'
    },
    {
      icon: <Phone size={24} />,
      title: 'Suporte 24/7',
      description: 'Equipe de suporte ao cliente 24 horas por dia'
    },
    {
      icon: <Lock size={24} />,
      title: 'Pagamentos Seguros',
      description: 'Processamento de pagamento seguro e protegido'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <HeroWrapper>
          <HeroContent>
            <HeroTitle>Encontre o carro perfeito para você</HeroTitle>
            <HeroSubtitle>
              Alugue praticamente qualquer carro, praticamente em qualquer lugar
            </HeroSubtitle>
            <SearchContainer>
            <SearchForm>
              <SearchField>
                <SearchInput
                  type="text"
                  placeholder="City, airport, address or hotel"
                  value={searchData.location}
                  onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                />
              </SearchField>
              
              <DateTimeContainer>
                <DateInput
                  type="date"
                  placeholder="Add dates"
                  value={searchData.fromDate}
                  onChange={(e) => setSearchData(prev => ({ ...prev, fromDate: e.target.value }))}
                />
                <TimeSelect
                  value={searchData.fromTime}
                  onChange={(e) => setSearchData(prev => ({ ...prev, fromTime: e.target.value }))}
                >
                  <option value="00:00">12:00 AM</option>
                  <option value="01:00">1:00 AM</option>
                  <option value="02:00">2:00 AM</option>
                  <option value="03:00">3:00 AM</option>
                  <option value="04:00">4:00 AM</option>
                  <option value="05:00">5:00 AM</option>
                  <option value="06:00">6:00 AM</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                  <option value="23:00">11:00 PM</option>
                </TimeSelect>
              </DateTimeContainer>
              
              <DateTimeContainer>
                <DateInput
                  type="date"
                  placeholder="Add dates"
                  value={searchData.untilDate}
                  onChange={(e) => setSearchData(prev => ({ ...prev, untilDate: e.target.value }))}
                />
                <TimeSelect
                  value={searchData.untilTime}
                  onChange={(e) => setSearchData(prev => ({ ...prev, untilTime: e.target.value }))}
                >
                  <option value="00:00">12:00 AM</option>
                  <option value="01:00">1:00 AM</option>
                  <option value="02:00">2:00 AM</option>
                  <option value="03:00">3:00 AM</option>
                  <option value="04:00">4:00 AM</option>
                  <option value="05:00">5:00 AM</option>
                  <option value="06:00">6:00 AM</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="08:00">8:00 AM</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                  <option value="23:00">11:00 PM</option>
                </TimeSelect>
              </DateTimeContainer>
              
              <SearchButton onClick={handleSearch}>
                <Search size={24} color="white" />
              </SearchButton>
            </SearchForm>
            </SearchContainer>
            
            <GetToKnowButton onClick={() => navigate('/how-it-works')}>
              <PlayArrow style={{ fontSize: '20px' }} />
              Conheça o CarAndGo
            </GetToKnowButton>
          </HeroContent>
        </HeroWrapper>
      </HeroSection>

      {/* Filter Bar Section */}
      <FilterBarSection>
        <FilterBar>
          {filterOptions.map((option) => (
            <FilterOption
              key={option.id}
              active={activeFilter === option.id}
              onClick={() => handleFilterChange(option.id)}
            >
              {option.icon}
              {option.label}
            </FilterOption>
          ))}
        </FilterBar>
      </FilterBarSection>

      {/* Featured Cars */}
      <FeaturedSection>
        <SectionHeader>
          <SectionTitleWithArrow onClick={() => navigate('/vehicles')}>
            Carros em destaque perto de você
            <ArrowRight size={20} />
          </SectionTitleWithArrow>
        </SectionHeader>
        
        <CarsScrollContainer>
          {featuredCars.map((car) => (
            <CarCard key={car.id} onClick={() => navigate(`/vehicle/${car.id}`)}>
              <CarImage>
                <Car size={48} />
              </CarImage>
              <CarInfo>
                <CarTitle>{car.title}</CarTitle>
                <CarRatingRow>
                  <CarRating>
                    <Star size={16} color="#8B5CF6" />
                    {car.rating}
                  </CarRating>
                  <CarTrips>({car.trips} viagens)</CarTrips>
                </CarRatingRow>
                <CarPriceRow>
                  <CarPrice>R$ {car.price} por {car.days} dias</CarPrice>
                  {car.save && <CarSave>Economize R$ {car.save}</CarSave>}
                </CarPriceRow>
              </CarInfo>
            </CarCard>
          ))}
        </CarsScrollContainer>
      </FeaturedSection>

      {/* How It Works */}
      <HowItWorksSection>
        <SectionTitle>Como funciona</SectionTitle>
        <SectionSubtitle>
          Seja para alugar um carro ou compartilhar o seu, tornamos tudo simples
        </SectionSubtitle>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'rent'} 
            onClick={() => setActiveTab('rent')}
          >
            Para Hóspedes
          </Tab>
          <Tab 
            active={activeTab === 'host'} 
            onClick={() => setActiveTab('host')}
          >
            Para Anfitriões
          </Tab>
        </TabsContainer>

        <StepsGrid>
          {(activeTab === 'rent' ? renterSteps : ownerSteps).map((step, index) => (
            <StepCard key={index}>
              <StepNumber>{index + 1}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </StepsGrid>
      </HowItWorksSection>

      {/* Trust Section */}
      <TrustSection>
        <SectionTitle>Por que escolher CAR AND GO?</SectionTitle>
        <SectionSubtitle>
          Estamos comprometidos em fornecer uma experiência segura, confiável e segura de compartilhamento de carros
        </SectionSubtitle>
        
        <TrustGrid>
          {trustFeatures.map((feature, index) => (
            <TrustCard key={index}>
              <TrustIcon>{feature.icon}</TrustIcon>
              <TrustTitle>{feature.title}</TrustTitle>
              <TrustDescription>{feature.description}</TrustDescription>
            </TrustCard>
          ))}
        </TrustGrid>
      </TrustSection>

      {/* CTA Section */}
      <CTASection>
        <SectionTitle style={{ color: 'white', marginBottom: '2rem' }}>
          Pronto para começar?
        </SectionTitle>
        <SectionSubtitle style={{ color: 'white', marginBottom: '3rem' }}>
          Junte-se a milhares de clientes satisfeitos em todo o Brasil
        </SectionSubtitle>
        <div>
          <CTAButton onClick={() => navigate('/vehicles')}>
            Encontrar um Carro
          </CTAButton>
          <CTAButton onClick={() => navigate('/register')}>
            Anunciar Seu Carro
          </CTAButton>
        </div>
      </CTASection>
    </>
  );
};

export default HomePage;