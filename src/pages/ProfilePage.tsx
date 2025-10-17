import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { User } from '../components/IconSystem';
import { authService } from '../services/authService';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 700;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  margin: 0 auto 1.5rem;
`;

const UserName = styled.h2`
  text-align: center;
  margin-bottom: 0.5rem;
  color: #333;
`;

const UserEmail = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
`;

const UserType = styled.div`
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #5a6fd8;
  }
`;

const DangerButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;

  &:hover {
    background: #c0392b;
  }
`;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    userType: '',
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    console.log('Profile page - User data:', userData);
    console.log('Profile page - Token exists:', !!token);
    
    // Debug token details
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Token expires:', new Date(payload.exp * 1000));
        console.log('Token expired:', Date.now() > payload.exp * 1000);
      } catch (error) {
        console.log('Token decode error:', error);
      }
    }
    
    if (userData.id && token) {
      setUser(userData);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        city: userData.city || '',
        state: userData.state || '',
        userType: userData.userType || '',
      });
    } else {
      console.log('No user data or token, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Check if user is logged in and has a valid token
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !userData.id) {
        alert('You are not logged in. Please log in again.');
        navigate('/login');
        return;
      }
      
      console.log('Attempting to update profile...');
      
      // Call the API to update user profile
      const updatedUser = await authService.updateProfile(formData);
      console.log('Profile updated:', updatedUser);
      
      // Update localStorage with new user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUserData = { ...currentUser, ...formData };
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      // Update local state
      setUser(newUserData);
      
      alert('Profile updated successfully! The page will refresh to apply changes.');
      
      // Refresh the page to update the header navigation
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        alert('Error updating profile. Please try again.');
      }
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Here you would call the API to delete the account
      console.log('Deleting account...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  if (!user) {
    return (
      <Container>
        <Title>Loading...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>My Profile</Title>
      
      <ProfileGrid>
        <div>
          <ProfileCard>
            <ProfileImage>
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : <User size={24} />}
            </ProfileImage>
            <UserName>{user.firstName} {user.lastName}</UserName>
            <UserEmail>{user.email}</UserEmail>
            <UserType>
              {user.userType === 'lessee' && 'Quero Alugar Carros'}
              {user.userType === 'lessor' && 'Quero Alugar Meu Carro'}
              {user.userType === 'both' && 'Ambos (Locador e Locatário)'}
            </UserType>
            
            <StatsGrid>
              <StatCard>
                <StatNumber>0</StatNumber>
                <StatLabel>Bookings</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>0</StatNumber>
                <StatLabel>Cars Listed</StatLabel>
              </StatCard>
            </StatsGrid>
          </ProfileCard>
        </div>

        <div>
          <ProfileCard>
            <SectionTitle>Personal Information</SectionTitle>
            
            <FormGroup>
              <Label>First Name</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Last Name</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>State</Label>
              <Select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              >
                <option value="">Select State</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="PR">Paraná</option>
                <option value="BA">Bahia</option>
                <option value="SC">Santa Catarina</option>
                <option value="GO">Goiás</option>
                <option value="PE">Pernambuco</option>
                <option value="CE">Ceará</option>
                <option value="PA">Pará</option>
                <option value="MA">Maranhão</option>
                <option value="AM">Amazonas</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="ES">Espírito Santo</option>
                <option value="PB">Paraíba</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="AL">Alagoas</option>
                <option value="SE">Sergipe</option>
                <option value="AC">Acre</option>
                <option value="AP">Amapá</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="TO">Tocantins</option>
                <option value="DF">Distrito Federal</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Account Type</Label>
              <Select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
              >
                <option value="lessee">Quero Alugar Carros (Locatário)</option>
                <option value="lessor">Quero Alugar Meu Carro (Locador)</option>
                <option value="both">Ambos (Locador e Locatário)</option>
              </Select>
              <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                This determines which features you can access in the app.
              </small>
            </FormGroup>

            <Button onClick={handleSave}>Save Changes</Button>
            
            <DangerButton onClick={handleDeleteAccount}>
              Delete Account
            </DangerButton>
          </ProfileCard>
        </div>
      </ProfileGrid>
    </Container>
  );
};

export default ProfilePage;
