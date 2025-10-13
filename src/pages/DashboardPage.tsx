import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GovBrIntegration from '../components/GovBrIntegration';
import VehicleRegistrationForm from '../components/VehicleRegistrationForm';
import { vehicleService } from '../services/authService';
import { Car, Calendar, Lock } from '../components/IconSystem';

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

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!userData.id) {
      window.location.href = '/login';
      return;
    }
    
    setUser(userData);
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate loading dashboard data
      setTimeout(() => {
        setVehicles([
          {
            id: 'CAR001',
            title: 'Toyota Corolla 2022',
            dailyRate: 150,
            status: 'available',
            totalBookings: 12,
            totalEarnings: 1800
          }
        ]);
        
        setBookings([
          {
            id: 'BK001',
            car: { title: 'Toyota Corolla 2022' },
            startDate: '2024-01-15',
            endDate: '2024-01-17',
            totalAmount: 450,
            status: 'confirmed'
          }
        ]);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: <Car size={20} color="#333" /> },
    { id: 'vehicles', label: 'Meus Veículos', icon: <Car size={20} color="#333" /> },
    { id: 'bookings', label: 'Reservas', icon: <Calendar size={20} color="#333" /> },
    { id: 'verification', label: 'Verificação', icon: <Lock size={20} color="#333" /> },
  ];

  if (loading) {
    return (
      <Container>
        <Title>Carregando painel...</Title>
      </Container>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2>Welcome back, {user?.firstName}!</h2>
            <p>Here's an overview of your account activity.</p>
            
            <StatsGrid>
              <StatCard>
                <StatNumber>{vehicles.length}</StatNumber>
                <StatLabel>Veículos Anunciados</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>0</StatNumber>
                <StatLabel>Reservas Ativas</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>R$ 0</StatNumber>
                <StatLabel>Ganhos Totais</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>4.8</StatNumber>
                <StatLabel>Avaliação Média</StatLabel>
              </StatCard>
            </StatsGrid>
          </div>
        );

      case 'vehicles':
        return (
          <div>
            <h2><Car size={20} /> Meus Veículos</h2>
            {vehicles.length > 0 ? (
              <div>
                <p>Você tem {vehicles.length} veículo(s) anunciado(s).</p>
                {/* Vehicle list would go here */}
              </div>
            ) : (
              <div>
                <p>Você ainda não anunciou nenhum veículo.</p>
                <VehicleRegistrationForm />
              </div>
            )}
          </div>
        );

      case 'bookings':
        return (
          <div>
            <h2><Calendar size={20} /> Reservas</h2>
            <p>Seu histórico de reservas e ferramentas de gerenciamento serão exibidos aqui.</p>
          </div>
        );

      case 'verification':
        return (
          <div>
            <h2><Lock size={20} /> Verificação de Conta</h2>
            <p>Complete a verificação da sua conta para começar a alugar seus veículos.</p>
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
    </Container>
  );
};

export default DashboardPage;
