import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Search, Car, Check, Phone, Calendar, Edit, Smartphone, Money, Shield, Lock, Star, Location, Map, ArrowRight, FlightTakeoff, BarChart } from '../components/IconSystem';
import heroBg from '../assets/one-way-car-rentals.png';

// Hero Section with Search
const HeroSection = styled.section`
  background: linear-gradient(
    135deg, 
    rgba(0, 0, 0, 0.4) 0%, 
    rgba(0, 0, 0, 0.6) 100%
  ), url(${heroBg});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  padding: 4rem 2rem 2rem;
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 10;
  width: 100%;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const SearchForm = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const SearchField = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchLabel = styled.label`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const SearchInput = styled.input`
  border: 2px solid #e9ecef;
  outline: none;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: white;
  color: #333;
  transition: border-color 0.3s;
  height: 56px;
  box-sizing: border-box;

  &:focus {
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }
`;

const DateInput = styled.input`
  border: 2px solid #e9ecef;
  outline: none;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: white;
  color: #333;
  transition: border-color 0.3s;
  height: 56px;
  box-sizing: border-box;

  &:focus {
    border-color: #667eea;
  }
`;

const AgeSelect = styled.select`
  border: 2px solid #e9ecef;
  outline: none;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: white;
  color: #333;
  transition: border-color 0.3s;
  height: 56px;
  box-sizing: border-box;

  &:focus {
    border-color: #667eea;
  }
`;

const SearchButton = styled.button`
  background: #FF5A5F;
  color: white;
  border: none;
  padding: 0;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  height: 56px;
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;

  &:hover {
    background: #FF4449;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 90, 95, 0.3);
  }
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  border: 2px solid ${props => props.active ? '#667eea' : '#ddd'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? '#667eea' : '#f8f9fa'};
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
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
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

// Featured Cars Section
const FeaturedSection = styled.section`
  padding: 6rem 2rem;
  background: white;
`;

const CarsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CarCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const CarImage = styled.div`
  height: 180px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #666;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  }

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
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
  line-height: 1.3;
`;

const CarDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const CarPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const CarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
`;

const ViewAllButton = styled.button`
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: block;
  margin: 3rem auto 0;

  &:hover {
    background: #667eea;
    color: white;
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

// Filter Bar Section (now inside hero)

const FilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  justify-content: flex-start;
  border-top: 1px solid #e5e5e5;
  padding-top: 1rem;

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
  border-radius: 25px;
  background: ${props => props.active ? '#f0f0f0' : 'transparent'};
  color: ${props => props.active ? '#333' : '#666'};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    background: ${props => props.active ? '#e0e0e0' : '#f5f5f5'};
    color: ${props => props.active ? '#333' : '#333'};
  }

  svg {
    font-size: 1rem;
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
  padding: 1.2rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  margin: 0 1rem;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    fromDate: '',
    untilDate: ''
  });
  const [activeTab, setActiveTab] = useState('rent');
  const [activeFilter, setActiveFilter] = useState('all');

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

  const featuredCars = [
    {
      id: 1,
      title: 'Toyota Corolla 2022',
      price: '150',
      rating: '4.9',
      location: 'São Paulo, SP',
      features: ['Automatic', 'A/C', 'Bluetooth']
    },
    {
      id: 2,
      title: 'Honda Civic 2021',
      price: '180',
      rating: '4.8',
      location: 'Rio de Janeiro, RJ',
      features: ['Automatic', 'A/C', 'GPS']
    },
    {
      id: 3,
      title: 'Volkswagen Golf 2020',
      price: '120',
      rating: '4.7',
      location: 'Belo Horizonte, MG',
      features: ['Manual', 'A/C', 'Bluetooth']
    },
    {
      id: 4,
      title: 'BMW 320i 2021',
      price: '280',
      rating: '4.9',
      location: 'São Paulo, SP',
      features: ['Automatic', 'A/C', 'Premium']
    },
    {
      id: 5,
      title: 'Audi A3 2020',
      price: '250',
      rating: '4.8',
      location: 'Rio de Janeiro, RJ',
      features: ['Automatic', 'A/C', 'Sunroof']
    },
    {
      id: 6,
      title: 'Fiat Argo 2021',
      price: '100',
      rating: '4.6',
      location: 'Brasília, DF',
      features: ['Manual', 'A/C', 'Economy']
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
        <HeroContent>
          <HeroTitle>Encontre o carro perfeito para você</HeroTitle>
          <HeroSubtitle>
            Alugue carros únicos de anfitriões locais, ou compartilhe seu carro e ganhe dinheiro. 
            A maneira mais fácil de se locomover pelo Brasil.
          </HeroSubtitle>
          <SearchContainer>
            <SearchForm>
              <SearchField>
                <SearchLabel>Onde</SearchLabel>
                <SearchInput
                  type="text"
                  placeholder="Digite cidade, endereço ou ponto de referência"
                  value={searchData.location}
                  onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                />
              </SearchField>
              
              <SearchField>
                <SearchLabel>De</SearchLabel>
                <DateInput
                  type="datetime-local"
                  value={searchData.fromDate}
                  onChange={(e) => setSearchData(prev => ({ ...prev, fromDate: e.target.value }))}
                />
              </SearchField>
              
              <SearchField>
                <SearchLabel>Até</SearchLabel>
                <DateInput
                  type="datetime-local"
                  value={searchData.untilDate}
                  onChange={(e) => setSearchData(prev => ({ ...prev, untilDate: e.target.value }))}
                />
              </SearchField>
              
              <SearchButton onClick={handleSearch}>
                <Search size={24} />
              </SearchButton>
            </SearchForm>
            
            {/* Filter Bar */}
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
          </SearchContainer>
        </HeroContent>
      </HeroSection>

      {/* Featured Cars */}
      <FeaturedSection>
        <SectionTitle>Carros em destaque perto de você</SectionTitle>
        <SectionSubtitle>
          Descubra carros incríveis disponíveis para aluguel na sua região
        </SectionSubtitle>
        
        <CarsGrid>
          {featuredCars.map((car) => (
            <CarCard key={car.id} onClick={() => navigate('/vehicles')}>
              <CarImage><Car size={32} /></CarImage>
              <CarInfo>
                <CarTitle>{car.title}</CarTitle>
                <CarDetails>
                  <CarPrice>R$ {car.price}/day</CarPrice>
                  <CarRating><Star size={14} /> {car.rating}</CarRating>
                </CarDetails>
                <p style={{ color: '#666', margin: '0 0 0.75rem 0', fontSize: '0.85rem' }}>
                  <Location size={14} /> {car.location}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {car.features.slice(0, 3).map((feature, index) => (
                    <span key={index} style={{ 
                      background: '#f8f9fa', 
                      color: '#666', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: '500' 
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </CarInfo>
            </CarCard>
          ))}
        </CarsGrid>
        
        <ViewAllButton onClick={() => navigate('/vehicles')}>
          Ver Todos os Carros
        </ViewAllButton>
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