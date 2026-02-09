import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { bookingService, paymentService } from '../services/authService';
import { Car, CreditCard, Calendar, Check, ArrowLeft } from '../components/IconSystem';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const MainCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #e5e7eb;
`;

const SummaryCard = styled(MainCard)`
  height: fit-content;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: 600;
  color: ${p => p.active ? '#667eea' : '#666'};
  border-bottom: 2px solid ${p => p.active ? '#667eea' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #667eea;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  label {
    display: block;
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
    }
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const PayButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover:not(:disabled) {
      opacity: 0.95;
      transform: translateY(-1px);
    }
  }

  &.pix {
    background: #32bcad;
    color: white;

    &:hover:not(:disabled) {
      background: #2aa89d;
      transform: translateY(-1px);
    }
  }
`;

const SummaryTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
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
  color: #666;

  strong {
    color: #1a1a1a;
  }
`;

const SummaryTotal = styled(SummaryRow)`
  margin-top: 0.75rem;
  padding-top: 1rem;
  border-top: 2px solid #e5e7eb;
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
`;

const VehicleLine = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const PixBox = styled.div`
  background: #f0fdfa;
  border: 2px dashed #32bcad;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const PixQrPlaceholder = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: #999;
`;

const PixCode = styled.code`
  display: block;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  word-break: break-all;
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
`;

const CopyButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #32bcad;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: #2aa89d;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background: #dcfce7;
  color: #166534;
  padding: 1rem;
  border-radius: 10px;
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
  const [method, setMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

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

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'number') v = value.replace(/\D/g, '').slice(0, 16);
    if (name === 'expiry') v = value.replace(/\D/g, '').slice(0, 4);
    if (name === 'cvv') v = value.replace(/\D/g, '').slice(0, 4);
    setCard(prev => ({ ...prev, [name]: v }));
  };

  const formatExpiry = (val: string) => {
    if (val.length >= 2) return val.slice(0, 2) + '/' + val.slice(2);
    return val;
  };

  const handlePay = async () => {
    // PIX: sem validação extra. Cartão: no modo real (PagSeguro) o usuário preenche na página deles; no simulado aceita vazio.
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

      const response = await paymentService.pay(bookingId, method, method === 'credit_card' ? {
        number: card.number,
        name: card.name,
        expiry: card.expiry,
        cvv: card.cvv,
      } : undefined);

      // Pagamento real via PagSeguro: redirecionar para a URL de checkout
      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      setSuccess(response?.message || 'Pagamento aprovado! Redirecionando...');
      setTimeout(() => {
        navigate(`/booking/${bookingId}/details`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao processar pagamento. Tente novamente.');
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

  const copyPixCode = () => {
    const code = `00020126580014br.gov.bcb.pix0136${bookingForDisplay?.id || 'pending'}520400005303986540${total.toFixed(2)}5802BR5925CAR AND GO LOCACAO6009SAO PAULO62070503***6304`;
    navigator.clipboard.writeText(code);
    setSuccess('Código PIX copiado!');
    setTimeout(() => setSuccess(''), 2000);
  };

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
        <ErrorMessage>{error || 'Dados da reserva não encontrados. Preencha a reserva novamente.'}</ErrorMessage>
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

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage><Check size={20} /> {success}</SuccessMessage>}

      <Grid>
        <MainCard>
          <Tabs>
            <Tab active={method === 'credit_card'} onClick={() => setMethod('credit_card')}>
              Cartão de Crédito
            </Tab>
            <Tab active={method === 'pix'} onClick={() => setMethod('pix')}>
              PIX
            </Tab>
          </Tabs>

          {method === 'credit_card' && (
            <>
              <FormGroup>
                <label>Número do cartão</label>
                <input
                  type="text"
                  name="number"
                  placeholder="0000 0000 0000 0000"
                  value={card.number.replace(/(\d{4})/g, '$1 ').trim()}
                  onChange={(e) => setCard(prev => ({ ...prev, number: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
                  maxLength={19}
                />
              </FormGroup>
              <FormGroup>
                <label>Nome no cartão</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Como está no cartão"
                  value={card.name}
                  onChange={(e) => setCard(prev => ({ ...prev, name: e.target.value }))}
                />
              </FormGroup>
              <Row>
                <FormGroup>
                  <label>Validade (MM/AA)</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/AA"
                    value={formatExpiry(card.expiry)}
                    onChange={(e) => setCard(prev => ({ ...prev, expiry: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    maxLength={5}
                  />
                </FormGroup>
                <FormGroup>
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={card.cvv}
                    onChange={handleCardChange}
                    maxLength={4}
                  />
                </FormGroup>
              </Row>
              <PayButton className="primary" onClick={handlePay} disabled={paying}>
                {paying ? 'Processando...' : <> <CreditCard size={20} /> Pagar com Cartão </>}
              </PayButton>
            </>
          )}

          {method === 'pix' && (
            <>
              <PixBox>
                <p style={{ marginBottom: '1rem', fontWeight: 600, color: '#0f766e' }}>Pague via PIX</p>
                <PixQrPlaceholder>QR Code PIX<br />(simulado)</PixQrPlaceholder>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Ou copie o código abaixo e cole no app do seu banco:</p>
                <PixCode>00020126...{(bookingForDisplay?.id || 'pending').slice(-8)}...{total.toFixed(2)}...</PixCode>
                <CopyButton onClick={copyPixCode}>Copiar código PIX</CopyButton>
              </PixBox>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                Após pagar pelo PIX, clique no botão abaixo para confirmar o pagamento.
              </p>
              <PayButton className="pix" onClick={handlePay} disabled={paying}>
                {paying ? 'Confirmando...' : <> Já paguei via PIX </>}
              </PayButton>
            </>
          )}
        </MainCard>

        <SummaryCard>
          <SummaryTitle><Car size={20} /> Resumo da reserva</SummaryTitle>
          <VehicleLine>
            {vehicle.make} {vehicle.model} {vehicle.year}
          </VehicleLine>
          <SummaryRow>
            <span><Calendar size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Período</span>
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
