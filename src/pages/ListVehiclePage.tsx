import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { vehicleService } from '../services/authService';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MyLocation, Location, Camera, Schedule, Map, Usb, Bluetooth, AirConditioning, Photo, Money } from '../components/IconSystem';
import AuthModal from '../components/AuthModal';
import { vehicleBrands, getModelsByBrand } from '../data/vehicleBrands';

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

const MAX_PHOTOS = 20;

const PhotoPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
`;

const PhotoPreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: #eee;
`;

const PhotoPreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoRemoveBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  color: white;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: #c00; }
`;

/** Ângulos sugeridos: lado a destacar na vista de cima (front=frente, left=esquerdo, back=traseira, right=direito). */
const PHOTO_ANGLES = [
  { label: 'Frente do veículo', side: 'front' as const },
  { label: 'Lado esquerdo', side: 'left' as const },
  { label: 'Traseira', side: 'back' as const },
  { label: 'Lado direito', side: 'right' as const },
  { label: 'Interior (banco traseiro)', side: 'center' as const },
  { label: 'Painel e volante', side: 'center' as const },
  { label: 'Compartimento do motor', side: 'front' as const },
  { label: 'Detalhes e acessórios', side: 'center' as const },
];

const PhotoAngleGuide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #f0f2ff 0%, #e8ebfa 100%);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const CarSvgWrap = styled.div`
  position: relative;
  width: 160px;
  height: 100px;
  flex-shrink: 0;
`;

const CarImageWrap = styled.div`
  position: relative;
  width: 160px;
  height: 100px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
`;

const CarImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const CarOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const PhotoAngleLabel = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 1.05rem;
`;

const PhotoAngleHint = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
`;

/** Coloque sua imagem do carro vista de cima em public/car-top-down.png para usar no guia */
const CAR_TOP_DOWN_IMAGE = '/car-top-down.png';

/** Carro vista de cima (sua imagem ou SVG) + lado destacado + câmera no lado indicado */
function TopDownCarWithHighlight({ side }: { side: 'front' | 'left' | 'back' | 'right' | 'center' }) {
  const [imageFailed, setImageFailed] = useState(false);
  const svgSize = { w: 160, h: 100 };
  const car = { x: 32, y: 26, width: 96, height: 48 };
  const strokeWidth = 10;
  const glowColor = 'rgba(255, 193, 7, 0.9)';
  const cameraPos = { front: { x: 80, y: 10 }, left: { x: 14, y: 50 }, back: { x: 80, y: 90 }, right: { x: 146, y: 50 }, center: { x: 80, y: 50 } };

  if (!imageFailed) {
    return (
      <CarImageWrap>
        <CarImage
          src={CAR_TOP_DOWN_IMAGE}
          alt="Carro vista de cima"
          onError={() => setImageFailed(true)}
        />
        <CarOverlay as="svg" viewBox="0 0 160 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <filter id="carGlowOverlay">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {side === 'front' && <rect x={car.x} y={car.y - 2} width={car.width} height={strokeWidth} fill={glowColor} filter="url(#carGlowOverlay)" />}
          {side === 'back' && <rect x={car.x} y={car.y + car.height - strokeWidth + 2} width={car.width} height={strokeWidth} fill={glowColor} filter="url(#carGlowOverlay)" />}
          {side === 'left' && <rect x={car.x - 2} y={car.y} width={strokeWidth} height={car.height} fill={glowColor} filter="url(#carGlowOverlay)" />}
          {side === 'right' && <rect x={car.x + car.width - strokeWidth + 2} y={car.y} width={strokeWidth} height={car.height} fill={glowColor} filter="url(#carGlowOverlay)" />}
          {side === 'center' && <circle cx={80} cy={50} r={18} fill={glowColor} filter="url(#carGlowOverlay)" opacity={0.8} />}
          <g transform={`translate(${cameraPos[side].x - 11}, ${cameraPos[side].y - 11})`}>
            <circle cx={11} cy={11} r={14} fill="#fff" stroke="#FFC107" strokeWidth="2.5" filter="url(#carGlowOverlay)" />
            <circle cx={11} cy={11} r={5} fill="#333" />
            <rect x={7} y={2} width={8} height={5} rx={1} fill="#333" />
          </g>
        </CarOverlay>
      </CarImageWrap>
    );
  }

  return (
    <CarSvgWrap>
      <svg width={svgSize.w} height={svgSize.h} viewBox={`0 0 ${svgSize.w} ${svgSize.h}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d32f2f" />
            <stop offset="50%" stopColor="#b71c1c" />
            <stop offset="100%" stopColor="#8b0000" />
          </linearGradient>
          <linearGradient id="carGlass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#546e7a" />
            <stop offset="100%" stopColor="#37474f" />
          </linearGradient>
          <filter id="carGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Corpo do carro vista de cima: capô → cabine → porta-malas (forma reconhecível) */}
        <path
          fill="url(#carBody)"
          stroke="#5d4037"
          strokeWidth="1"
          d="M 80 22
             C 65 22 52 28 48 38
             L 45 42 L 45 58 L 48 62
             C 52 72 65 78 80 78
             C 95 78 108 72 112 62
             L 115 58 L 115 42 L 112 38
             C 108 28 95 22 80 22 Z"
        />
        {/* Para-brisa (frente) */}
        <path fill="url(#carGlass)" d="M 80 26 C 68 26 58 30 55 36 L 54 42 L 58 44 L 102 44 L 106 42 L 105 36 C 102 30 92 26 80 26 Z" />
        {/* Teto / laterais do vidro */}
        <path fill="url(#carGlass)" d="M 58 44 L 56 56 L 58 60 L 102 60 L 104 56 L 102 44 Z" />
        {/* Luneta (traseira) */}
        <path fill="url(#carGlass)" d="M 58 60 L 55 66 C 58 72 68 76 80 76 C 92 76 102 72 105 66 L 102 60 Z" />
        {/* Retrovidores (pequenos círculos nas laterais) */}
        <ellipse cx={52} cy={50} rx={4} ry={5} fill="#37474f" stroke="#5d4037" strokeWidth="0.8" />
        <ellipse cx={108} cy={50} rx={4} ry={5} fill="#37474f" stroke="#5d4037" strokeWidth="0.8" />
        {/* Faixa iluminada no lado a fotografar */}
        {side === 'front' && (
          <rect x={car.x} y={car.y - 2} width={car.width} height={strokeWidth} fill={glowColor} filter="url(#carGlow)" />
        )}
        {side === 'back' && (
          <rect x={car.x} y={car.y + car.height - strokeWidth + 2} width={car.width} height={strokeWidth} fill={glowColor} filter="url(#carGlow)" />
        )}
        {side === 'left' && (
          <rect x={car.x - 2} y={car.y} width={strokeWidth} height={car.height} fill={glowColor} filter="url(#carGlow)" />
        )}
        {side === 'right' && (
          <rect x={car.x + car.width - strokeWidth + 2} y={car.y} width={strokeWidth} height={car.height} fill={glowColor} filter="url(#carGlow)" />
        )}
        {side === 'center' && (
          <circle cx={80} cy={50} r={18} fill={glowColor} filter="url(#carGlow)" opacity={0.8} />
        )}
        {/* Câmera indicando o lado */}
        <g transform={`translate(${cameraPos[side].x - 11}, ${cameraPos[side].y - 11})`}>
          <circle cx={11} cy={11} r={14} fill="#fff" stroke="#FFC107" strokeWidth="2.5" filter="url(#carGlow)" />
          <circle cx={11} cy={11} r={5} fill="#333" />
          <rect x={7} y={2} width={8} height={5} rx={1} fill="#333" />
        </g>
      </svg>
    </CarSvgWrap>
  );
}

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
  const { id: editId } = useParams<{ id: string }>();
  const isEditMode = !!editId;
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(!!editId);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333]); // São Paulo default
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    // Basic Information
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    type: '',
    fuelType: '',
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
    securityDeposit: '700',
    
    // Features
    airConditioning: false,
    gps: false,
    bluetooth: false,
    usbCharger: false,
    
    // Additional Info
    photos: [] as string[]
  });

  // Load vehicle when in edit mode
  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    vehicleService.getVehicle(editId)
      .then((v: any) => {
        if (cancelled) return;
        setFormData({
          make: v.make || '',
          model: v.model || '',
          year: String(v.year || ''),
          licensePlate: v.licensePlate || '',
          type: v.type || '',
          fuelType: v.fuelType || '',
          color: v.color || '',
          transmission: v.transmission || '',
          seats: String(v.seats ?? ''),
          address: v.address || '',
          city: v.city || '',
          state: v.state || '',
          latitude: v.latitude != null ? Number(v.latitude) : null,
          longitude: v.longitude != null ? Number(v.longitude) : null,
          dailyRate: String(v.dailyRate ?? ''),
          hourlyRate: String(v.hourlyRate ?? ''),
          securityDeposit: '700',
          airConditioning: !!v.airConditioning,
          gps: !!v.gps,
          bluetooth: !!v.bluetooth,
          usbCharger: !!v.usbCharger,
          photos: Array.isArray(v.photos) ? v.photos : [],
        });
        if (v.latitude != null && v.longitude != null) {
          setMapCenter([Number(v.latitude), Number(v.longitude)]);
          setSelectedLocation([Number(v.latitude), Number(v.longitude)]);
        }
      })
      .catch(() => {
        if (!cancelled) alert('Veículo não encontrado.');
      })
      .finally(() => {
        if (!cancelled) setLoadingVehicle(false);
      });
    return () => { cancelled = true; };
  }, [editId]);

  // Check if user is logged in when page loads
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    // Para anunciar (criar) veículo, locador precisa ter documentos verificados
    if (!isEditMode) {
      try {
        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;
        const isLessor = user?.userType === 'lessor' || user?.userType === 'both';
        if (isLessor && !user?.documentsVerified) {
          navigate('/verification', { state: { from: 'list-vehicle', message: 'Complete a verificação de CPF e antecedentes para anunciar veículos.' } });
        }
      } catch (_) {}
    }
  }, [isEditMode, navigate]);

  // Check if user is logged in when modal closes
  const handleModalClose = () => {
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      // If user closes modal without logging in, redirect to home
      navigate('/');
    } else {
      // User logged in successfully, just close the modal
      setIsAuthModalOpen(false);
    }
  };

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
  const brandOptions = formData.make && !vehicleBrands.includes(formData.make)
    ? [formData.make, ...vehicleBrands]
    : vehicleBrands;
  const modelOptions = formData.make
    ? (formData.model && !getModelsByBrand(formData.make).includes(formData.model)
        ? [formData.model, ...getModelsByBrand(formData.make)]
        : getModelsByBrand(formData.make))
    : [];
  const fuelTypes = [
    { value: 'combustao', label: 'Combustão' },
    { value: 'eletrico', label: 'Elétrico' },
  ];
  const transmissions = ['manual', 'automatic'];
  const states = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RS', 'SC', 'SE', 'SP', 'TO'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'make') next.model = '';
      return next;
    });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const remaining = MAX_PHOTOS - formData.photos.length;
    if (remaining <= 0) {
      alert(`Máximo de ${MAX_PHOTOS} fotos. Remova alguma para adicionar mais.`);
      e.target.value = '';
      return;
    }
    const toAdd = Math.min(files.length, remaining);
    const results: (string | null)[] = new Array(toAdd);
    let completed = 0;
    const checkDone = () => {
      completed++;
      if (completed === toAdd) {
        const newPhotos = results.filter((r): r is string => r != null);
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, ...newPhotos].slice(0, MAX_PHOTOS),
        }));
      }
    };
    for (let i = 0; i < toAdd; i++) {
      const reader = new FileReader();
      const idx = i;
      reader.onload = () => {
        results[idx] = typeof reader.result === 'string' ? reader.result : null;
        checkDone();
      };
      reader.readAsDataURL(files[i]);
    }
    e.target.value = '';
  };

  const handlePhotoRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Mapa nome do estado -> sigla (para o dropdown)
  const stateNameToCode: Record<string, string> = {
    'São Paulo': 'SP', 'Rio de Janeiro': 'RJ', 'Minas Gerais': 'MG', 'Rio Grande do Sul': 'RS',
    'Paraná': 'PR', 'Santa Catarina': 'SC', 'Bahia': 'BA', 'Goiás': 'GO', 'Pernambuco': 'PE',
    'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES', 'Amazonas': 'AM',
    'Pará': 'PA', 'Maranhão': 'MA', 'Paraíba': 'PB', 'Rio Grande do Norte': 'RN', 'Alagoas': 'AL',
    'Piauí': 'PI', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS', 'Sergipe': 'SE', 'Rondônia': 'RO',
    'Tocantins': 'TO', 'Acre': 'AC', 'Amapá': 'AP', 'Roraima': 'RR',
  };

  // Reverse geocode: coordenadas -> endereço, cidade, estado
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { 'Accept-Language': 'pt-BR' } }
      );
      const data = await response.json();
      if (!data?.address) return;
      const addr = data.address;
      const road = addr.road || addr.street || '';
      const number = addr.house_number || '';
      const addressStr = [road, number].filter(Boolean).join(', ') || data.display_name?.split(', ')[0] || '';
      const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
      const stateName = (addr.state || '').trim();
      const stateCode = stateNameToCode[stateName] || stateName;
      setFormData(prev => ({
        ...prev,
        address: addressStr || prev.address,
        city: city || prev.city,
        state: stateCode || prev.state,
      }));
    } catch (err) {
      console.error('Reverse geocode error:', err);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setSelectedLocation([latitude, longitude]);
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
          }));
          await reverseGeocode(latitude, longitude);
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
    if (currentStep === 1) {
      const currentYear = new Date().getFullYear();
      const minYear = currentYear - 10;
      const maxYear = currentYear + 1;
      const yearNum = parseInt(formData.year, 10);
      if (!formData.year || isNaN(yearNum) || yearNum < minYear || yearNum > maxYear) {
        alert(`O ano do veículo deve estar entre ${minYear} e ${maxYear} (veículos com até 10 anos de uso).`);
        return;
      }
    }
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

      const currentYear = new Date().getFullYear();
      const minYear = currentYear - 10;
      const maxYear = currentYear + 1;
      const yearNum = parseInt(formData.year, 10);
      if (isNaN(yearNum) || yearNum < minYear || yearNum > maxYear) {
        alert(`O ano do veículo deve estar entre ${minYear} e ${maxYear} (veículos com até 10 anos de uso).`);
        setLoading(false);
        return;
      }
      
      // Check if user is logged in
      const isLoggedIn = !!localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!isLoggedIn || !user.id) {
        // Show login modal
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
        setLoading(false);
        return;
      }
      
      const vehicleData: any = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year) || new Date().getFullYear(),
        licensePlate: formData.licensePlate,
        type: formData.type,
        fuelType: formData.fuelType,
        engineCapacity: 0,
        mileage: 0,
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
        photos: formData.photos
      };
      if (!isEditMode) vehicleData.ownerId = user.id;

      if (isEditMode && editId) {
        await vehicleService.updateVehicle(editId, vehicleData);
        alert('Anúncio atualizado com sucesso!');
        navigate('/dashboard');
      } else {
        console.log('Sending vehicle data:', vehicleData);
        await vehicleService.createVehicle(vehicleData);
        navigate('/dashboard?vehicle=listed');
      }
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
                <Select
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                >
                  <option value="">Selecione a marca</option>
                  {brandOptions.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Modelo *</Label>
                <Select
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  disabled={!formData.make}
                >
                  <option value="">Selecione o modelo</option>
                  {modelOptions.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Ano *</Label>
                <Input
                  type="number"
                  placeholder={`${new Date().getFullYear()}`}
                  min={new Date().getFullYear() - 10}
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  title="Veículos com até 10 anos (mínimo ano modelo atual - 10)"
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
                  {fuelTypes.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
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
                  readOnly
                  value="700"
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
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

      case 5: {
        const photoAngleIndex = Math.min(formData.photos.length, PHOTO_ANGLES.length - 1);
        const currentAngle = PHOTO_ANGLES[photoAngleIndex];
        const isComplete = formData.photos.length >= PHOTO_ANGLES.length;
        return (
          <FormSection>
            <SectionTitle>Fotos do Veículo</SectionTitle>

            <PhotoAngleGuide>
              <TopDownCarWithHighlight side={currentAngle.side} />
              <div>
                <PhotoAngleLabel>
                  {isComplete
                    ? 'Adicione mais fotos se quiser (máx. 20)'
                    : `Próxima foto: ${currentAngle.label}`}
                </PhotoAngleLabel>
                <PhotoAngleHint>
                  {isComplete
                    ? `Você já tem ${formData.photos.length} foto(s). Pode enviar até ${MAX_PHOTOS} no total.`
                    : `Foto ${photoAngleIndex + 1} de ${PHOTO_ANGLES.length} sugeridas`}
                </PhotoAngleHint>
              </div>
            </PhotoAngleGuide>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
            />
            <PhotoUploadSection onClick={() => photoInputRef.current?.click()} style={{ cursor: 'pointer' }}>
              <UploadIcon><Photo size={24} /></UploadIcon>
              <UploadText>
                <strong>Adicione fotos do seu veículo</strong><br />
                Boas fotos ajudam os hóspedes a escolher seu veículo
              </UploadText>
              <UploadButton
                type="button"
                onClick={(e) => { e.stopPropagation(); photoInputRef.current?.click(); }}
              >
                Enviar Fotos
              </UploadButton>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                Máximo de {MAX_PHOTOS} fotos ({formData.photos.length}/{MAX_PHOTOS})
              </p>
            </PhotoUploadSection>

            {formData.photos.length > 0 && (
              <PhotoPreviewGrid>
                {formData.photos.map((src, index) => (
                  <PhotoPreviewItem key={index}>
                    <PhotoPreviewImg src={src} alt={`Foto ${index + 1}`} />
                    <PhotoRemoveBtn
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handlePhotoRemove(index); }}
                      aria-label="Remover foto"
                    >
                      ×
                    </PhotoRemoveBtn>
                  </PhotoPreviewItem>
                ))}
              </PhotoPreviewGrid>
            )}
            
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
      }

      default:
        return null;
    }
  };

  const progress = (currentStep / 5) * 100;

  if (loadingVehicle) {
    return (
      <Container>
        <Header>
          <Title>{isEditMode ? 'Editar anúncio' : 'Anuncie Seu Veículo'}</Title>
          <Subtitle>Carregando...</Subtitle>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{isEditMode ? 'Editar anúncio' : 'Anuncie Seu Veículo'}</Title>
        <Subtitle>
          {isEditMode ? 'Atualize as informações do seu veículo.' : 'Compartilhe seu veículo e comece a ganhar dinheiro. É fácil começar!'}
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
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleModalClose} 
        initialMode={authModalMode}
        redirectOnSuccess={null}
      />
    </Container>
  );
};

export default ListVehiclePage;
