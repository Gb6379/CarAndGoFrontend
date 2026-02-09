import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bookingService } from '../services/authService';
import { Car, Calendar, Map, Money, Lock } from './IconSystem';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VehicleCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
`;

const VehicleImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
`;

const VehicleInfo = styled.div`
  padding: 1.5rem;
`;

const VehicleTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const VehicleDetails = styled.p`
  color: #666;
  margin-bottom: 0.5rem;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin-top: 1rem;
`;

const BookingForm = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
`;

const FormTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
    box-sizing: border-box;
    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SummaryCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &.total {
    font-weight: bold;
    font-size: 1.2rem;
    border-top: 2px solid #e0e0e0;
    padding-top: 0.5rem;
    margin-top: 1rem;
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background: #e8f5e8;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const RouteSection = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const MapPlaceholder = styled.div`
  height: 200px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1rem;
`;

const AvailabilityWarning = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const AvailabilitySuccess = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

interface BookingInterfaceProps {
  vehicle: any;
  onBookingSuccess?: (booking: any) => void;
  initialStartDate?: string;
  initialEndDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
}

const BookingInterface: React.FC<BookingInterfaceProps> = ({ 
  vehicle, 
  onBookingSuccess,
  initialStartDate = '',
  initialEndDate = '',
  initialStartTime = '',
  initialEndTime = ''
}) => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
    startTime: initialStartTime || '10:00',
    endTime: initialEndTime || '10:00',
    originCity: '',
    destinationCity: '',
    originLatitude: '',
    originLongitude: '',
    destinationLatitude: '',
    destinationLongitude: '',
    includeRoute: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingSummary, setBookingSummary] = useState<any>(null);
  const [blockedDates, setBlockedDates] = useState<{ startDate: string; endDate: string; status: string }[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Update booking data when initial props change
  useEffect(() => {
    setBookingData(prev => ({
      ...prev,
      startDate: initialStartDate || prev.startDate,
      endDate: initialEndDate || prev.endDate,
      startTime: initialStartTime || prev.startTime,
      endTime: initialEndTime || prev.endTime,
    }));
  }, [initialStartDate, initialEndDate, initialStartTime, initialEndTime]);

  // Fetch blocked dates when component mounts
  useEffect(() => {
    const fetchBlockedDates = async () => {
      if (!vehicle?.id) return;
      try {
        const response = await bookingService.getBlockedDates(vehicle.id);
        setBlockedDates(response.blockedDates || []);
      } catch (err) {
        console.error('Erro ao buscar datas bloqueadas:', err);
      }
    };
    fetchBlockedDates();
  }, [vehicle?.id]);

  // Check availability when dates change
  const checkAvailability = useCallback(async () => {
    if (!bookingData.startDate || !bookingData.endDate || !vehicle?.id) {
      setIsAvailable(null);
      return;
    }

    setCheckingAvailability(true);
    try {
      const startDateTime = `${bookingData.startDate}T${bookingData.startTime}:00`;
      const endDateTime = `${bookingData.endDate}T${bookingData.endTime}:00`;
      const response = await bookingService.checkAvailability(vehicle.id, startDateTime, endDateTime);
      setIsAvailable(response.available);
      if (!response.available) {
        setError('Este veículo não está disponível no período selecionado.');
        setBookingSummary(null);
      } else {
        setError('');
      }
    } catch (err: any) {
      console.error('Erro ao verificar disponibilidade:', err);
      // Handle error response from API
      const errorMessage = err.response?.data?.message;
      if (typeof errorMessage === 'string') {
        setError(errorMessage);
      } else if (err.response?.status === 404) {
        // Endpoint might not exist yet, ignore
        console.log('Endpoint de disponibilidade não encontrado');
      }
      setIsAvailable(null);
    } finally {
      setCheckingAvailability(false);
    }
  }, [bookingData.startDate, bookingData.endDate, bookingData.startTime, bookingData.endTime, vehicle?.id]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    // Reset availability when dates change
    if (name === 'startDate' || name === 'endDate' || name === 'startTime' || name === 'endTime') {
      setIsAvailable(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const dateToYYYYMMDD = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
  };

  // Datas que estão dentro de períodos reservados (indisponíveis no calendário)
  const excludedDates = useMemo(() => {
    const dates: Date[] = [];
    blockedDates.forEach(({ startDate, endDate }) => {
      if (!startDate || !endDate) return;
      const startStr = typeof startDate === 'string' ? startDate.slice(0, 10) : '';
      const endStr = typeof endDate === 'string' ? endDate.slice(0, 10) : '';
      if (!startStr || !endStr || startStr.length < 10 || endStr.length < 10) return;
      const [sy, sm, sd] = startStr.split('-').map(Number);
      const [ey, em, ed] = endStr.split('-').map(Number);
      const start = new Date(sy, sm - 1, sd);
      const end = new Date(ey, em - 1, ed);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    });
    return dates;
  }, [blockedDates]);

  const calculateBooking = async () => {
    if (!bookingData.startDate || !bookingData.endDate) {
      setError('Por favor, selecione as datas de retirada e devolução');
      return;
    }

    try {
      const startDateTime = new Date(`${bookingData.startDate}T${bookingData.startTime}`);
      const endDateTime = new Date(`${bookingData.endDate}T${bookingData.endTime}`);
      
      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      const totalHours = Math.ceil(durationMs / (1000 * 60 * 60));
      const totalDays = Math.ceil(totalHours / 24);

      const dailyRate = parseFloat(vehicle.dailyRate) || 0;
      const hourlyRate = parseFloat(vehicle.hourlyRate) || dailyRate / 24;
      const baseAmount = totalDays > 1 ? totalDays * dailyRate : totalHours * hourlyRate;
      const platformFee = baseAmount * 0.30;
      const lessorAmount = baseAmount * 0.70;
      const securityDeposit = parseFloat(vehicle.securityDeposit) || dailyRate * 2;
      const totalAmount = baseAmount + securityDeposit;

      setBookingSummary({
        totalDays,
        totalHours,
        baseAmount,
        platformFee,
        lessorAmount,
        securityDeposit,
        totalAmount,
      });
    } catch (error) {
      setError('Falha ao calcular o custo da reserva');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bookingSummary) {
      setError('Calcule a reserva antes de continuar.');
      return;
    }
    if (isAvailable === false) {
      setError('O veículo não está disponível para as datas selecionadas.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const startDateTime = new Date(`${bookingData.startDate}T${bookingData.startTime}`);
    const endDateTime = new Date(`${bookingData.endDate}T${bookingData.endTime}`);

    const bookingPayload = {
      lesseeId: user.id,
      lessorId: vehicle.ownerId,
      vehicleId: vehicle.id,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      dailyRate: vehicle.dailyRate,
      hourlyRate: vehicle.hourlyRate,
      securityDeposit: bookingSummary.securityDeposit,
      ...(bookingData.includeRoute && {
        originCity: bookingData.originCity,
        destinationCity: bookingData.destinationCity,
        originLatitude: bookingData.originLatitude ? parseFloat(bookingData.originLatitude) : undefined,
        originLongitude: bookingData.originLongitude ? parseFloat(bookingData.originLongitude) : undefined,
        destinationLatitude: bookingData.destinationLatitude ? parseFloat(bookingData.destinationLatitude) : undefined,
        destinationLongitude: bookingData.destinationLongitude ? parseFloat(bookingData.destinationLongitude) : undefined,
      }),
    };

    // Ir para a página de pagamento; a reserva só será criada após o pagamento
    navigate('/payment', {
      replace: true,
      state: {
        bookingPayload,
        vehicle,
        bookingSummary: {
          totalAmount: bookingSummary.totalAmount,
          baseAmount: bookingSummary.baseAmount,
          platformFee: bookingSummary.platformFee,
          securityDeposit: bookingSummary.securityDeposit,
          totalDays: bookingSummary.totalDays,
          totalHours: bookingSummary.totalHours,
        },
      },
    });
  };

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      calculateBooking();
    }
  }, [bookingData.startDate, bookingData.endDate, bookingData.startTime, bookingData.endTime]);

  return (
    <Container>
      <Title><Car size={24} /> Reservar Este Veículo</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <BookingGrid>
        <VehicleCard>
          <VehicleImage><Car size={32} /></VehicleImage>
          <VehicleInfo>
            <VehicleTitle>{vehicle.make} {vehicle.model}</VehicleTitle>
            <VehicleDetails>Ano: {vehicle.year}</VehicleDetails>
            <VehicleDetails>Tipo: {vehicle.type}</VehicleDetails>
            <VehicleDetails>Combustível: {vehicle.fuelType === 'eletrico' ? 'Elétrico' : vehicle.fuelType === 'combustao' ? 'Combustão' : vehicle.fuelType || 'N/A'}</VehicleDetails>
            <VehicleDetails>Câmbio: {vehicle.transmission}</VehicleDetails>
            <VehicleDetails>Lugares: {vehicle.seats}</VehicleDetails>
            <Price>R$ {typeof vehicle.dailyRate === 'number' ? vehicle.dailyRate.toFixed(2) : vehicle.dailyRate || '0.00'}/dia</Price>
          </VehicleInfo>
        </VehicleCard>

        <BookingForm>
          <FormTitle><Calendar size={18} /> Detalhes da Reserva</FormTitle>

          {isAvailable === false && (
            <AvailabilityWarning>
              <Lock size={18} />
              Este veículo não está disponível no período selecionado. Escolha outras datas.
            </AvailabilityWarning>
          )}

          {isAvailable === true && (
            <AvailabilitySuccess>
              <Calendar size={18} />
              Veículo disponível para o período selecionado!
            </AvailabilitySuccess>
          )}
          
          <form onSubmit={handleSubmit}>
            <FormRow>
              <div>
                <Label>Data de Retirada *</Label>
                <DatePickerWrapper>
                  <DatePicker
                    selected={bookingData.startDate ? new Date(bookingData.startDate + 'T12:00:00') : null}
                    onChange={(date: Date | null) => {
                      const dateStr = date ? dateToYYYYMMDD(date) : '';
                      setBookingData(prev => ({ ...prev, startDate: dateStr }));
                      setIsAvailable(null);
                    }}
                    excludeDates={excludedDates}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione a data"
                    required
                  />
                </DatePickerWrapper>
              </div>
              <div>
                <Label>Data de Devolução *</Label>
                <DatePickerWrapper>
                  <DatePicker
                    selected={bookingData.endDate ? new Date(bookingData.endDate + 'T12:00:00') : null}
                    onChange={(date: Date | null) => {
                      const dateStr = date ? dateToYYYYMMDD(date) : '';
                      setBookingData(prev => ({ ...prev, endDate: dateStr }));
                      setIsAvailable(null);
                    }}
                    excludeDates={excludedDates}
                    minDate={
                      bookingData.startDate
                        ? new Date(bookingData.startDate + 'T12:00:00')
                        : new Date()
                    }
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecione a data"
                    required
                  />
                </DatePickerWrapper>
              </div>
            </FormRow>

            <FormRow>
              <div>
                <Label>Horário de Retirada</Label>
                <Input
                  type="time"
                  name="startTime"
                  value={bookingData.startTime}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Horário de Devolução</Label>
                <Input
                  type="time"
                  name="endTime"
                  value={bookingData.endTime}
                  onChange={handleChange}
                />
              </div>
            </FormRow>

            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                name="includeRoute"
                checked={bookingData.includeRoute}
                onChange={handleChange}
              />
              <Label>Incluir planejamento de rota</Label>
            </CheckboxContainer>

            {bookingData.includeRoute && (
              <>
                <FormRow>
                  <div>
                    <Label>Cidade de Origem</Label>
                    <Input
                      type="text"
                      name="originCity"
                      value={bookingData.originCity}
                      onChange={handleChange}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <Label>Cidade de Destino</Label>
                    <Input
                      type="text"
                      name="destinationCity"
                      value={bookingData.destinationCity}
                      onChange={handleChange}
                      placeholder="Rio de Janeiro"
                    />
                  </div>
                </FormRow>

                <RouteSection>
                  <h4><Map size={16} /> Planejamento de Rota</h4>
                  <MapPlaceholder>
                    O mapa interativo será exibido aqui
                  </MapPlaceholder>
                </RouteSection>
              </>
            )}

            {bookingSummary && (
              <SummaryCard>
                <h4><Money size={16} /> Resumo da Reserva</h4>
                <SummaryRow>
                  <span>Duração:</span>
                  <span>{bookingSummary.totalDays} dia(s) ({bookingSummary.totalHours} horas)</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Valor Base:</span>
                  <span>R$ {bookingSummary.baseAmount.toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Caução:</span>
                  <span>R$ {bookingSummary.securityDeposit.toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Taxa da Plataforma (30%):</span>
                  <span>R$ {bookingSummary.platformFee.toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow className="total">
                  <span>Valor Total:</span>
                  <span>R$ {bookingSummary.totalAmount.toFixed(2)}</span>
                </SummaryRow>
              </SummaryCard>
            )}

            <Button type="submit" disabled={loading || !bookingSummary || isAvailable === false || checkingAvailability}>
              {loading ? 'Criando Reserva...' : checkingAvailability ? 'Verificando disponibilidade...' : (
                <>
                  <Car size={16} /> Reservar Agora
                </>
              )}
            </Button>
          </form>
        </BookingForm>
      </BookingGrid>
    </Container>
  );
};

export default BookingInterface;
