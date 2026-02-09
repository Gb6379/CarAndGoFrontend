import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FavoriteBorder } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import GovBrIntegration from '../components/GovBrIntegration';
import VehicleRegistrationForm from '../components/VehicleRegistrationForm';
import { vehicleService, bookingService, favoriteService } from '../services/authService';
import { getFavorites } from '../utils/favorites';
import { Car, Calendar, Lock, LocationOn, User } from '../components/IconSystem';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
`;

const FavoriteCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s;
  cursor: pointer;
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const FavoriteCardImage = styled.div`
  height: 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
`;

const FavoriteCardBody = styled.div`
  padding: 1rem;
`;

const FavoriteCardTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.35rem;
`;

const FavoriteCardMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const FavoriteCardPrice = styled.div`
  font-weight: 700;
  color: #667eea;
  font-size: 1rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ModalCloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  &:hover { color: #333; }
`;

const ModalBody = styled.div`
  padding: 1.25rem 1.5rem;
`;

const ModalAddress = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  border-left: 4px solid #667eea;
`;

const ModalAddressLine = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  & + & { margin-top: 0.25rem; font-size: 0.95rem; color: #555; }
`;

const ModalMapWrap = styled.div`
  height: 220px;
  border-radius: 8px;
  overflow: hidden;
  .leaflet-container { height: 100%; width: 100%; }
`;

const BookingCard = styled.div`
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
`;

const BookingCardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
`;

const BookingCardLink = styled.span`
  color: #667eea;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  &:hover { text-decoration: underline; }
`;

const MyVehiclesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
`;

const MyVehicleCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
`;

const MyVehicleCardTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.35rem;
`;

const MyVehicleCardMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const MyVehicleCardPrice = styled.div`
  font-weight: 700;
  color: #667eea;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const MyVehicleCardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const MyVehicleCardBtn = styled.button<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #ddd;
  background: ${p => p.$primary ? '#667eea' : 'white'};
  color: ${p => p.$primary ? 'white' : '#333'};
  &:hover {
    background: ${p => p.$primary ? '#5a6fd8' : '#f8f9fa'};
  }
`;

const LesseeProfileRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  &:last-child { border-bottom: none; }
`;

const LesseeProfileLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const LesseeProfileValue = styled.span`
  font-size: 1rem;
  color: #333;
  a { color: #667eea; text-decoration: none; &:hover { text-decoration: underline; } }
`;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'overview');
  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [favoriteVehicles, setFavoriteVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickupLocationBooking, setPickupLocationBooking] = useState<any>(null);
  const [lesseeProfileBooking, setLesseeProfileBooking] = useState<any>(null);

  // Abrir aba da URL (ex: /dashboard?tab=vehicles)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Check if user is a lessor (host, lessor, or both)
  const isLessor = user?.userType === 'host' || user?.userType === 'lessor' || user?.userType === 'both';
  // Check if user is a lessee (rent, lessee, or both)
  const isLessee = user?.userType === 'rent' || user?.userType === 'lessee' || user?.userType === 'both';

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id) {
      window.location.href = '/login';
      return;
    }
    
    setUser(userData);
    loadDashboardData();
  }, []);

  // Recarregar favoritos ao abrir a aba Favoritos
  useEffect(() => {
    if (activeTab !== 'favorites' || !user?.id) return;
    const loadFav = async () => {
      let favList: any[] = [];
      try {
        const apiFavorites = await favoriteService.getFavorites();
        if (Array.isArray(apiFavorites) && apiFavorites.length > 0) {
          favList = apiFavorites.map((f: any) => f.vehicle || f).filter(Boolean);
        }
      } catch {
        //
      }
      if (favList.length === 0) {
        const localIds = getFavorites();
        if (localIds.length > 0) {
          const vehiclesFromLocal = await Promise.all(
            localIds.map((vehicleId: string) => vehicleService.getVehicle(vehicleId).catch(() => null))
          );
          favList = vehiclesFromLocal.filter(Boolean);
        }
      }
      setFavoriteVehicles(favList);
    };
    loadFav();
  }, [activeTab, user?.id]);

  const loadDashboardData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Load real bookings from backend
      const allBookings = await bookingService.getBookings();
      
      console.log('All bookings from API:', allBookings);
      console.log('Current user ID:', userData.id);
      
      // Show all bookings for now (filter on display side)
      setBookings(allBookings);

      // Load vehicles for lessors
      if (userData.userType === 'host' || userData.userType === 'lessor' || userData.userType === 'both') {
        try {
          const userVehicles = await vehicleService.getAllVehicles();
          const filteredVehicles = userVehicles.filter((v: any) => v.ownerId === userData.id || v.owner?.id === userData.id);
          setVehicles(filteredVehicles);
        } catch {
          setVehicles([]);
        }
      }

      // Load favorites: API (logged-in) e fallback para localStorage
      let favList: any[] = [];
      try {
        const apiFavorites = await favoriteService.getFavorites();
        if (Array.isArray(apiFavorites) && apiFavorites.length > 0) {
          favList = apiFavorites.map((f: any) => f.vehicle || f).filter(Boolean);
        }
      } catch {
        // API falhou (ex.: 401 ou tabela não existe)
      }
      if (favList.length === 0) {
        const localIds = getFavorites();
        if (localIds.length > 0) {
          const vehiclesFromLocal = await Promise.all(
            localIds.map((vehicleId: string) => vehicleService.getVehicle(vehicleId).catch(() => null))
          );
          favList = vehiclesFromLocal.filter(Boolean);
        }
      }
      setFavoriteVehicles(favList);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  // Build tabs based on user type
  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'Visão Geral', icon: <Car size={20} color="#333" /> },
    ];

    // Only show "Meus Veículos" for lessors
    if (isLessor) {
      baseTabs.push({ id: 'vehicles', label: 'Meus Veículos', icon: <Car size={20} color="#333" /> });
    }

    baseTabs.push({ id: 'bookings', label: 'Reservas', icon: <Calendar size={20} color="#333" /> });
    baseTabs.push({ id: 'favorites', label: 'Favoritos', icon: <FavoriteBorder sx={{ fontSize: 20 }} /> });
    baseTabs.push({ id: 'verification', label: 'Verificação', icon: <Lock size={20} color="#333" /> });

    return baseTabs;
  };

  const tabs = getTabs();

  if (loading) {
    return (
      <Container>
        <Title>Carregando painel...</Title>
      </Container>
    );
  }

  // Calculate stats from real bookings
  const lesseeBookingsAll = bookings.filter((b: any) => 
    b.lesseeId === user?.id || b.lessee?.id === user?.id
  );
  const lessorBookingsAll = bookings.filter((b: any) => 
    b.lessorId === user?.id || b.lessor?.id === user?.id
  );
  
  const activeStatuses = ['pending', 'confirmed', 'active'];
  const activeLesseeBookings = lesseeBookingsAll.filter((b: any) => activeStatuses.includes(b.status?.toLowerCase()));
  const activeLessorBookings = lessorBookingsAll.filter((b: any) => activeStatuses.includes(b.status?.toLowerCase()));
  
  const totalSpent = lesseeBookingsAll.reduce((sum: number, b: any) => {
    const amount = typeof b.totalAmount === 'number' ? b.totalAmount : parseFloat(b.totalAmount) || 0;
    return sum + amount;
  }, 0);
  
  const totalEarnings = lessorBookingsAll.reduce((sum: number, b: any) => {
    const amount = typeof b.lessorAmount === 'number' ? b.lessorAmount : parseFloat(b.lessorAmount) || 0;
    return sum + amount;
  }, 0);

  // Render stats for lessee (renter)
  const renderLesseeStats = () => (
    <StatsGrid>
      <StatCard>
        <StatNumber>{lesseeBookingsAll.length}</StatNumber>
        <StatLabel>Reservas Realizadas</StatLabel>
      </StatCard>
      <StatCard>
        <StatNumber>{activeLesseeBookings.length}</StatNumber>
        <StatLabel>Reservas Ativas</StatLabel>
      </StatCard>
      <StatCard>
        <StatNumber>R$ {totalSpent.toFixed(2)}</StatNumber>
        <StatLabel>Total Gasto</StatLabel>
      </StatCard>
      <StatCard>
        <StatNumber>{favoriteVehicles.length}</StatNumber>
        <StatLabel>Carros Favoritos</StatLabel>
      </StatCard>
    </StatsGrid>
  );

  // Render stats for lessor (host)
  const renderLessorStats = () => (
    <StatsGrid>
      <StatCard>
        <StatNumber>{vehicles.length}</StatNumber>
        <StatLabel>Veículos Anunciados</StatLabel>
      </StatCard>
      <StatCard>
        <StatNumber>{activeLessorBookings.length}</StatNumber>
        <StatLabel>Reservas Ativas</StatLabel>
      </StatCard>
      <StatCard>
        <StatNumber>R$ {totalEarnings.toFixed(2)}</StatNumber>
        <StatLabel>Ganhos Totais</StatLabel>
      </StatCard>
      <StatCard>
        <StatNumber>4.8</StatNumber>
        <StatLabel>Avaliação Média</StatLabel>
      </StatCard>
    </StatsGrid>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2>Bem-vindo(a) de volta, {user?.firstName}!</h2>
            <p>Aqui está um resumo da sua atividade na conta.</p>
            
            {/* Show different stats based on user type */}
            {user?.userType === 'both' ? (
              <>
                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#667eea' }}>Como Locatário</h3>
                {renderLesseeStats()}
                <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#764ba2' }}>Como Locador</h3>
                {renderLessorStats()}
              </>
            ) : isLessor ? (
              renderLessorStats()
            ) : (
              renderLesseeStats()
            )}
          </div>
        );

      case 'vehicles':
        return (
          <div>
            <h2><Car size={20} /> Meus Veículos</h2>
            {vehicles.length > 0 ? (
              <div>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>Você tem {vehicles.length} veículo(s) anunciado(s).</p>
                <MyVehiclesGrid>
                  {vehicles.map((v: any) => (
                    <MyVehicleCard key={v.id}>
                      <MyVehicleCardTitle>{v.make} {v.model} {v.year}</MyVehicleCardTitle>
                      <MyVehicleCardMeta>
                        {v.city}{v.state ? `, ${v.state}` : ''}
                        {v.licensePlate ? ` • ${v.licensePlate}` : ''}
                      </MyVehicleCardMeta>
                      <MyVehicleCardPrice>
                        R$ {typeof v.dailyRate === 'number' ? v.dailyRate.toFixed(2) : (parseFloat(v.dailyRate) || 0).toFixed(2)} / dia
                      </MyVehicleCardPrice>
                      <MyVehicleCardActions>
                        <MyVehicleCardBtn $primary onClick={() => navigate(`/vehicle/${v.id}`)}>
                          Ver anúncio
                        </MyVehicleCardBtn>
                        <MyVehicleCardBtn onClick={() => navigate(`/list-vehicle/edit/${v.id}`)}>
                          Editar
                        </MyVehicleCardBtn>
                      </MyVehicleCardActions>
                    </MyVehicleCard>
                  ))}
                </MyVehiclesGrid>
                <p style={{ marginTop: '1.5rem' }}>
                  <MyVehicleCardBtn $primary onClick={() => navigate('/list-vehicle')} style={{ display: 'inline-flex' }}>
                    + Anunciar outro veículo
                  </MyVehicleCardBtn>
                </p>
              </div>
            ) : (
              <div>
                <p style={{ color: '#666', marginBottom: '1rem' }}>Você ainda não anunciou nenhum veículo.</p>
                <VehicleRegistrationForm />
              </div>
            )}
          </div>
        );

      case 'bookings':
        const formatDate = (dateString: string | Date) => {
          const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
          return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        };

        const getStatusLabel = (status: string) => {
          const statusMap: { [key: string]: string } = {
            'pending': 'Pendente',
            'confirmed': 'Confirmada',
            'active': 'Em andamento',
            'awaiting_return': 'Aguardando Devolução',
            'completed': 'Concluída',
            'cancelled': 'Cancelada',
            'rejected': 'Rejeitada',
            'expired': 'Expirada'
          };
          return statusMap[status?.toLowerCase()] || status;
        };

        const getStatusColor = (status: string) => {
          const colorMap: { [key: string]: string } = {
            'pending': '#f59e0b',
            'confirmed': '#10b981',
            'awaiting_return': '#8b5cf6',
            'active': '#3b82f6',
            'completed': '#6b7280',
            'cancelled': '#ef4444',
            'rejected': '#ef4444',
            'expired': '#9ca3af'
          };
          return colorMap[status?.toLowerCase()] || '#6b7280';
        };

        // Filter bookings by role
        const lesseeBookings = bookings.filter((b: any) => 
          b.lesseeId === user?.id || b.lessee?.id === user?.id
        );
        const lessorBookings = bookings.filter((b: any) => 
          b.lessorId === user?.id || b.lessor?.id === user?.id
        );

        return (
          <div>
            <h2><Calendar size={20} /> Minhas Reservas</h2>
            
            {lesseeBookings.length === 0 && lessorBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>Você ainda não possui reservas.</p>
              </div>
            ) : (
              <>
                {lesseeBookings.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#333' }}>Reservas como Locatário</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {lesseeBookings.map((booking: any) => (
                        <BookingCard
                          key={booking.id}
                          onClick={() => booking.vehicle && setPickupLocationBooking(booking)}
                          style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                          }}
                        >
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                              {booking.vehicle?.make || 'Veículo'} {booking.vehicle?.model || ''} {booking.vehicle?.year || ''}
                            </div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </div>
                            <BookingCardActions>
                              <BookingCardLink
                                onClick={(e) => { e.stopPropagation(); navigate(`/booking/${booking.id}/details`); }}
                              >
                                Ver detalhes
                              </BookingCardLink>
                              {booking.vehicle && (
                                <BookingCardLink onClick={(e) => { e.stopPropagation(); setPickupLocationBooking(booking); }}>
                                  <LocationOn size={14} />
                                  Ver local de retirada
                                </BookingCardLink>
                              )}
                            </BookingCardActions>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '20px', 
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              background: `${getStatusColor(booking.status)}20`,
                              color: getStatusColor(booking.status),
                              marginBottom: '0.5rem'
                            }}>
                              {getStatusLabel(booking.status)}
                            </div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                              R$ {typeof booking.totalAmount === 'number' ? booking.totalAmount.toFixed(2) : (parseFloat(booking.totalAmount) || 0).toFixed(2)}
                            </div>
                          </div>
                        </BookingCard>
                      ))}
                    </div>
                  </div>
                )}
                
                {lessorBookings.length > 0 && (
                  <div>
                    <h3 style={{ marginBottom: '1rem', color: '#333' }}>Reservas dos Meus Veículos</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {lessorBookings.map((booking: any) => (
                        <BookingCard
                          key={booking.id}
                          onClick={() => booking.vehicle && setPickupLocationBooking(booking)}
                          style={{
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                          }}
                        >
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                              {booking.vehicle?.make || 'Veículo'} {booking.vehicle?.model || ''} {booking.vehicle?.year || ''}
                            </div>
                            <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                              Locatário: {booking.lessee?.firstName || booking.lessee?.name || 'N/A'}
                            </div>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </div>
                            <BookingCardActions>
                              <BookingCardLink
                                onClick={(e) => { e.stopPropagation(); navigate(`/booking/${booking.id}/details`); }}
                              >
                                Ver detalhes
                              </BookingCardLink>
                              {booking.lessee && (
                                <BookingCardLink onClick={(e) => { e.stopPropagation(); setLesseeProfileBooking(booking); }}>
                                  <User size={14} />
                                  Ver perfil do locatário
                                </BookingCardLink>
                              )}
                              {booking.vehicle && (
                                <BookingCardLink onClick={(e) => { e.stopPropagation(); setPickupLocationBooking(booking); }}>
                                  <LocationOn size={14} />
                                  Ver local de retirada
                                </BookingCardLink>
                              )}
                            </BookingCardActions>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ 
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '20px', 
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              background: `${getStatusColor(booking.status)}20`,
                              color: getStatusColor(booking.status),
                              marginBottom: '0.5rem'
                            }}>
                              {getStatusLabel(booking.status)}
                            </div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                              R$ {typeof booking.totalAmount === 'number' ? booking.totalAmount.toFixed(2) : (parseFloat(booking.totalAmount) || 0).toFixed(2)}
                            </div>
                          </div>
                        </BookingCard>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'favorites':
        return (
          <div>
            <h2><FavoriteBorder sx={{ fontSize: 24, verticalAlign: 'middle', marginRight: 8 }} /> Meus Favoritos</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Veículos que você salvou para ver depois.
            </p>
            {favoriteVehicles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <FavoriteBorder sx={{ fontSize: 64, color: '#ddd', marginBottom: '1rem' }} />
                <p>Você ainda não tem carros favoritos.</p>
                <p style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>
                  Explore os veículos e clique no coração para salvar seus favoritos.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/vehicles')}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Ver veículos
                </button>
              </div>
            ) : (
              <FavoritesGrid>
                {favoriteVehicles.map((vehicle: any) => (
                  <FavoriteCard key={vehicle.id} onClick={() => navigate(`/vehicle/${vehicle.id}`)}>
                    <FavoriteCardImage>
                      <Car size={48} color="white" />
                    </FavoriteCardImage>
                    <FavoriteCardBody>
                      <FavoriteCardTitle>{vehicle.make} {vehicle.model} {vehicle.year}</FavoriteCardTitle>
                      <FavoriteCardMeta>
                        {vehicle.city}, {vehicle.state}
                      </FavoriteCardMeta>
                      <FavoriteCardPrice>
                        R$ {typeof vehicle.dailyRate === 'number' ? vehicle.dailyRate.toFixed(2) : (parseFloat(vehicle.dailyRate) || 0).toFixed(2)} por dia
                      </FavoriteCardPrice>
                    </FavoriteCardBody>
                  </FavoriteCard>
                ))}
              </FavoritesGrid>
            )}
          </div>
        );

      case 'verification':
        return (
          <div>
            <h2><Lock size={20} /> Verificação de Conta</h2>
            <p>Complete a verificação da sua conta para {isLessor ? 'começar a alugar seus veículos' : 'realizar reservas'}.</p>
            <GovBrIntegration />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <Title><Car size={24} /> Painel</Title>
      
      <TabContainer>
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </Tab>
        ))}
      </TabContainer>

      <TabContent>
        {renderTabContent()}
      </TabContent>

      {pickupLocationBooking?.vehicle && (
        <ModalOverlay onClick={() => setPickupLocationBooking(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <LocationOn size={22} />
                Local de retirada
              </ModalTitle>
              <ModalCloseBtn type="button" onClick={() => setPickupLocationBooking(null)} aria-label="Fechar">
                ×
              </ModalCloseBtn>
            </ModalHeader>
            <ModalBody>
              <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#333' }}>
                {pickupLocationBooking.vehicle.make} {pickupLocationBooking.vehicle.model} {pickupLocationBooking.vehicle.year}
              </p>
              <ModalAddress>
                <ModalAddressLine>{pickupLocationBooking.vehicle.address}</ModalAddressLine>
                <ModalAddressLine>
                  {pickupLocationBooking.vehicle.city}
                  {pickupLocationBooking.vehicle.state ? `, ${pickupLocationBooking.vehicle.state}` : ''}
                </ModalAddressLine>
              </ModalAddress>
              {pickupLocationBooking.vehicle.latitude != null && pickupLocationBooking.vehicle.longitude != null && (
                <ModalMapWrap>
                  <MapContainer
                    center={[Number(pickupLocationBooking.vehicle.latitude), Number(pickupLocationBooking.vehicle.longitude)]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[Number(pickupLocationBooking.vehicle.latitude), Number(pickupLocationBooking.vehicle.longitude)]} />
                  </MapContainer>
                </ModalMapWrap>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {lesseeProfileBooking?.lessee && (
        <ModalOverlay onClick={() => setLesseeProfileBooking(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <ModalHeader>
              <ModalTitle>
                <User size={22} />
                Perfil do locatário
              </ModalTitle>
              <ModalCloseBtn type="button" onClick={() => setLesseeProfileBooking(null)} aria-label="Fechar">
                ×
              </ModalCloseBtn>
            </ModalHeader>
            <ModalBody>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#333', fontSize: '1.1rem' }}>
                {lesseeProfileBooking.vehicle?.make} {lesseeProfileBooking.vehicle?.model} {lesseeProfileBooking.vehicle?.year}
              </p>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#666' }}>
                Retirada: {formatDate(lesseeProfileBooking.startDate)} – {formatDate(lesseeProfileBooking.endDate)}
              </p>
              <LesseeProfileRow>
                <LesseeProfileLabel>Nome</LesseeProfileLabel>
                <LesseeProfileValue>
                  {([lesseeProfileBooking.lessee.firstName, lesseeProfileBooking.lessee.lastName].filter(Boolean).join(' ')) || '—'}
                </LesseeProfileValue>
              </LesseeProfileRow>
              <LesseeProfileRow>
                <LesseeProfileLabel>E-mail</LesseeProfileLabel>
                <LesseeProfileValue>
                  {lesseeProfileBooking.lessee.email ? (
                    <a href={`mailto:${lesseeProfileBooking.lessee.email}`}>{lesseeProfileBooking.lessee.email}</a>
                  ) : (
                    '—'
                  )}
                </LesseeProfileValue>
              </LesseeProfileRow>
              <LesseeProfileRow>
                <LesseeProfileLabel>Telefone</LesseeProfileLabel>
                <LesseeProfileValue>
                  {lesseeProfileBooking.lessee.phone ? (
                    <a href={`tel:${lesseeProfileBooking.lessee.phone}`}>{lesseeProfileBooking.lessee.phone}</a>
                  ) : (
                    '—'
                  )}
                </LesseeProfileValue>
              </LesseeProfileRow>
              <LesseeProfileRow>
                <LesseeProfileLabel>Cidade / Estado</LesseeProfileLabel>
                <LesseeProfileValue>
                  {[lesseeProfileBooking.lessee.city, lesseeProfileBooking.lessee.state].filter(Boolean).join(', ') || '—'}
                </LesseeProfileValue>
              </LesseeProfileRow>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default DashboardPage;
