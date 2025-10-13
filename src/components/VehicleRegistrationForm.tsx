import React, { useState } from 'react';
import styled from 'styled-components';
import { vehicleService } from '../services/authService';
import { Car, Location, Settings, Edit as EditIcon, Money } from '../components/IconSystem';

const Container = styled.div`
  max-width: 800px;
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

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormSection = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #667eea;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
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
  margin: 0.5rem 0;
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

const VehicleRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    type: 'sedan',
    fuelType: 'gasoline',
    engineCapacity: '',
    mileage: '',
    dailyRate: '',
    hourlyRate: '',
    securityDeposit: '',
    address: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    color: '',
    transmission: 'manual',
    seats: 5,
    airConditioning: true,
    gps: false,
    bluetooth: false,
    usbCharger: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const vehicleData = {
        ...formData,
        ownerId: user.id,
        year: parseInt(formData.year.toString()),
        engineCapacity: parseInt(formData.engineCapacity),
        mileage: parseInt(formData.mileage),
        dailyRate: parseFloat(formData.dailyRate),
        hourlyRate: parseFloat(formData.hourlyRate),
        securityDeposit: parseFloat(formData.securityDeposit),
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        seats: parseInt(formData.seats.toString()),
      };

      await vehicleService.createVehicle(vehicleData);
      
      setSuccess('Vehicle registered successfully! It will be reviewed and inspected before being made available for rent.');
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        type: 'sedan',
        fuelType: 'gasoline',
        engineCapacity: '',
        mileage: '',
        dailyRate: '',
        hourlyRate: '',
        securityDeposit: '',
        address: '',
        city: '',
        state: '',
        latitude: '',
        longitude: '',
        color: '',
        transmission: 'manual',
        seats: 5,
        airConditioning: true,
        gps: false,
        bluetooth: false,
        usbCharger: false,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title><Car size={24} /> Register Your Vehicle</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle><EditIcon size={16} /> Basic Information</SectionTitle>
          <FormRow>
            <div>
              <label>Make *</label>
              <Input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                placeholder="e.g., Toyota"
              />
            </div>
            <div>
              <label>Model *</label>
              <Input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="e.g., Corolla"
              />
            </div>
            <div>
              <label>Year *</label>
              <Input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1990"
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div>
              <label>License Plate *</label>
              <Input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                required
                placeholder="ABC-1234"
              />
            </div>
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle><Settings size={16} /> Technical Specifications</SectionTitle>
          <FormRow>
            <div>
              <label>Vehicle Type *</label>
              <Select name="type" value={formData.type} onChange={handleChange} required>
                <option value="sedan">Sedan</option>
                <option value="hatchback">Hatchback</option>
                <option value="suv">SUV</option>
                <option value="pickup">Pickup</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
                <option value="wagon">Wagon</option>
                <option value="minivan">Minivan</option>
              </Select>
            </div>
            <div>
              <label>Fuel Type *</label>
              <Select name="fuelType" value={formData.fuelType} onChange={handleChange} required>
                <option value="gasoline">Gasoline</option>
                <option value="ethanol">Ethanol</option>
                <option value="flex">Flex</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
                <option value="cng">CNG</option>
              </Select>
            </div>
            <div>
              <label>Engine Capacity (cc) *</label>
              <Input
                type="number"
                name="engineCapacity"
                value={formData.engineCapacity}
                onChange={handleChange}
                required
                placeholder="1600"
              />
            </div>
            <div>
              <label>Mileage (km) *</label>
              <Input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                required
                placeholder="50000"
              />
            </div>
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle><Money size={16} /> Pricing</SectionTitle>
          <FormRow>
            <div>
              <label>Daily Rate (R$) *</label>
              <Input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="150.00"
              />
            </div>
            <div>
              <label>Hourly Rate (R$) *</label>
              <Input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="25.00"
              />
            </div>
            <div>
              <label>Security Deposit (R$)</label>
              <Input
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                step="0.01"
                placeholder="300.00"
              />
            </div>
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle><Location size={16} /> Location</SectionTitle>
          <FormRow>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Address *</label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Street address"
              />
            </div>
            <div>
              <label>City *</label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="São Paulo"
              />
            </div>
            <div>
              <label>State *</label>
              <Input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="SP"
              />
            </div>
            <div>
              <label>Latitude (optional)</label>
              <Input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                step="any"
                placeholder="-23.5505"
              />
            </div>
            <div>
              <label>Longitude (optional)</label>
              <Input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                step="any"
                placeholder="-46.6333"
              />
            </div>
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle><Car size={16} /> Features & Amenities</SectionTitle>
          <FormRow>
            <div>
              <label>Color</label>
              <Input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="White"
              />
            </div>
            <div>
              <label>Transmission</label>
              <Select name="transmission" value={formData.transmission} onChange={handleChange}>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </Select>
            </div>
            <div>
              <label>Seats</label>
              <Input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                min="2"
                max="8"
              />
            </div>
          </FormRow>
          
          <div style={{ marginTop: '1rem' }}>
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                name="airConditioning"
                checked={formData.airConditioning}
                onChange={handleChange}
              />
              <label>Air Conditioning</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                name="gps"
                checked={formData.gps}
                onChange={handleChange}
              />
              <label>GPS Navigation</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                name="bluetooth"
                checked={formData.bluetooth}
                onChange={handleChange}
              />
              <label>Bluetooth Connectivity</label>
            </CheckboxContainer>
            
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                name="usbCharger"
                checked={formData.usbCharger}
                onChange={handleChange}
              />
              <label>USB Charger</label>
            </CheckboxContainer>
          </div>
        </FormSection>

        <Button type="submit" disabled={loading}>
          {loading ? 'Registering Vehicle...' : (
            <>
              <Car size={16} /> Register Vehicle
            </>
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default VehicleRegistrationForm;
