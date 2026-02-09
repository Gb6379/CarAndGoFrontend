import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BookingInterface from '../components/BookingInterface';
import { vehicleService } from '../services/authService';
import { Car } from '../components/IconSystem';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1.5rem 2rem;
  border-radius: 10px;
  max-width: 500px;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const LoginPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1.5rem;
  text-align: center;
`;

const LoginMessage = styled.div`
  background: #fff3e0;
  color: #e65100;
  padding: 1.5rem 2rem;
  border-radius: 10px;
  max-width: 500px;
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const vehicleId = searchParams.get('vehicleId');
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const startTime = searchParams.get('startTime') || '10:00';
  const endTime = searchParams.get('endTime') || '10:00';

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!user.id;

  useEffect(() => {
    const loadVehicle = async () => {
      if (!vehicleId) {
        setError('Nenhum veículo selecionado. Por favor, selecione um veículo primeiro.');
        setLoading(false);
        return;
      }

      try {
        const vehicleData = await vehicleService.getVehicle(vehicleId);
        setVehicle(vehicleData);
      } catch (err: any) {
        console.error('Error loading vehicle:', err);
        setError('Não foi possível carregar os dados do veículo. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [vehicleId]);

  const handleBookingSuccess = (booking: any) => {
    navigate(`/payment?bookingId=${booking.id}`);
  };

  const handleLogin = () => {
    // Store the current URL to redirect back after login
    localStorage.setItem('redirectAfterLogin', window.location.href);
    navigate('/login');
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
          <p>Carregando dados do veículo...</p>
        </LoadingContainer>
      </Container>
    );
  }

  if (!isLoggedIn) {
    return (
      <Container>
        <LoginPrompt>
          <Car size={48} color="#667eea" />
          <h2>Faça login para continuar</h2>
          <LoginMessage>
            Para fazer uma reserva, você precisa estar logado na sua conta.
          </LoginMessage>
          <LoginButton onClick={handleLogin}>
            Entrar na Conta
          </LoginButton>
          <BackButton onClick={() => navigate(-1)}>
            Voltar
          </BackButton>
        </LoginPrompt>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <Car size={48} color="#c62828" />
          <ErrorMessage>{error}</ErrorMessage>
          <BackButton onClick={() => navigate('/vehicles')}>
            Ver Veículos Disponíveis
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  if (!vehicle) {
    return (
      <Container>
        <ErrorContainer>
          <Car size={48} color="#c62828" />
          <ErrorMessage>Veículo não encontrado.</ErrorMessage>
          <BackButton onClick={() => navigate('/vehicles')}>
            Ver Veículos Disponíveis
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <BookingInterface 
        vehicle={vehicle} 
        onBookingSuccess={handleBookingSuccess}
        initialStartDate={startDate}
        initialEndDate={endDate}
        initialStartTime={startTime}
        initialEndTime={endTime}
      />
    </Container>
  );
};

export default BookingPage;
