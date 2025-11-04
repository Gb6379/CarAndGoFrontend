import React from 'react';
import styled from 'styled-components';
import {
  // Navigation & UI
  Search as SearchIcon,
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  Refresh as LoadingIcon,
  ExpandMore as ExpandIcon,
  
  // Vehicle & Transportation
  DirectionsCar as CarIcon,
  ElectricBolt as ElectricIcon,
  LocalGasStation as GasIcon,
  Speed as SpeedIcon,
  
  // Features & Amenities
  AcUnit as AirConditioningIcon,
  Bluetooth as BluetoothIcon,
  GpsFixed as GPSIcon,
  EventSeat as SeatIcon,
  Security as SecurityIcon,
  
  // Social & Communication
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  
  // Location & Places
  LocationCity as CityIcon,
  Home as HomeIcon,
  Business as BuildingIcon,
  Straighten as RoadIcon,
  
  // Actions & Status
  CameraAlt as CameraIcon,
  PhotoCamera as PhotoIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle as UserIcon,
  Edit as EditIcon,
  Smartphone as SmartphoneIcon,
  
  // Time & Calendar
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  
  // Safety & Security
  Shield as ShieldIcon,
  Security as SecurityIcon2,
  VerifiedUser as VerifiedIcon,
  
  // Payment & Money
  AttachMoney as MoneyIcon,
  CreditCard as CardIcon,
  Lock as LockIcon,
  VpnKey as KeyIcon,
  Star as StarIcon,
  
  // Communication
  Phone as PhoneIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  
  // Status & Feedback
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  
  // Navigation & Arrows
  ArrowForward as ArrowRightIcon,
  ArrowBack as ArrowLeftIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  
  // Map & Location
  Map as MapIcon,
  Place as PlaceIcon,
  NearMe as NearMeIcon,
  
  // Vehicle Features
  DirectionsCarFilled as CarFilledIcon,
  TwoWheeler as MotorcycleIcon,
  LocalShipping as TruckIcon,
  
  // Technology
  Wifi as WifiIcon,
  BatteryFull as BatteryIcon,
  Usb as UsbIcon,
  
  // Business & Services
  BusinessCenter as BusinessIcon,
  Store as StoreIcon,
  Restaurant as RestaurantIcon,
  BarChart as BarChartIcon,
  AccessTime as TimerIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  
  // Transportation
  DirectionsBus as BusIcon,
  Train as TrainIcon,
  Flight as FlightIcon,
  FlightTakeoff as FlightTakeoffIcon,
  FlightLand as FlightLandIcon,
  
  // Utilities
  Build as ToolsIcon,
  Handyman as HandymanIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';

const IconWrapper = styled.span<{ size?: number; color?: string; margin?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.size || 16}px;
  color: ${props => props.color || 'inherit'};
  margin: ${props => props.margin || '0'};
  line-height: 1;
`;

// Navigation & UI Icons
export const Search = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <SearchIcon fontSize="inherit" />
  </IconWrapper>
);

export const Location = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <LocationIcon fontSize="inherit" />
  </IconWrapper>
);

export const MyLocation = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <MyLocationIcon fontSize="inherit" />
  </IconWrapper>
);

export const Loading = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <LoadingIcon fontSize="inherit" />
  </IconWrapper>
);

export const Expand = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ExpandIcon fontSize="inherit" />
  </IconWrapper>
);

// Vehicle Icons
export const Car = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CarIcon style={{ fontSize: size }} />
  </IconWrapper>
);

export const Electric = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ElectricIcon fontSize="inherit" />
  </IconWrapper>
);

export const Gas = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <GasIcon fontSize="inherit" />
  </IconWrapper>
);

export const Speed = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <SpeedIcon fontSize="inherit" />
  </IconWrapper>
);

// Feature Icons
export const AirConditioning = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <AirConditioningIcon fontSize="inherit" />
  </IconWrapper>
);

export const Bluetooth = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <BluetoothIcon fontSize="inherit" />
  </IconWrapper>
);

export const GPS = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <GPSIcon fontSize="inherit" />
  </IconWrapper>
);

export const Seat = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <SeatIcon fontSize="inherit" />
  </IconWrapper>
);

export const Security = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <SecurityIcon fontSize="inherit" />
  </IconWrapper>
);

// Social Icons
export const Facebook = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <FacebookIcon fontSize="inherit" />
  </IconWrapper>
);

export const Instagram = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <InstagramIcon fontSize="inherit" />
  </IconWrapper>
);

export const Twitter = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <TwitterIcon fontSize="inherit" />
  </IconWrapper>
);

export const LinkedIn = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <LinkedInIcon fontSize="inherit" />
  </IconWrapper>
);

// Location Icons
export const City = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CityIcon fontSize="inherit" />
  </IconWrapper>
);

export const Home = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <HomeIcon fontSize="inherit" />
  </IconWrapper>
);

export const Building = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <BuildingIcon fontSize="inherit" />
  </IconWrapper>
);

export const Road = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <RoadIcon fontSize="inherit" />
  </IconWrapper>
);

// Additional Location Icons
export const LocationOn = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <LocationIcon fontSize="inherit" />
  </IconWrapper>
);

export const CameraAlt = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CameraIcon fontSize="inherit" />
  </IconWrapper>
);

export const CheckCircle = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CheckIcon fontSize="inherit" />
  </IconWrapper>
);

export const CalendarToday = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CalendarIcon fontSize="inherit" />
  </IconWrapper>
);

export const Edit = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <EditIcon fontSize="inherit" />
  </IconWrapper>
);

export const Smartphone = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <SmartphoneIcon fontSize="inherit" />
  </IconWrapper>
);

export const AttachMoney = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <MoneyIcon fontSize="inherit" />
  </IconWrapper>
);

export const Lock = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <LockIcon style={{ fontSize: size }} />
  </IconWrapper>
);

export const CreditCard = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CardIcon fontSize="inherit" />
  </IconWrapper>
);

export const Key = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <KeyIcon fontSize="inherit" />
  </IconWrapper>
);

export const Star = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <StarIcon fontSize="inherit" />
  </IconWrapper>
);

// Action Icons
export const Camera = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CameraIcon fontSize="inherit" />
  </IconWrapper>
);

export const Photo = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <PhotoIcon fontSize="inherit" />
  </IconWrapper>
);

export const Settings = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <SettingsIcon fontSize="inherit" />
  </IconWrapper>
);

export const Menu = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <MenuIcon style={{ fontSize: size }} />
  </IconWrapper>
);

export const Close = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CloseIcon style={{ fontSize: size }} />
  </IconWrapper>
);

export const User = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <UserIcon style={{ fontSize: size }} />
  </IconWrapper>
);

// Time Icons
export const Calendar = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CalendarIcon style={{ fontSize: size }} />
  </IconWrapper>
);

export const Schedule = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ScheduleIcon fontSize="inherit" />
  </IconWrapper>
);

// Safety Icons
export const Shield = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ShieldIcon fontSize="inherit" />
  </IconWrapper>
);

export const Verified = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <VerifiedIcon fontSize="inherit" />
  </IconWrapper>
);

// Payment Icons
export const Money = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <MoneyIcon fontSize="inherit" />
  </IconWrapper>
);

export const Card = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CardIcon fontSize="inherit" />
  </IconWrapper>
);

// Communication Icons
export const Phone = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <PhoneIcon fontSize="inherit" />
  </IconWrapper>
);

export const Email = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <EmailIcon fontSize="inherit" />
  </IconWrapper>
);

export const Message = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <MessageIcon fontSize="inherit" />
  </IconWrapper>
);

// Status Icons
export const Check = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CheckIcon fontSize="inherit" />
  </IconWrapper>
);

export const Error = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ErrorIcon fontSize="inherit" />
  </IconWrapper>
);

export const Warning = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <WarningIcon fontSize="inherit" />
  </IconWrapper>
);

export const Info = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <InfoIcon fontSize="inherit" />
  </IconWrapper>
);

// Navigation Icons
export const ArrowRight = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ArrowRightIcon style={{ fontSize: size }} />
  </IconWrapper>
);

export const FlightTakeoff = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <FlightTakeoffIcon style={{ fontSize: size }} />
  </IconWrapper>
);

export const FlightLand = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <FlightLandIcon style={{ fontSize: size }} />
  </IconWrapper>
);

export const BarChart = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <BarChartIcon style={{ fontSize: size }} />
  </IconWrapper>
);

export const Timer = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <TimerIcon fontSize="inherit" />
  </IconWrapper>
);

export const TrendingUp = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <TrendingUpIcon fontSize="inherit" />
  </IconWrapper>
);

export const People = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <PeopleIcon fontSize="inherit" />
  </IconWrapper>
);

export const Payment = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <PaymentIcon fontSize="inherit" />
  </IconWrapper>
);

export const ArrowLeft = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ArrowLeftIcon fontSize="inherit" />
  </IconWrapper>
);

export const ArrowDown = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ArrowDownIcon style={{ fontSize: size }} />
  </IconWrapper>
);

export const ArrowUp = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ArrowUpIcon fontSize="inherit" />
  </IconWrapper>
);

// Map Icons
export const Map = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <MapIcon fontSize="inherit" />
  </IconWrapper>
);

export const Place = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <PlaceIcon fontSize="inherit" />
  </IconWrapper>
);

export const NearMe = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <NearMeIcon fontSize="inherit" />
  </IconWrapper>
);

// Vehicle Type Icons
export const CarFilled = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <CarFilledIcon fontSize="inherit" />
  </IconWrapper>
);

export const Motorcycle = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <MotorcycleIcon fontSize="inherit" />
  </IconWrapper>
);

export const Truck = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <TruckIcon fontSize="inherit" />
  </IconWrapper>
);

// Technology Icons
export const Wifi = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <WifiIcon fontSize="inherit" />
  </IconWrapper>
);

export const Battery = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <BatteryIcon fontSize="inherit" />
  </IconWrapper>
);

export const Usb = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <UsbIcon fontSize="inherit" />
  </IconWrapper>
);

// Business Icons
export const Business = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <BusinessIcon fontSize="inherit" />
  </IconWrapper>
);

export const Store = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <StoreIcon fontSize="inherit" />
  </IconWrapper>
);

export const Restaurant = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <RestaurantIcon fontSize="inherit" />
  </IconWrapper>
);

// Transportation Icons
export const Bus = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <BusIcon fontSize="inherit" />
  </IconWrapper>
);

export const Train = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <TrainIcon fontSize="inherit" />
  </IconWrapper>
);

export const Flight = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <FlightIcon fontSize="inherit" />
  </IconWrapper>
);

// Utility Icons
export const Tools = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ToolsIcon fontSize="inherit" />
  </IconWrapper>
);

export const Handyman = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <HandymanIcon fontSize="inherit" />
  </IconWrapper>
);

export const Construction = ({ size = 16, color, margin }: { size?: number; color?: string; margin?: string }) => (
  <IconWrapper size={size} color={color} margin={margin}>
    <ConstructionIcon fontSize="inherit" />
  </IconWrapper>
);
