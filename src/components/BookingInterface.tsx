import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { bookingService } from '../services/authService';
import { Car, Calendar, Map, Money } from './IconSystem';

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

interface BookingInterfaceProps {
  vehicle: any;
  onBookingSuccess?: (booking: any) => void;
}

const BookingInterface: React.FC<BookingInterfaceProps> = ({ vehicle, onBookingSuccess }) => {
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    startTime: '10:00',
    endTime: '18:00',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const calculateBooking = async () => {
    if (!bookingData.startDate || !bookingData.endDate) {
      setError('Please select start and end dates');
      return;
    }

    try {
      const startDateTime = new Date(`${bookingData.startDate}T${bookingData.startTime}`);
      const endDateTime = new Date(`${bookingData.endDate}T${bookingData.endTime}`);
      
      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      const totalHours = Math.ceil(durationMs / (1000 * 60 * 60));
      const totalDays = Math.ceil(totalHours / 24);

      const baseAmount = totalDays > 1 ? totalDays * vehicle.dailyRate : totalHours * vehicle.hourlyRate;
      const platformFee = baseAmount * 0.30;
      const lessorAmount = baseAmount * 0.70;
      const securityDeposit = vehicle.securityDeposit || vehicle.dailyRate * 2;
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
      setError('Failed to calculate booking cost');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
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

      const booking = await bookingService.createBooking(bookingPayload);
      
      setSuccess('Booking created successfully! You will be redirected to payment.');
      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate) {
      calculateBooking();
    }
  }, [bookingData.startDate, bookingData.endDate, bookingData.startTime, bookingData.endTime]);

  return (
    <Container>
      <Title><Car size={24} /> Book This Vehicle</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <BookingGrid>
        <VehicleCard>
          <VehicleImage><Car size={32} /></VehicleImage>
          <VehicleInfo>
            <VehicleTitle>{vehicle.make} {vehicle.model}</VehicleTitle>
            <VehicleDetails>Year: {vehicle.year}</VehicleDetails>
            <VehicleDetails>Type: {vehicle.type}</VehicleDetails>
            <VehicleDetails>Fuel: {vehicle.fuelType}</VehicleDetails>
            <VehicleDetails>Transmission: {vehicle.transmission}</VehicleDetails>
            <VehicleDetails>Seats: {vehicle.seats}</VehicleDetails>
            <Price>R$ {vehicle.dailyRate}/day</Price>
          </VehicleInfo>
        </VehicleCard>

        <BookingForm>
          <FormTitle><Calendar size={18} /> Booking Details</FormTitle>
          
          <form onSubmit={handleSubmit}>
            <FormRow>
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={bookingData.startDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label>End Date *</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={bookingData.endDate}
                  onChange={handleChange}
                  required
                  min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </FormRow>

            <FormRow>
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  name="startTime"
                  value={bookingData.startTime}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>End Time</Label>
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
              <Label>Include route planning</Label>
            </CheckboxContainer>

            {bookingData.includeRoute && (
              <>
                <FormRow>
                  <div>
                    <Label>Origin City</Label>
                    <Input
                      type="text"
                      name="originCity"
                      value={bookingData.originCity}
                      onChange={handleChange}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <Label>Destination City</Label>
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
                  <h4><Map size={16} /> Route Planning</h4>
                  <MapPlaceholder>
                    Interactive map would be displayed here
                  </MapPlaceholder>
                </RouteSection>
              </>
            )}

            {bookingSummary && (
              <SummaryCard>
                <h4><Money size={16} /> Booking Summary</h4>
                <SummaryRow>
                  <span>Duration:</span>
                  <span>{bookingSummary.totalDays} days ({bookingSummary.totalHours} hours)</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Base Amount:</span>
                  <span>R$ {bookingSummary.baseAmount.toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Security Deposit:</span>
                  <span>R$ {bookingSummary.securityDeposit.toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Platform Fee (30%):</span>
                  <span>R$ {bookingSummary.platformFee.toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow className="total">
                  <span>Total Amount:</span>
                  <span>R$ {bookingSummary.totalAmount.toFixed(2)}</span>
                </SummaryRow>
              </SummaryCard>
            )}

            <Button type="submit" disabled={loading || !bookingSummary}>
              {loading ? 'Creating Booking...' : (
                <>
                  <Car size={16} /> Book Now
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
