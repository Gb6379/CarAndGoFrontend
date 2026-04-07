import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { vehicleService, favoriteService } from '../services/authService';
import { errorToDisplay } from '../utils/errorUtils';
import { getFavorites, toggleFavorite } from '../utils/favorites';
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

// Ícone de carrinho para marcadores do mapa
const carMarkerIcon = L.divIcon({
  className: 'car-marker-icon',
  html: `<div style="
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: #F6885C; border-radius: 50%;
    border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "><svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
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
  color: #F6885C;
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
    border-color: #F6885C;
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
    border-color: #F6885C;
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
  border: 2px solid ${props => props.active ? '#F6885C' : '#e9ecef'};
  background: ${props => props.active ? '#F6885C' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;

  &:hover {
    border-color: #F6885C;
    background: ${props => props.active ? '#ED733A' : '#f8f9fa'};
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
      color: #F6885C;
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

const ListRefreshNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #555;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
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
  background: linear-gradient(135deg, #F6885C, #D95128);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
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
      case 'economy': return '#F6885C';
      default: return '#F6885C';
    }
  }};
  color: white;
`;

const FavoriteIconButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.95);
  color: #ea580c;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);

  &:hover {
    background: white;
    transform: scale(1.08);
    color: #c2410c;
  }

  svg {
    font-size: 22px;
  }
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

const MonthlyButton = styled.button`
  margin-top: 0.85rem;
  width: 100%;
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #fdba74;
  background: #fff4ed;
  color: #9a3412;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: #ffedd5;
    transform: translateY(-1px);
  }
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
    border-color: #F6885C;
  }
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #F6885C;
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
  background: #F6885C;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

const SearchButton = styled.button<{ searching?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.searching ? '#ccc' : '#F6885C'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: ${props => props.searching ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.searching ? '#ccc' : '#ED733A'};
  }
`;

const VehicleListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultListFilters = {
    vehicleType: 'all' as string,
    makeModel: 'all',
    year: 'all',
    seats: 'all',
    electric: false,
    minPrice: '',
    maxPrice: '',
    transmissionManual: false,
    transmissionAutomatic: false,
  };

  const [filters, setFilters] = useState<{
    [key: string]: string | boolean;
    vehicleType: string;
    makeModel: string;
    year: string;
    seats: string;
    electric: boolean;
    minPrice: string;
    maxPrice: string;
    transmissionManual: boolean;
    transmissionAutomatic: boolean;
  }>(defaultListFilters);
  const [sortBy, setSortBy] = useState('price');
  const [listRefreshing, setListRefreshing] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const isLoggedIn = !!localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const isLocatario = userData?.userType === 'lessee' || userData?.userType === 'rent';

  useEffect(() => {
    const load = async () => {
      if (isLoggedIn) {
        try {
          const ids = await favoriteService.getFavoriteIds();
          setFavoriteIds(ids || []);
        } catch {
          setFavoriteIds([]);
        }
      } else {
        setFavoriteIds(getFavorites());
      }
    };
    load();
  }, [isLoggedIn]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [currentSearchLocation, setCurrentSearchLocation] = useState<string>('');
  const [locationInput, setLocationInput] = useState<string>('');
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    brand: true,
    price: true,
    transmission: false,
    features: false
  });

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.search);
  const initialLocation = searchParams.get('location') || 'São Paulo, SP';
  const fromDate = searchParams.get('from') || '';
  const untilDate = searchParams.get('until') || '';
  const age = searchParams.get('age') || '25';

  const isFirstFilterEffect = useRef(true);
  const ignoreNextFilterEffect = useRef(false);
  const silentRequestsInFlight = useRef(0);

  // Ao mudar a URL, atualizar estado e buscar com a localização da URL (evitar 1ª busca com state vazio)
  useEffect(() => {
    console.log('VehicleListPage mounted, starting to load vehicles...');
    setCurrentSearchLocation(initialLocation);
    setLocationInput(initialLocation);
    loadVehicles(initialLocation);
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
            setLocationInput(address);
            
            // Reload vehicles with new location (passar address para não depender do state)
            loadVehicles(address);
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            const fallbackAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setUserLocation({ lat: latitude, lng: longitude, address: fallbackAddress });
            setCurrentSearchLocation(fallbackAddress);
            setLocationInput(fallbackAddress);
            loadVehicles(fallbackAddress);
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
      let locationToSearch = locationInput.trim();
      
      // If user typed something but didn't select a suggestion, use the first one
      if (locationSuggestions.length > 0) {
        const firstSuggestion = locationSuggestions[0];
        setUserLocation({
          lat: firstSuggestion.lat,
          lng: firstSuggestion.lng,
          address: firstSuggestion.displayName
        });
        locationToSearch = firstSuggestion.displayName;
        setCurrentSearchLocation(locationToSearch);
      } else {
        // No suggestions, use the raw input but normalize it
        if (locationToSearch.toLowerCase().includes('sao paulo') || 
            locationToSearch.toLowerCase().includes('são paulo')) {
          locationToSearch = 'São Paulo, SP';
        }
        setCurrentSearchLocation(locationToSearch);
      }
      
      loadVehicles(locationToSearch);
      setShowSuggestions(false);
      setSearchingLocation(false);
    }
  };

  const loadVehicles = async (
    locationOverride?: string,
    filtersOverride?: typeof filters,
    opts?: { silent?: boolean },
  ) => {
    const locationToUse = locationOverride !== undefined && locationOverride !== null ? locationOverride : currentSearchLocation;
    const filtersToUse = filtersOverride ?? filters;
    const silent = opts?.silent === true;
    if (silent) {
      silentRequestsInFlight.current += 1;
      setListRefreshing(true);
    }
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      
      console.log('Loading vehicles with filters:', {
        location: locationToUse,
        fromDate,
        untilDate,
        filters: filtersToUse,
        sortBy,
        userLocation
      });
      
      // Prepare search filters (usar local da URL na primeira carga para evitar busca com state vazio)
      const searchFilters: Record<string, unknown> = {
        location: locationToUse,
        city: locationToUse, // Also try city parameter
        fromDate,
        untilDate,
        ...filtersToUse,
        sortBy
      };

      const minP = String(filtersToUse.minPrice ?? '').trim();
      const maxP = String(filtersToUse.maxPrice ?? '').trim();
      if (minP !== undefined && minP !== '' && !Number.isNaN(Number(minP))) {
        searchFilters.minPrice = Number(minP);
      } else {
        delete searchFilters.minPrice;
      }
      if (maxP !== undefined && maxP !== '' && !Number.isNaN(Number(maxP))) {
        searchFilters.maxPrice = Number(maxP);
      } else {
        delete searchFilters.maxPrice;
      }

      // Add user coordinates if available
      if (userLocation) {
        (searchFilters as any).userLat = userLocation.lat;
        (searchFilters as any).userLng = userLocation.lng;
      }

      // Remove empty filters but keep location/city filters
      Object.keys(searchFilters).forEach(key => {
        const value = searchFilters[key as keyof typeof searchFilters];
        if (value === '' || value === 'all' || value === false) {
          // Don't remove location or city filters even if they seem empty
          if (key !== 'location' && key !== 'city') {
            delete searchFilters[key as keyof typeof searchFilters];
          }
        }
      });

      console.log('Calling API with filters:', searchFilters);
      console.log('Current search location:', locationToUse);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API timeout')), 5000);
      });
      
      const vehiclesData = await Promise.race([
        vehicleService.searchVehicles(searchFilters),
        timeoutPromise
      ]);
      
      console.log('Received vehicles data:', vehiclesData);
      console.log('Number of vehicles received:', vehiclesData?.length || 0);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setError('Falha ao carregar veículos. Tente novamente.');
      setVehicles([]);
    } finally {
      if (silent) {
        silentRequestsInFlight.current -= 1;
        if (silentRequestsInFlight.current <= 0) {
          silentRequestsInFlight.current = 0;
          setListRefreshing(false);
        }
      } else {
        setLoading(false);
      }
    }
  };

  /** Recarrega a lista quando filtros ou ordenação mudam (debounce para digitação de preço). */
  useEffect(() => {
    if (isFirstFilterEffect.current) {
      isFirstFilterEffect.current = false;
      return;
    }
    if (ignoreNextFilterEffect.current) {
      ignoreNextFilterEffect.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      loadVehicles(undefined, undefined, { silent: true });
    }, 400);
    return () => window.clearTimeout(id);
  }, [filters, sortBy]);

  const handleCarClick = (carId: string) => {
    // Pass search dates to vehicle detail page
    const params = new URLSearchParams();
    if (fromDate) params.set('startDate', fromDate);
    if (untilDate) params.set('endDate', untilDate);
    
    const queryString = params.toString();
    navigate(`/vehicle/${carId}${queryString ? `?${queryString}` : ''}`);
  };

  const handleMonthlyFlow = (carId: string) => {
    const params = new URLSearchParams();
    params.set('vehicleId', String(carId));
    navigate(`/mensalista/checkout?${params.toString()}`);
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
    const cleared = { ...defaultListFilters };
    ignoreNextFilterEffect.current = true;
    setFilters(cleared);
    loadVehicles(undefined, cleared);
  };

  const getVehicleTitle = (vehicle: any) => {
    return `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
  };

  const getVehicleLocation = (vehicle: any) => {
    return `${vehicle.city}, ${vehicle.state}`;
  };

  const normalizePhotoSrc = (raw: unknown) => {
    if (typeof raw !== 'string') return null;
    const s = raw.trim();
    if (!s) return null;
    if (s.startsWith('data:')) return s;
    if (s.startsWith('http://') || s.startsWith('https://')) return s;

    // Base64 sem prefixo (tentativa de inferir o mime)
    const head = s.slice(0, 12);
    const mime =
      head.startsWith('iVBOR') ? 'image/png'
      : head.startsWith('/9j/') ? 'image/jpeg'
      : head.startsWith('R0lGOD') ? 'image/gif'
      : head.startsWith('UklGR') ? 'image/webp'
      : 'image/jpeg';
    return `data:${mime};base64,${s}`;
  };

  const getVehicleImage = (vehicle: any) => {
    const src = normalizePhotoSrc(vehicle?.photos?.[0]);
    if (src) {
      return <img src={src} alt={getVehicleTitle(vehicle)} loading="lazy" />;
    }
    return vehicle.fuelType === 'eletrico' ? <Electric size={48} /> : <Car size={48} />;
  };

  const isElectric = (vehicle: any) => {
    return vehicle.fuelType === 'eletrico';
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
              De {fromDate.split('-').reverse().join('/')} até {untilDate.split('-').reverse().join('/')}
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

          {/* Price Filter (daily rate) */}
          <FilterSection>
            <FilterSectionHeader onClick={() => toggleSection('price')}>
              <FilterSectionTitle>Preço (diária)</FilterSectionTitle>
              <FilterSectionIcon isOpen={openSections.price}>▼</FilterSectionIcon>
            </FilterSectionHeader>
            <FilterSectionContent isOpen={openSections.price}>
              <FilterGroup>
                <div style={{ marginBottom: '0.5rem', color: '#666', fontSize: '0.85rem' }}>Escolha um intervalo de diária</div>
                <YearPriceGrid>
                  <FilterInput
                    type="number"
                    placeholder="Diária mín. (R$)"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <FilterInput
                    type="number"
                    placeholder="Diária máx. (R$)"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </YearPriceGrid>
                <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem', color: '#666', fontSize: '0.85rem' }}>Ou escolha uma faixa de diária</div>
                <QuickFilterButtons>
                  <QuickFilterButton
                    type="button"
                    active={filters.minPrice === '' && filters.maxPrice === '100'}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '100' }))
                    }
                  >
                    Até R$ 100/dia
                  </QuickFilterButton>
                  <QuickFilterButton
                    type="button"
                    active={filters.minPrice === '' && filters.maxPrice === '200'}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '200' }))
                    }
                  >
                    Até R$ 200/dia
                  </QuickFilterButton>
                  <QuickFilterButton
                    type="button"
                    active={filters.minPrice === '' && filters.maxPrice === '300'}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '300' }))
                    }
                  >
                    Até R$ 300/dia
                  </QuickFilterButton>
                  <QuickFilterButton
                    type="button"
                    active={filters.minPrice === '' && filters.maxPrice === '500'}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '500' }))
                    }
                  >
                    Até R$ 500/dia
                  </QuickFilterButton>
                </QuickFilterButtons>
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
                  <input
                    type="checkbox"
                    checked={filters.transmissionManual}
                    onChange={() =>
                      handleFilterChange('transmissionManual', !filters.transmissionManual)
                    }
                  />
                  <span>Manual</span>
                </FilterCheckbox>
                <FilterCheckbox>
                  <input
                    type="checkbox"
                    checked={filters.transmissionAutomatic}
                    onChange={() =>
                      handleFilterChange('transmissionAutomatic', !filters.transmissionAutomatic)
                    }
                  />
                  <span>Automático</span>
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
                <FilterCheckbox>
                  <input
                    type="checkbox"
                    checked={filters.vehicleType === 'eletrico'}
                    onChange={() => handleFilterChange('vehicleType', filters.vehicleType === 'eletrico' ? 'all' : 'eletrico')}
                  />
                  <span><Electric size={14} /> Elétrico</span>
                </FilterCheckbox>
                <FilterCheckbox>
                  <input
                    type="checkbox"
                    checked={filters.vehicleType === 'combustao'}
                    onChange={() => handleFilterChange('vehicleType', filters.vehicleType === 'combustao' ? 'all' : 'combustao')}
                  />
                  <span><Car size={14} /> Combustão</span>
                </FilterCheckbox>
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

          {listRefreshing && (
            <ListRefreshNotice role="status" aria-live="polite">
              <Loading size={16} />
              Atualizando resultados…
            </ListRefreshNotice>
          )}

          {error && (
            <div style={{ 
              background: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              color: '#856404', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1rem' 
            }}>
              {errorToDisplay(error)}
            </div>
          )}

          <CarsGrid>
            {vehicles.map((vehicle) => {
              const vehicleIdStr = String(vehicle.id);
              const isFav = favoriteIds.includes(vehicleIdStr);
              return (
              <CarCard key={vehicle.id} onClick={() => handleCarClick(vehicle.id)}>
                <CarImage>
                  {getVehicleImage(vehicle)}
                  {isElectric(vehicle) && <CarBadge type="electric">Elétrico</CarBadge>}
                  <FavoriteIconButton
                    type="button"
                    aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (isLoggedIn) {
                        try {
                          const res = await favoriteService.toggleFavorite(vehicleIdStr);
                          setFavoriteIds((prev) =>
                            res.isFavorite ? [...prev, vehicleIdStr] : prev.filter((id) => id !== vehicleIdStr)
                          );
                        } catch {
                          // keep state unchanged on error
                        }
                      } else {
                        toggleFavorite(vehicleIdStr);
                        setFavoriteIds(getFavorites());
                      }
                    }}
                  >
                    {isFav ? <Favorite /> : <FavoriteBorder />}
                  </FavoriteIconButton>
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
                  {isLocatario && (
                    <MonthlyButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMonthlyFlow(vehicle.id);
                      }}
                    >
                      Ser mensalista com este carro
                    </MonthlyButton>
                  )}
                </CarInfo>
              </CarCard>
            );
            })}
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
                        icon={carMarkerIcon}
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
                                background: '#F6885C',
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