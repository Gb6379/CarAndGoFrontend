import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BookingInterface from '../components/BookingInterface';
import { vehicleService } from '../services/authService';
import { Car } from '../components/IconSystem';
import { errorToDisplay } from '../utils/errorUtils';
import modernTheme from '../styles/modernTheme';
import {
  errorNoticeCss,
  pageShellCss,
  primaryButtonCss,
  secondaryButtonCss,
  titleCss,
} from '../styles/modernPrimitives';

const Container = styled.div`
  ${pageShellCss}
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
  border-top: 4px solid #F6885C;
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
  ${errorNoticeCss}
  padding: 1.5rem 2rem;
  max-width: 500px;
`;

const BackButton = styled.button`
  ${secondaryButtonCss}
  color: ${modernTheme.colors.inkSoft};
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
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
  ${errorNoticeCss}
  color: ${modernTheme.colors.inkSoft};
  padding: 1.5rem 2rem;
  max-width: 500px;
`;

const LoginButton = styled.button`
  ${primaryButtonCss}
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
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
          <Car size={48} color="#F6885C" />
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
          <ErrorMessage>{errorToDisplay(error)}</ErrorMessage>
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
