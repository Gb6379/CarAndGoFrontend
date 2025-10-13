import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { vehicleService } from '../services/authService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, 
  Electric,
  Star, 
  Location, 
  MyLocation, 
  Loading, 
  City, 
  Home, 
  Road,
  AirConditioning,
  Bluetooth,
  GPS,
  Seat,
  Map,
  Car
} from '../components/IconSystem';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  background: #1a1a1a;
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const SearchResults = styled.div`
  color: #ccc;
  font-size: 1.1rem;
`;

const FilterSidebar = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 0;
  overflow: hidden;
`;

const FilterHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FilterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ClearFiltersButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FilterSection = styled.div<{ isOpen?: boolean }>`
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FilterSectionHeader = styled.div<{ isOpen?: boolean }>`
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const FilterSectionTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const FilterSectionIcon = styled.span<{ isOpen?: boolean }>`
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s;
  font-size: 1.2rem;
`;

const FilterSectionContent = styled.div<{ isOpen?: boolean }>`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: max-height 0.3s ease;
  padding: ${props => props.isOpen ? '0 1.5rem 1.5rem' : '0 1.5rem'};
`;

const FilterGroup = styled.div`
  margin-bottom: 1rem;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const YearPriceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const QuickFilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const QuickFilterButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.active ? '#667eea' : '#e9ecef'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;

  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? '#5a6fd8' : '#f8f9fa'};
  }
`;

const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  cursor: pointer;
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  span {
    font-size: 0.9rem;
    color: #333;
  }
  
  &:hover {
    span {
      color: #667eea;
    }
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 350px;
  gap: 1.5rem;

  @media (max-width: 1400px) {
    grid-template-columns: 280px 1fr;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const CarsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const CarsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CarsCount = styled.div`
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
`;

const CarsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const CarCard = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
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

const CarBadge = styled.div<{ type: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => {
    switch(props.type) {
      case 'electric': return '#4CAF50';
      case 'premium': return '#FF9800';
      case 'economy': return '#2196F3';
      default: return '#667eea';
    }
  }};
  color: white;
`;

const CarInfo = styled.div`
  padding: 1.5rem;
`;

const CarTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
`;

const CarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #ffa500;
  font-weight: 600;
`;

const CarLocation = styled.div`
  color: #666;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 1rem;
`;

const TotalPrice = styled.span`
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
`;

const SaveAmount = styled.div`
  background: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const MapSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const MapTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
`;

const MapWrapper = styled.div`
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const MapMarker = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: 20px;
  height: 20px;
  background: #ff6b6b;
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.2);
  }
`;

const MarkerPrice = styled.div`
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #333;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
`;

const LocationSearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

const LocationInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #667eea;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: -8px;
`;

const SuggestionItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SuggestionTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const SuggestionDetails = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const SuggestionType = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

const SearchButton = styled.button<{ searching?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.searching ? '#ccc' : '#667eea'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: ${props => props.searching ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.searching ? '#ccc' : '#5a6fd8'};
  }
`;

const VehicleListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    [key: string]: string | boolean;
    vehicleType: string;
    makeModel: string;
    year: string;
    seats: string;
    electric: boolean;
    minPrice: string;
    maxPrice: string;
  }>({
    vehicleType: 'all',
    makeModel: 'all',
    year: 'all',
    seats: 'all',
    electric: false,
    minPrice: '',
    maxPrice: ''
  });
  const [sortBy, setSortBy] = useState('price');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [currentSearchLocation, setCurrentSearchLocation] = useState<string>('');
  const [locationInput, setLocationInput] = useState<string>('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    brand: true,
    year: true,
    price: true,
    mileage: false,
    transmission: false,
    fuelType: false,
    features: false
  });

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const initialLocation = searchParams.get('location') || 'São Paulo, SP';
  const fromDate = searchParams.get('from') || '';
  const untilDate = searchParams.get('until') || '';
  const age = searchParams.get('age') || '25';

  useEffect(() => {
    console.log('VehicleListPage mounted, starting to load vehicles...');
    setCurrentSearchLocation(initialLocation);
    setLocationInput(initialLocation);
    loadVehicles();
  }, [location.search]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-location-search]')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Current location obtained:', latitude, longitude);
          
          // Reverse geocode to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            
            setUserLocation({ lat: latitude, lng: longitude, address });
            setCurrentSearchLocation(address);
            
            // Reload vehicles with new location
            loadVehicles();
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            setUserLocation({ lat: latitude, lng: longitude, address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
            setCurrentSearchLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            loadVehicles();
          }
          
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setGettingLocation(false);
          alert('Não foi possível obter sua localização atual. Digite um local manualmente.');
        }
      );
    } else {
      alert('Geolocalização não é suportada por este navegador.');
    }
  };

  // Fetch location suggestions as user types
  const fetchLocationSuggestions = async (input: string) => {
    if (input.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Search with more detailed results including neighborhoods, cities, and streets
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=10&addressdetails=1&countrycodes=br`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Format suggestions with more detail
        const suggestions = data.map((item: any) => ({
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          type: item.type,
          address: item.address,
          city: item.address?.city || item.address?.town || item.address?.village,
          state: item.address?.state,
          neighbourhood: item.address?.neighbourhood || item.address?.suburb,
          road: item.address?.road,
          importance: item.importance
        }));
        
        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle location input change
  const handleLocationInputChange = (value: string) => {
    setLocationInput(value);
    
    // Debounce the API call
    const timeoutId = setTimeout(() => {
      fetchLocationSuggestions(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion: any) => {
    setLocationInput(suggestion.displayName);
    setUserLocation({
      lat: suggestion.lat,
      lng: suggestion.lng,
      address: suggestion.displayName
    });
    setCurrentSearchLocation(suggestion.displayName);
    setShowSuggestions(false);
  };

  // Handle search button click
  const handleSearchLocation = () => {
    if (locationInput.trim()) {
      setSearchingLocation(true);
      setCurrentSearchLocation(locationInput);
      
      // If user typed something but didn't select a suggestion, use the first one
      if (locationSuggestions.length > 0) {
        const firstSuggestion = locationSuggestions[0];
        setUserLocation({
          lat: firstSuggestion.lat,
          lng: firstSuggestion.lng,
          address: firstSuggestion.displayName
        });
        setCurrentSearchLocation(firstSuggestion.displayName);
      }
      
      loadVehicles();
      setShowSuggestions(false);
      setSearchingLocation(false);
    }
  };

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading vehicles with filters:', {
        location: currentSearchLocation,
        fromDate,
        untilDate,
        filters,
        sortBy,
        userLocation
      });
      
      // Prepare search filters
      const searchFilters = {
        location: currentSearchLocation,
        fromDate,
        untilDate,
        ...filters,
        sortBy
      };

      // Add user coordinates if available
      if (userLocation) {
        (searchFilters as any).userLat = userLocation.lat;
        (searchFilters as any).userLng = userLocation.lng;
      }

      // Remove empty filters
      Object.keys(searchFilters).forEach(key => {
        const value = searchFilters[key as keyof typeof searchFilters];
        if (value === '' || value === 'all' || value === false) {
          delete searchFilters[key as keyof typeof searchFilters];
        }
      });

      console.log('Calling API with filters:', searchFilters);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API timeout')), 5000);
      });
      
      const vehiclesData = await Promise.race([
        vehicleService.searchVehicles(searchFilters),
        timeoutPromise
      ]);
      
      console.log('Received vehicles data:', vehiclesData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setError('Falha ao carregar veículos. Tente novamente.');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCarClick = (carId: string) => {
    navigate(`/vehicle/${carId}`);
  };

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      vehicleType: 'all',
      makeModel: 'all',
      year: 'all',
      seats: 'all',
      electric: false,
      minPrice: '',
      maxPrice: ''
    });
    loadVehicles();
  };

  const getVehicleTitle = (vehicle: any) => {
    return `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
  };

  const getVehicleLocation = (vehicle: any) => {
    return `${vehicle.city}, ${vehicle.state}`;
  };

  const getVehicleImage = (vehicle: any) => {
    if (vehicle.photos && vehicle.photos.length > 0) {
      return vehicle.photos[0];
    }
    return vehicle.fuelType === 'ELECTRIC' ? <Electric size={48} /> : <Car size={48} />;
  };

  const isElectric = (vehicle: any) => {
    return vehicle.fuelType === 'ELECTRIC';
  };

  console.log('VehicleListPage render - loading:', loading, 'vehicles:', vehicles.length, 'error:', error);

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>
          Carregando veículos...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderTitle>Encontrar Carros</HeaderTitle>
        
        {/* Location Search */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center', 
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <LocationSearchContainer data-location-search>
            <LocationInput
              type="text"
              placeholder="Digite cidade, bairro ou rua..."
              value={locationInput}
              onChange={(e) => handleLocationInputChange(e.target.value)}
              onFocus={() => setShowSuggestions(locationSuggestions.length > 0)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchLocation();
                }
              }}
            />
            
            {/* Autocomplete Suggestions */}
            {showSuggestions && locationSuggestions.length > 0 && (
              <SuggestionsDropdown>
                {locationSuggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <SuggestionTitle>
                      {suggestion.neighbourhood && `${suggestion.neighbourhood}, `}
                      {suggestion.city && `${suggestion.city}`}
                      {suggestion.state && `, ${suggestion.state}`}
                      <SuggestionType>
                        {suggestion.type === 'suburb' || suggestion.type === 'neighbourhood' ? (
                          <>
                            <Home size={12} /> Bairro
                          </>
                        ) :
                         suggestion.type === 'city' || suggestion.type === 'administrative' ? (
                          <>
                            <City size={12} /> Cidade
                          </>
                        ) :
                         suggestion.type === 'road' ? (
                          <>
                            <Road size={12} /> Rua
                          </>
                        ) :
                         suggestion.type}
                      </SuggestionType>
                    </SuggestionTitle>
                    <SuggestionDetails>
                      {suggestion.road && `${suggestion.road}, `}
                      {suggestion.displayName}
                    </SuggestionDetails>
                  </SuggestionItem>
                ))}
              </SuggestionsDropdown>
            )}
          </LocationSearchContainer>
          
          <SearchButton
            onClick={handleSearchLocation}
            searching={searchingLocation}
            disabled={searchingLocation || !locationInput.trim()}
          >
            {searchingLocation ? (
              <>
                <Loading size={16} /> Buscando...
              </>
            ) : (
              <>
                <Search size={16} /> Buscar
              </>
            )}
          </SearchButton>
          
          <SearchButton
            onClick={getCurrentLocation}
            searching={gettingLocation}
            disabled={gettingLocation}
          >
            {gettingLocation ? (
              <>
                <Loading size={16} /> Obtendo Localização...
              </>
            ) : (
              <>
                <MyLocation size={16} /> Usar Minha Localização
              </>
            )}
          </SearchButton>
        </div>

        <SearchResults>
          {fromDate && untilDate ? (
            <>
              De {new Date(fromDate).toLocaleDateString()} até {new Date(untilDate).toLocaleDateString()}
              <br />
            </>
          ) : null}
              {vehicles.length}+ carros disponíveis
              {userLocation && (
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
                  <Location size={14} /> Buscando próximo a: {userLocation.address}
                </div>
              )}
        </SearchResults>
      </Header>

      <MainContent>
        {/* Filter Sidebar */}
        <FilterSidebar>
          <FilterHeader>
            <FilterTitle>Filtros</FilterTitle>
            <ClearFiltersButton onClick={clearAllFilters}>Limpar todos</ClearFiltersButton>
          </FilterHeader>

          {/* Brand Filter */}
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('brand')}>
              <FilterSectionTitle>Marca</FilterSectionTitle>
              <FilterSectionIcon isOpen={openSections.brand}>▼</FilterSectionIcon>
            </FilterSectionHeader>
            <FilterSectionContent isOpen={openSections.brand}>
              <FilterGroup>
                <FilterSelect 
                  value={filters.makeModel} 
                  onChange={(e) => handleFilterChange('makeModel', e.target.value)}
                >
                  <option value="all">Todas as marcas</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Fiat">Fiat</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Nissan">Nissan</option>
                </FilterSelect>
              </FilterGroup>
            </FilterSectionContent>
          </FilterSection>

          {/* Year Filter */}
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('year')}>
              <FilterSectionTitle>Ano</FilterSectionTitle>
              <FilterSectionIcon isOpen={openSections.year}>▼</FilterSectionIcon>
            </FilterSectionHeader>
            <FilterSectionContent isOpen={openSections.year}>
              <FilterGroup>
                <div style={{ marginBottom: '0.5rem', color: '#666', fontSize: '0.85rem' }}>Escolha um intervalo</div>
                <YearPriceGrid>
                  <FilterInput
                    type="number"
                    placeholder="Ano mínimo"
                    value={filters.year === 'all' ? '' : filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value || 'all')}
                  />
                  <FilterInput
                    type="number"
                    placeholder="Ano máximo"
                  />
                </YearPriceGrid>
                <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem', color: '#666', fontSize: '0.85rem' }}>Ou escolha um ano específico</div>
                <QuickFilterButtons>
                  {['2025', '2024', '2023', '2022', '2021', '2020'].map(year => (
                    <QuickFilterButton
                      key={year}
                      active={filters.year === year}
                      onClick={() => handleFilterChange('year', filters.year === year ? 'all' : year)}
                    >
                      {year}
                    </QuickFilterButton>
                  ))}
                </QuickFilterButtons>
              </FilterGroup>
            </FilterSectionContent>
          </FilterSection>

          {/* Price Filter */}
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('price')}>
              <FilterSectionTitle>Preço</FilterSectionTitle>
              <FilterSectionIcon isOpen={openSections.price}>▼</FilterSectionIcon>
            </FilterSectionHeader>
            <FilterSectionContent isOpen={openSections.price}>
              <FilterGroup>
                <div style={{ marginBottom: '0.5rem', color: '#666', fontSize: '0.85rem' }}>Escolha um intervalo</div>
                <YearPriceGrid>
                  <FilterInput
                    type="number"
                    placeholder="Preço mínimo"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <FilterInput
                    type="number"
                    placeholder="Preço máximo"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </YearPriceGrid>
                <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem', color: '#666', fontSize: '0.85rem' }}>Ou escolha uma faixa de preço</div>
                <QuickFilterButtons>
                  <QuickFilterButton onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', '60000'); }}>
                    Até R$ 60k
                  </QuickFilterButton>
                  <QuickFilterButton onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', '100000'); }}>
                    Até R$ 100k
                  </QuickFilterButton>
                  <QuickFilterButton onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', '150000'); }}>
                    Até R$ 150k
                  </QuickFilterButton>
                  <QuickFilterButton onClick={() => { handleFilterChange('minPrice', ''); handleFilterChange('maxPrice', '200000'); }}>
                    Até R$ 200k
                  </QuickFilterButton>
                </QuickFilterButtons>
              </FilterGroup>
            </FilterSectionContent>
          </FilterSection>

          {/* Mileage Filter */}
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('mileage')}>
              <FilterSectionTitle>Quilometragem</FilterSectionTitle>
              <FilterSectionIcon isOpen={openSections.mileage}>▼</FilterSectionIcon>
            </FilterSectionHeader>
            <FilterSectionContent isOpen={openSections.mileage}>
              <FilterGroup>
                <YearPriceGrid>
                  <FilterInput type="number" placeholder="Km mín." />
                  <FilterInput type="number" placeholder="Km máx." />
                </YearPriceGrid>
              </FilterGroup>
            </FilterSectionContent>
          </FilterSection>

          {/* Transmission Filter */}
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('transmission')}>
              <FilterSectionTitle>Transmissão</FilterSectionTitle>
              <FilterSectionIcon isOpen={openSections.transmission}>▼</FilterSectionIcon>
            </FilterSectionHeader>
            <FilterSectionContent isOpen={openSections.transmission}>
              <FilterGroup>
                <FilterCheckbox>
                  <input type="checkbox" />
                  <span>Manual</span>
                </FilterCheckbox>
                <FilterCheckbox>
                  <input type="checkbox" />
                  <span>Automático</span>
                </FilterCheckbox>
              </FilterGroup>
            </FilterSectionContent>
          </FilterSection>

          {/* Fuel Type Filter */}
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('fuelType')}>
              <FilterSectionTitle>Tipo de Combustível</FilterSectionTitle>
              <FilterSectionIcon isOpen={openSections.fuelType}>▼</FilterSectionIcon>
            </FilterSectionHeader>
            <FilterSectionContent isOpen={openSections.fuelType}>
              <FilterGroup>
                <FilterCheckbox>
                  <input 
                    type="checkbox" 
                    checked={filters.electric}
                    onChange={(e) => handleFilterChange('electric', e.target.checked)}
                  />
                  <span><Electric size={14} /> Elétrico</span>
                </FilterCheckbox>
                <FilterCheckbox>
                  <input type="checkbox" />
                  <span>Gasolina</span>
                </FilterCheckbox>
                <FilterCheckbox>
                  <input type="checkbox" />
                  <span>Flex</span>
                </FilterCheckbox>
                <FilterCheckbox>
                  <input type="checkbox" />
                  <span>Diesel</span>
                </FilterCheckbox>
                <FilterCheckbox>
                  <input type="checkbox" />
                  <span>Híbrido</span>
                </FilterCheckbox>
              </FilterGroup>
            </FilterSectionContent>
          </FilterSection>

          {/* Vehicle Type/Features */}
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('features')}>
              <FilterSectionTitle>Tipo de Veículo</FilterSectionTitle>
              <FilterSectionIcon isOpen={openSections.features}>▼</FilterSectionIcon>
            </FilterSectionHeader>
            <FilterSectionContent isOpen={openSections.features}>
              <FilterGroup>
                <FilterSelect 
                  value={filters.vehicleType} 
                  onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                >
                  <option value="all">Todos os tipos</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="pickup">Pickup</option>
                  <option value="coupe">Coupe</option>
                  <option value="convertible">Convertible</option>
                </FilterSelect>
                <div style={{ marginTop: '1rem' }}>
                  <FilterCheckbox>
                    <input type="checkbox" />
                    <span><Seat size={14} /> {filters.seats === 'all' ? '5+' : filters.seats} assentos</span>
                  </FilterCheckbox>
                  <FilterCheckbox>
                    <input type="checkbox" />
                    <span><AirConditioning size={14} /> Ar Condicionado</span>
                  </FilterCheckbox>
                  <FilterCheckbox>
                    <input type="checkbox" />
                    <span><Bluetooth size={14} /> Bluetooth</span>
                  </FilterCheckbox>
                  <FilterCheckbox>
                    <input type="checkbox" />
                    <span><GPS size={14} /> GPS</span>
                  </FilterCheckbox>
                </div>
              </FilterGroup>
            </FilterSectionContent>
          </FilterSection>
        </FilterSidebar>

        {/* Cars Section */}
        <CarsSection>
          <CarsHeader>
            <CarsCount>
              {vehicles.length}+ carros disponíveis
              <br />
              <small style={{ color: '#666', fontWeight: 'normal' }}>
                Estes carros estão localizados em e ao redor de {currentSearchLocation}
              </small>
            </CarsCount>
            <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price">Preço (menor para maior)</option>
              <option value="rating">Avaliação (maior para menor)</option>
              <option value="distance">Distância (próximo para longe)</option>
            </SortSelect>
          </CarsHeader>

          {error && (
            <div style={{ 
              background: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              color: '#856404', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}

          <CarsGrid>
            {vehicles.map((vehicle) => (
              <CarCard key={vehicle.id} onClick={() => handleCarClick(vehicle.id)}>
                <CarImage>
                  {getVehicleImage(vehicle)}
                  {isElectric(vehicle) && <CarBadge type="electric">Elétrico</CarBadge>}
                </CarImage>
                <CarInfo>
                  <CarTitle>{getVehicleTitle(vehicle)}</CarTitle>
                  <CarRating>
                    <Star size={14} /> {vehicle.rating || 4.5} ({vehicle.totalBookings || 0} viagens)
                  </CarRating>
                  <CarLocation>
                    <Location size={14} /> {getVehicleLocation(vehicle)} • {vehicle.address}
                  </CarLocation>
                  <PriceSection>
                    <PriceInfo>
                      <TotalPrice>R$ {vehicle.dailyRate} total</TotalPrice>
                    </PriceInfo>
                    {vehicle.owner && (
                      <div style={{ fontSize: '0.9rem', color: '#666' }}>
                        Anfitrião: {vehicle.owner.firstName} {vehicle.owner.lastName}
                      </div>
                    )}
                  </PriceSection>
                </CarInfo>
              </CarCard>
            ))}
          </CarsGrid>

          <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
            Cancelamento gratuito disponível para todas as viagens
          </div>
        </CarsSection>

        {/* Map Section */}
        <MapSection>
          <MapTitle>Carros no mapa</MapTitle>
          <MapWrapper>
            {vehicles.length > 0 ? (
              <MapContainer
                center={vehicles[0].latitude && vehicles[0].longitude 
                  ? [vehicles[0].latitude, vehicles[0].longitude] 
                  : [-23.5505, -46.6333]} // Default to São Paulo
                zoom={12}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {vehicles.map((vehicle) => {
                  if (vehicle.latitude && vehicle.longitude) {
                    return (
                      <Marker
                        key={vehicle.id}
                        position={[vehicle.latitude, vehicle.longitude]}
                      >
                        <Popup>
                          <div style={{ minWidth: '200px' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0' }}>{getVehicleTitle(vehicle)}</h4>
                            <p style={{ margin: '0 0 0.5rem 0' }}>
                              <strong>R$ {vehicle.dailyRate}</strong> por dia
                            </p>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                              <Star size={14} /> {vehicle.rating || 4.5} ({vehicle.totalBookings || 0} viagens)
                            </p>
                            <p style={{ margin: '0', fontSize: '0.8rem', color: '#666' }}>
                              <Location size={12} /> {getVehicleLocation(vehicle)}
                            </p>
                            <button
                              onClick={() => handleCarClick(vehicle.id)}
                              style={{
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                width: '100%'
                              }}
                            >
                              Ver Detalhes
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  }
                  return null;
                })}
              </MapContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}><Map size={32} /></div>
                <div>Nenhum veículo encontrado</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
                  Tente ajustar seus critérios de busca
                </div>
              </div>
            )}
          </MapWrapper>
        </MapSection>
      </MainContent>
    </Container>
  );
};

export default VehicleListPage;