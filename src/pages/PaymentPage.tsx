import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { bookingService, paymentService } from '../services/authService';
import { Car, CreditCard, Calendar, Check, ArrowLeft } from '../components/IconSystem';
import { getErrorMessage, errorToDisplay } from '../utils/errorUtils';
import modernTheme from '../styles/modernTheme';
import {
  errorNoticeCss,
  glassPanelCss,
  pageShellCss,
  primaryButtonCss,
  secondaryButtonCss,
  successNoticeCss,
  titleCss,
} from '../styles/modernPrimitives';

const Container = styled.div`
  ${pageShellCss}
  min-height: calc(100vh - 200px);
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${secondaryButtonCss}
  color: ${modernTheme.colors.inkSoft};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  transition: color 0.2s;

  &:hover {
    color: ${modernTheme.colors.ink};
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const PageTitle = styled.h1`
  ${titleCss}
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 640px) {
    font-size: 1.5rem;
    gap: 0.5rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 640px) {
    gap: 1.25rem;
  }
`;

const MainCard = styled.div`
  ${glassPanelCss}
  padding: 1.5rem;

  @media (max-width: 640px) {
    padding: 1.1rem;
  }
`;

const SummaryCard = styled(MainCard)`
  height: fit-content;
`;

const CheckoutInfo = styled.div`
  color: ${modernTheme.colors.muted};
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const PayButton = styled.button`
  ${primaryButtonCss}
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.primary {
    color: white;
  }
`;

const SummaryTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${modernTheme.colors.ink};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.95rem;
  color: ${modernTheme.colors.muted};

  strong {
    color: ${modernTheme.colors.ink};
  }

  @media (max-width: 520px) {
    flex-direction: column;
    gap: 0.2rem;
  }
`;

const SummaryTotal = styled(SummaryRow)`
  margin-top: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  font-size: 1.1rem;
  font-weight: 700;
  color: ${modernTheme.colors.brandStrong};
`;

const VehicleLine = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${modernTheme.colors.ink};
  margin-bottom: 0.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1rem;
  color: ${modernTheme.colors.muted};
`;

const ErrorMessage = styled.div`
  ${errorNoticeCss}
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  ${successNoticeCss}
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const formatDate = (d: string) => {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

type PaymentState = {
  bookingPayload: any;
  vehicle: any;
  bookingSummary: { totalAmount: number; baseAmount?: number; platformFee?: number; securityDeposit?: number; totalDays?: number; totalHours?: number };
};

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentState | null;
  const bookingIdFromUrl = searchParams.get('bookingId');

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(!!bookingIdFromUrl && !state);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fluxo 1: veio do formulário de reserva (state) → reserva será criada só após pagamento
  const isNewBookingFlow = !!state?.bookingPayload;
  // Fluxo 2: veio com bookingId na URL → reserva já existe, só pagar
  const existingBookingId = bookingIdFromUrl;

  useEffect(() => {
    if (isNewBookingFlow) {
      setLoading(false);
      return;
    }
    if (!existingBookingId) {
      setError('Nenhuma reserva informada. Preencha os dados na tela de reserva.');
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const data = await bookingService.getBooking(existingBookingId);
        setBooking(data);
      } catch {
        setError('Reserva não encontrada.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [existingBookingId, isNewBookingFlow]);

  const handlePay = async () => {
    setError('');
    setPaying(true);
    try {
      let bookingId: string;

      if (isNewBookingFlow && state?.bookingPayload) {
        const newBooking = await bookingService.createBooking(state.bookingPayload);
        bookingId = newBooking?.id;
        if (!bookingId) {
          setError('Erro ao criar a reserva. Tente novamente.');
          setPaying(false);
          return;
        }
      } else if (booking?.id) {
        bookingId = booking.id;
      } else {
        setError('Dados da reserva não encontrados.');
        setPaying(false);
        return;
      }

      // No checkout hospedado (Mercado Pago/PagBank), os métodos são escolhidos na página do gateway.
      const response = await paymentService.pay(bookingId, 'pix');

      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      setSuccess(response?.message || 'Pagamento aprovado! Redirecionando...');
      setTimeout(() => {
        navigate(`/booking/${bookingId}/details`);
      }, 1500);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Erro ao processar pagamento. Tente novamente.'));
    } finally {
      setPaying(false);
    }
  };

  const total = isNewBookingFlow && state?.bookingSummary
    ? Number(state.bookingSummary.totalAmount)
    : (typeof booking?.totalAmount === 'number' ? booking.totalAmount : parseFloat(booking?.totalAmount) || 0);
  const vehicle = isNewBookingFlow && state?.vehicle ? state.vehicle : (booking?.vehicle || {});
  const summaryForDisplay = isNewBookingFlow && state?.bookingSummary ? state.bookingSummary : null;
  const bookingForDisplay = booking;

  const startDateStr = booking?.startDate || state?.bookingPayload?.startDate;
  const endDateStr = booking?.endDate || state?.bookingPayload?.endDate;
  const baseAmountValue = summaryForDisplay?.baseAmount != null
    ? summaryForDisplay.baseAmount
    : (Number(booking?.dailyRate) * Math.ceil((new Date(endDateStr).getTime() - new Date(startDateStr).getTime()) / (1000 * 60 * 60 * 24)));
  const securityDepositValue = summaryForDisplay?.securityDeposit != null ? summaryForDisplay.securityDeposit : (Number(booking?.securityDeposit) || 0);
  const platformFeeValue = summaryForDisplay?.platformFee != null ? summaryForDisplay.platformFee : (Number(booking?.platformFee) || 0);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Carregando dados da reserva...</LoadingContainer>
      </Container>
    );
  }

  const canShowPayment = isNewBookingFlow ? !!state?.bookingPayload : !!booking;
  if (!canShowPayment) {
    return (
      <Container>
        <BackButton onClick={() => navigate(-1)}><ArrowLeft size={20} /> Voltar</BackButton>
        <ErrorMessage>{errorToDisplay(error) || 'Dados da reserva não encontrados. Preencha a reserva novamente.'}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Voltar
      </BackButton>

      <PageTitle>
        <CreditCard size={28} />
        Pagamento
      </PageTitle>

      {error && <ErrorMessage>{errorToDisplay(error)}</ErrorMessage>}
      {success && <SuccessMessage><Check size={20} /> {success}</SuccessMessage>}

      <Grid>
        <MainCard>
          <CheckoutInfo>
            Você será redirecionado para a página segura do gateway de pagamento para
            escolher a forma de pagamento (PIX, cartão e opções disponíveis).
          </CheckoutInfo>
          <PayButton className="primary" onClick={handlePay} disabled={paying}>
            {paying ? 'Processando...' : 'Ir para pagamento'}
          </PayButton>
        </MainCard>

        <SummaryCard>
          <SummaryTitle><Car size={20} /> Resumo da reserva</SummaryTitle>
          <VehicleLine>
            {vehicle.make} {vehicle.model} {vehicle.year}
          </VehicleLine>
          <SummaryRow>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={14} />
              Período
            </span>
            <strong>
              {formatDate(startDateStr || '')} - {formatDate(endDateStr || '')}
            </strong>
          </SummaryRow>
          <SummaryRow>
            <span>Valor base</span>
            <span>R$ {baseAmountValue.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Caução</span>
            <span>R$ {securityDepositValue.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Taxa da plataforma</span>
            <span>R$ {platformFeeValue.toFixed(2)}</span>
          </SummaryRow>
          <SummaryTotal>
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </SummaryTotal>
        </SummaryCard>
      </Grid>
    </Container>
  );
};

export default PaymentPage;
