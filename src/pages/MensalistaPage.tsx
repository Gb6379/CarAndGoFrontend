import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { vehicleService } from '../services/authService';
import { Calendar, Car, CheckCircle, Money } from '../components/IconSystem';

const PageContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.section`
  background: linear-gradient(135deg, #F6885C, #D95128);
  color: #fff;
  border-radius: 14px;
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: 700;
`;

const HeroText = styled.p`
  margin: 0;
  opacity: 0.95;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const CardTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 1.2rem;
  color: #222;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SwitchRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #d5dbe1;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: #F6885C;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.12);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #d5dbe1;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: #F6885C;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.12);
  }
`;

const Info = styled.p`
  margin: 0.25rem 0 0;
  color: #556;
  font-size: 0.95rem;
`;

const ResultBox = styled.div`
  margin-top: 1rem;
  background: #fffaf5;
  border: 1px solid #ffdcc8;
  border-radius: 10px;
  padding: 1rem;
`;

const ResultLabel = styled.div`
  color: #556;
  font-size: 0.95rem;
`;

const ResultValue = styled.div`
  margin-top: 0.2rem;
  font-size: 1.6rem;
  font-weight: 700;
  color: #7c2d12;
`;

const Breakdown = styled.div`
  margin-top: 0.6rem;
  color: #9a3412;
  font-size: 0.93rem;
  line-height: 1.5;
`;

const InlineMuted = styled.span`
  color: #667;
  font-size: 0.9rem;
`;

const ErrorBox = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ffd2d2;
  background: #fff5f5;
  color: #8f2b2b;
`;

const ActionButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  border: none;
  border-radius: 10px;
  padding: 0.9rem 1.1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: #F6885C;
  color: #fff;
  transition: background 0.2s, transform 0.2s;

  &:hover:not(:disabled) {
    background: #ED733A;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #c6cde8;
    cursor: not-allowed;
  }
`;

const SecondaryActionButton = styled.button`
  width: 100%;
  margin-top: 0.6rem;
  border: 1px solid #fec89a;
  border-radius: 10px;
  padding: 0.85rem 1.1rem;
  font-size: 0.98rem;
  font-weight: 700;
  cursor: pointer;
  background: #fff4ed;
  color: #9a3412;
  transition: background 0.2s;

  &:hover {
    background: #ffedd5;
  }
`;

const MensalistaPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMensalista, setIsMensalista] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoadingVehicles(true);
        setLoadError(null);
        const data = await vehicleService.getAllVehicles();
        setVehicles(Array.isArray(data) ? data : []);
      } catch {
        setLoadError('Não foi possível carregar os carros no momento.');
      } finally {
        setLoadingVehicles(false);
      }
    };

    loadVehicles();
  }, []);

  useEffect(() => {
    const preselectedVehicleId = searchParams.get('vehicleId');
    if (!preselectedVehicleId || vehicles.length === 0) return;
    const hasVehicle = vehicles.some((v) => String(v.id) === preselectedVehicleId);
    if (!hasVehicle) return;
    setSelectedVehicleId(preselectedVehicleId);
    setIsMensalista(true);
  }, [searchParams, vehicles]);

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => String(v.id) === selectedVehicleId),
    [vehicles, selectedVehicleId]
  );

  const daysInMonth = useMemo(() => {
    if (!selectedMonth) return 0;
    const [yearRaw, monthRaw] = selectedMonth.split('-');
    const year = Number(yearRaw);
    const month = Number(monthRaw);
    if (!year || !month) return 0;
    return new Date(year, month, 0).getDate();
  }, [selectedMonth]);

  const dailyRate = Number(selectedVehicle?.dailyRate || 0);
  const grossTotal = dailyRate * daysInMonth;
  const discountRate = 0.2;
  const discountAmount = selectedVehicle && isMensalista ? grossTotal * discountRate : 0;
  const totalToPay = selectedVehicle && isMensalista ? grossTotal - discountAmount : 0;

  const currency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleProceedToPayment = () => {
    if (!selectedVehicle || !isMensalista || daysInMonth <= 0) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) return;

    const [yearRaw, monthRaw] = selectedMonth.split('-');
    const year = Number(yearRaw);
    const month = Number(monthRaw);
    if (!year || !month) return;

    const startDateTime = new Date(year, month - 1, 1, 10, 0, 0);
    const endDateTime = new Date(year, month, 1, 10, 0, 0);
    const lessorId = selectedVehicle.ownerId || selectedVehicle.owner?.id;
    if (!lessorId) {
      return;
    }

    const bookingPayload = {
      lesseeId: user.id,
      lessorId,
      vehicleId: selectedVehicle.id,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      dailyRate: Number(selectedVehicle.dailyRate) || 0,
      hourlyRate: Number(selectedVehicle.hourlyRate) || 0,
      securityDeposit: 0,
    };

    navigate('/payment', {
      state: {
        bookingPayload,
        vehicle: selectedVehicle,
        bookingSummary: {
          totalAmount: totalToPay,
          baseAmount: grossTotal,
          platformFee: 0,
          securityDeposit: 0,
          totalDays: daysInMonth,
          totalHours: daysInMonth * 24,
        },
      },
    });
  };

  return (
    <PageContainer>
      <Hero>
        <HeroTitle>Checkout Mensalista</HeroTitle>
        <HeroText>
          Escolha um carro para locação mensal e veja o valor total calculado com base na diária do veículo.
        </HeroText>
      </Hero>

      <Grid>
        <Card>
          <CardTitle>
            <CheckCircle size={20} /> Ativação do plano
          </CardTitle>
          <SwitchRow>
            <input
              type="checkbox"
              checked={isMensalista}
              onChange={(e) => setIsMensalista(e.target.checked)}
            />
            Quero ser mensalista
          </SwitchRow>
          <Info>
            Ao ativar, você pode selecionar o mês e o carro para calcular o valor total da locação mensal.
          </Info>

          <CardTitle style={{ marginTop: '1.25rem' }}>
            <Calendar size={20} /> Mês da locação
          </CardTitle>
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={!isMensalista}
          />
          <Info>
            Dias no mês selecionado: <strong>{daysInMonth}</strong>
          </Info>
        </Card>

        <Card>
          <CardTitle>
            <Car size={20} /> Escolha do veículo
          </CardTitle>
          <Select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            disabled={!isMensalista || loadingVehicles}
          >
            <option value="">
              {loadingVehicles ? 'Carregando veículos...' : 'Selecione um veículo'}
            </option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={String(vehicle.id)}>
                {vehicle.make} {vehicle.model} {vehicle.year} - {currency(Number(vehicle.dailyRate || 0))}/dia
              </option>
            ))}
          </Select>

          {loadError && <ErrorBox>{loadError}</ErrorBox>}

          {selectedVehicle && (
            <Info>
              <strong>{selectedVehicle.make} {selectedVehicle.model}</strong>
              {' '}({selectedVehicle.year}) - diária de {currency(dailyRate)}.
            </Info>
          )}

          <ResultBox>
            <CardTitle style={{ margin: 0 }}>
              <Money size={20} /> Valor a pagar
            </CardTitle>
            <ResultLabel>
              {selectedVehicle && isMensalista
                ? `Cálculo: ${currency(dailyRate)} x ${daysInMonth} dias - 20% de desconto`
                : 'Ative o plano mensalista e selecione um carro para calcular.'}
            </ResultLabel>
            <ResultValue>
              {selectedVehicle && isMensalista ? currency(totalToPay) : 'R$ 0,00'}
            </ResultValue>
            {selectedVehicle && isMensalista && (
              <Breakdown>
                <div>Subtotal sem desconto: {currency(grossTotal)}</div>
                <div>Desconto mensalista (20%): -{currency(discountAmount)}</div>
              </Breakdown>
            )}
            {selectedVehicle && isMensalista && (
              <InlineMuted>
                Valor diário final com desconto: {currency(daysInMonth > 0 ? totalToPay / daysInMonth : 0)}.
              </InlineMuted>
            )}
          </ResultBox>
          <ActionButton
            type="button"
            onClick={handleProceedToPayment}
            disabled={!selectedVehicle || !isMensalista || daysInMonth <= 0}
          >
            Seguir com pagamento
          </ActionButton>
          <SecondaryActionButton
            type="button"
            onClick={() => navigate('/vehicles?flow=mensalista')}
          >
            Escolher outro carro disponivel
          </SecondaryActionButton>
        </Card>
      </Grid>
    </PageContainer>
  );
};

export default MensalistaPage;
