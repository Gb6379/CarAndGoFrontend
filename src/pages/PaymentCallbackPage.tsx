import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { bookingService } from '../services/authService';
import { Check, ArrowLeft } from '../components/IconSystem';

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 3rem 2rem;
  text-align: center;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    opacity: 0.95;
  }
`;

const PaymentCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando pagamento...');

  useEffect(() => {
    if (!bookingId) {
      setStatus('error');
      setMessage('Reserva não identificada.');
      return;
    }
    const check = async () => {
      try {
        const booking = await bookingService.getBooking(bookingId);
        const paid = booking?.paymentStatus === 'paid' || String(booking?.paymentStatus).toLowerCase() === 'paid';
        const pending = booking?.paymentStatus === 'pending' || String(booking?.paymentStatus).toLowerCase() === 'pending';
        if (paid) {
          setStatus('success');
          setMessage('Pagamento confirmado! Sua reserva está confirmada.');
        } else if (pending) {
          setStatus('pending');
          setMessage('Pagamento em processamento. Em instantes sua reserva será confirmada.');
        } else {
          setStatus('success');
          setMessage('Você retornou do PagSeguro. Verifique o status da reserva nos detalhes.');
        }
      } catch {
        setStatus('error');
        setMessage('Não foi possível verificar o pagamento. Tente ver os detalhes da reserva.');
      }
    };
    check();
  }, [bookingId]);

  if (status === 'loading') {
    return (
      <Container>
        <Spinner />
        <Title>Processando</Title>
        <Message>{message}</Message>
      </Container>
    );
  }

  return (
    <Container>
      {status === 'success' && <Check size={48} color="#10b981" style={{ marginBottom: '1rem' }} />}
      <Title>{status === 'error' ? 'Atenção' : status === 'pending' ? 'Quase lá' : 'Pagamento confirmado'}</Title>
      <Message>{message}</Message>
      <BackButton onClick={() => navigate(bookingId ? `/booking/${bookingId}/details` : '/dashboard')}>
        <ArrowLeft size={20} /> Ver detalhes da reserva
      </BackButton>
    </Container>
  );
};

export default PaymentCallbackPage;
