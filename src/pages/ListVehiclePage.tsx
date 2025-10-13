import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/authService';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MyLocation, Location, Camera, Schedule, Map, Usb, Bluetooth, AirConditioning, Photo, Money } from '../components/IconSystem';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Step = styled.div<{ active?: boolean; completed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  background: ${props => {
    if (props.completed) return '#4CAF50';
    if (props.active) return '#667eea';
    return '#f8f9fa';
  }};
  color: ${props => {
    if (props.completed || props.active) return 'white';
    return '#666';
  }};
  font-weight: 600;
  transition: all 0.3s;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StepNumber = styled.div<{ completed?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.completed ? 'white' : 'rgba(255,255,255,0.3)'};
  color: ${props => props.completed ? '#4CAF50' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.3s;

  &:hover {
    background: #f8f9fa;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const PhotoUploadSection = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  transition: all 0.3s;

  &:hover {
    border-color: #667eea;
    background: #f0f2ff;
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  color: #666;
  margin-bottom: 1rem;
`;

const UploadButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    background: #5a6fd8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 150px;

  ${props => props.variant === 'secondary' ? `
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
    
    &:hover {
      background: #667eea;
      color: white;
    }
  ` : `
    background: #667eea;
    color: white;
    border: none;
    
    &:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }
  `}

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number }>`
  height: 100%;
  background: #667eea;
  width: ${props => props.width}%;
  transition: width 0.3s;
`;

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map click handler component
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

// Map component that handles location updates
const LocationMap: React.FC<{
  center: [number, number];
  selectedLocation: [number, number] | null;
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ center, selectedLocation, onLocationSelect }) => {
  return (
    <MapContainer
      key={`${center[0]}-${center[1]}`} // Force re-render when center changes
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler onLocationSelect={onLocationSelect} />
      {selectedLocation && (
        <Marker position={selectedLocation} />
      )}
    </MapContainer>
  );
};

const ListVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo default
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    type: '',
    fuelType: '',
    engineCapacity: '',
    mileage: '',
    color: '',
    transmission: '',
    seats: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    latitude: null as number | null,
    longitude: null as number | null,
    
    // Pricing
    dailyRate: '',
    hourlyRate: '',
    securityDeposit: '',
    
    // Features
    airConditioning: false,
    gps: false,
    bluetooth: false,
    usbCharger: false,
    
    // Additional Info
    photos: [] as string[]
  });

  // Update map center when location changes
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      setMapCenter([formData.latitude, formData.longitude]);
      setSelectedLocation([formData.latitude, formData.longitude]);
    }
  }, [formData.latitude, formData.longitude]);

  const steps = [
    { number: 1, title: 'Informações Básicas' },
    { number: 2, title: 'Localização' },
    { number: 3, title: 'Preços' },
    { number: 4, title: 'Recursos' },
    { number: 5, title: 'Fotos' }
  ];

  const vehicleTypes = ['sedan', 'suv', 'hatchback', 'pickup', 'convertible', 'coupe'];
  const fuelTypes = ['gasoline', 'flex', 'diesel', 'electric', 'hybrid'];
  const transmissions = ['manual', 'automatic'];
  const states = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Current location obtained:', latitude, longitude);
          
          // Update all location-related state
          setMapCenter([latitude, longitude]);
          setSelectedLocation([latitude, longitude]);
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude
          }));
          
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setGettingLocation(false);
          alert('Não foi possível obter sua localização atual. Selecione manualmente no mapa.');
        }
      );
    } else {
      alert('Geolocalização não é suportada por este navegador.');
    }
  };

  // Handle map location selection
  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  // Geocode address to coordinates
  const geocodeAddress = async (address: string) => {
    try {
      // Using OpenStreetMap Nominatim API (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const coordinates = [parseFloat(lat), parseFloat(lon)] as [number, number];
        setMapCenter(coordinates);
        setSelectedLocation(coordinates);
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        }));
        
        // Parse address components
        const addressParts = display_name.split(', ');
        if (addressParts.length >= 2) {
          setFormData(prev => ({
            ...prev,
            city: addressParts[addressParts.length - 3] || '',
            state: addressParts[addressParts.length - 2] || ''
          }));
        }
      } else {
        alert('Endereço não encontrado. Tente um endereço diferente ou selecione no mapa.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Erro ao encontrar endereço. Selecione a localização no mapa.');
    }
  };

  // Handle address input change with debounced geocoding
  const handleAddressChange = (value: string) => {
    setFormData(prev => ({ ...prev, address: value }));
    
    // Debounce geocoding
    if (value.length > 5) {
      setTimeout(() => {
        geocodeAddress(value);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      const requiredFields = ['make', 'model', 'year', 'licensePlate', 'type', 'fuelType', 'dailyRate', 'address', 'city', 'state'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        alert(`Por favor, preencha todos os campos obrigatórios: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }
      
      // Get user ID from localStorage or context
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user.id) {
        alert('Por favor, faça login para anunciar um veículo');
        setLoading(false);
        return;
      }
      
      const vehicleData = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year) || new Date().getFullYear(),
        licensePlate: formData.licensePlate,
        type: formData.type,
        fuelType: formData.fuelType,
        engineCapacity: parseFloat(formData.engineCapacity) || 0,
        mileage: parseFloat(formData.mileage) || 0,
        dailyRate: parseFloat(formData.dailyRate) || 0,
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        securityDeposit: parseFloat(formData.securityDeposit) || 0,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
        color: formData.color,
        transmission: formData.transmission,
        seats: parseInt(formData.seats) || 5,
        airConditioning: formData.airConditioning,
        gps: formData.gps,
        bluetooth: formData.bluetooth,
        usbCharger: formData.usbCharger,
        ownerId: user.id,
        photos: formData.photos
      };

      console.log('Sending vehicle data:', vehicleData);
      await vehicleService.createVehicle(vehicleData);
      
      // Navigate to success page or dashboard
      navigate('/dashboard?vehicle=listed');
    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      console.error('Error details:', error.response?.data);
      alert(`Falha ao anunciar veículo: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormSection>
            <SectionTitle>Informações Básicas do Veículo</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Marca *</Label>
                <Input
                  type="text"
                  placeholder="ex: Toyota"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Modelo *</Label>
                <Input
                  type="text"
                  placeholder="ex: Corolla"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Ano *</Label>
                <Input
                  type="number"
                  placeholder="2023"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Placa *</Label>
                <Input
                  type="text"
                  placeholder="ABC-1234"
                  value={formData.licensePlate}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Tipo de Veículo *</Label>
                <Select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <option value="">Selecione o tipo</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Tipo de Combustível *</Label>
                <Select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                >
                  <option value="">Selecione o tipo de combustível</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Capacidade do Motor (L)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="2.0"
                  value={formData.engineCapacity}
                  onChange={(e) => handleInputChange('engineCapacity', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Quilometragem (km)</Label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Cor</Label>
                <Input
                  type="text"
                  placeholder="Azul"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Transmissão</Label>
                <Select
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                >
                  <option value="">Selecione a transmissão</option>
                  {transmissions.map(trans => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Número de Assentos</Label>
                <Input
                  type="number"
                  placeholder="5"
                  value={formData.seats}
                  onChange={(e) => handleInputChange('seats', e.target.value)}
                />
              </FormGroup>
            </FormGrid>
          </FormSection>
        );

      case 2:
        return (
          <FormSection>
            <SectionTitle>Localização do Veículo</SectionTitle>
            
            {/* Location Controls */}
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                style={{ minWidth: 'auto', padding: '0.5rem 1rem' }}
              >
                {gettingLocation ? (
                  <>
                    <Schedule size={16} /> Obtendo Localização...
                  </>
                ) : (
                  <>
                    <MyLocation size={16} /> Obter Localização Atual
                  </>
                )}
              </Button>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <Input
                  type="text"
                  placeholder="Digite o endereço para buscar..."
                  value={formData.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                />
              </div>
            </div>

            {/* Map Container */}
            <div style={{ height: '400px', width: '100%', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e9ecef' }}>
              <LocationMap
                center={mapCenter}
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
              />
            </div>

            {/* Address Form */}
            <FormGrid>
              <FormGroup>
                <Label>Endereço *</Label>
                <Input
                  type="text"
                  placeholder="Rua das Flores, 123"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>City *</Label>
                <Input
                  type="text"
                  placeholder="São Paulo"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>State *</Label>
                <Select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                >
                  <option value="">Select state</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormGrid>

            {/* Location Info */}
            {formData.latitude && formData.longitude && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                <strong><Location size={16} /> Selected Location:</strong><br />
                Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
              </div>
            )}
          </FormSection>
        );

      case 3:
        return (
          <FormSection>
            <SectionTitle>Preços e Taxas</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Taxa Diária (R$) *</Label>
                <Input
                  type="number"
                  placeholder="150"
                  value={formData.dailyRate}
                  onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Taxa por Hora (R$)</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={formData.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Caução (R$)</Label>
                <Input
                  type="number"
                  placeholder="500"
                  value={formData.securityDeposit}
                  onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                />
              </FormGroup>
            </FormGrid>
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>
                <Money size={16} /> Dicas de Preço
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666' }}>
                <li>Verifique veículos similares na sua região para preços competitivos</li>
                <li>Considere a demanda sazonal e eventos locais</li>
                <li>Comece com taxas competitivas para construir avaliações</li>
                <li>Você pode ajustar os preços a qualquer momento após o anúncio</li>
              </ul>
            </div>
          </FormSection>
        );

      case 4:
        return (
          <FormSection>
            <SectionTitle>Recursos e Comodidades do Veículo</SectionTitle>
            <CheckboxGroup>
              <CheckboxItem>
                <Checkbox
                  type="checkbox"
                  checked={formData.airConditioning}
                  onChange={(e) => handleInputChange('airConditioning', e.target.checked)}
                />
                <span><AirConditioning size={16} /> Ar Condicionado</span>
              </CheckboxItem>
              <CheckboxItem>
                <Checkbox
                  type="checkbox"
                  checked={formData.gps}
                  onChange={(e) => handleInputChange('gps', e.target.checked)}
                />
                <span><Map size={16} /> Navegação GPS</span>
              </CheckboxItem>
              <CheckboxItem>
                <Checkbox
                  type="checkbox"
                  checked={formData.bluetooth}
                  onChange={(e) => handleInputChange('bluetooth', e.target.checked)}
                />
                <span><Bluetooth size={16} /> Bluetooth</span>
              </CheckboxItem>
              <CheckboxItem>
                <Checkbox
                  type="checkbox"
                  checked={formData.usbCharger}
                  onChange={(e) => handleInputChange('usbCharger', e.target.checked)}
                />
                <span><Usb size={16} /> USB Charger</span>
              </CheckboxItem>
            </CheckboxGroup>
            
          </FormSection>
        );

      case 5:
        return (
          <FormSection>
            <SectionTitle>Fotos do Veículo</SectionTitle>
            <PhotoUploadSection>
              <UploadIcon><Photo size={24} /></UploadIcon>
              <UploadText>
                <strong>Adicione fotos do seu veículo</strong><br />
                Boas fotos ajudam os hóspedes a escolher seu veículo
              </UploadText>
              <UploadButton>
                Enviar Fotos
              </UploadButton>
            </PhotoUploadSection>
            
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>
                <Camera size={16} /> Dicas de Foto
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666' }}>
                <li>Tire fotos com boa iluminação</li>
                <li>Inclua exterior, interior e compartimento do motor</li>
                <li>Mostre recursos únicos ou acessórios</li>
                <li>Certifique-se de que o veículo está limpo</li>
              </ul>
            </div>
          </FormSection>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / 5) * 100;

  return (
    <Container>
      <Header>
        <Title>Anuncie Seu Veículo</Title>
        <Subtitle>
          Compartilhe seu veículo e comece a ganhar dinheiro. É fácil começar!
        </Subtitle>
      </Header>

      <StepsContainer>
        {steps.map((step) => (
          <Step
            key={step.number}
            active={currentStep === step.number}
            completed={currentStep > step.number}
          >
            <StepNumber completed={currentStep > step.number}>
              {currentStep > step.number ? '✓' : step.number}
            </StepNumber>
            {step.title}
          </Step>
        ))}
      </StepsContainer>

      <ProgressBar>
        <ProgressFill width={progress} />
      </ProgressBar>

      <FormContainer>
        {renderStepContent()}
        
        <ButtonGroup>
          {currentStep > 1 && (
            <Button variant="secondary" onClick={handlePrevious}>
              Anterior
            </Button>
          )}
          {currentStep < 5 ? (
            <Button onClick={handleNext}>
              Próximo
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Anunciando Veículo...' : 'Anunciar Meu Veículo'}
            </Button>
          )}
        </ButtonGroup>
      </FormContainer>
    </Container>
  );
};

export default ListVehiclePage;
