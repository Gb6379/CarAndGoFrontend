import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { User } from '../components/IconSystem';
import { authService, vehicleService, bookingService } from '../services/authService';
import { validateCpfCnpj } from '../utils/cpfValidation';

interface IBGECity {
  id: number;
  nome: string;
}

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

const ProfileImageWrapper = styled.div`
  margin: 0 auto 1.5rem;
  width: 120px;
  cursor: pointer;
  position: relative;
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
  overflow: hidden;
`;

const ProfileImageImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: white;
  opacity: 0;
  transition: opacity 0.2s;
  ${ProfileImageWrapper}:hover & { opacity: 1; }
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
    cpfCnpj: '',
    city: '',
    state: '',
    userType: '',
  });
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profilePhotoDisplayUrl, setProfilePhotoDisplayUrl] = useState<string | null>(null);
  const [vehiclesCount, setVehiclesCount] = useState<number>(0);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const loadStats = async () => {
      try {
        const [vehicles, bookings] = await Promise.all([
          vehicleService.getAllVehicles().catch(() => []),
          bookingService.getBookings().catch(() => []),
        ]);
        const myVehicles = Array.isArray(vehicles)
          ? vehicles.filter((v: any) => v.ownerId === user.id || v.owner?.id === user.id)
          : [];
        const myBookings = Array.isArray(bookings)
          ? bookings.filter((b: any) => b.lesseeId === user.id || b.lessee?.id === user.id || b.lessorId === user.id || b.lessor?.id === user.id)
          : [];
        setVehiclesCount(myVehicles.length);
        setBookingsCount(myBookings.length);
      } catch {
        setVehiclesCount(0);
        setBookingsCount(0);
      }
    };
    loadStats();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.profilePhoto) {
      if (profilePhotoBlobUrlRef.current) {
        URL.revokeObjectURL(profilePhotoBlobUrlRef.current);
        profilePhotoBlobUrlRef.current = null;
      }
      setProfilePhotoDisplayUrl(null);
      return;
    }
    const url = authService.getProfilePhotoUrl(user.profilePhoto);
    if (url) {
      setProfilePhotoDisplayUrl(url);
      return;
    }
    if (user.profilePhoto === 'inline') {
      authService.fetchProfilePhotoBlobUrl().then((blobUrl) => {
        if (!blobUrl) return;
        if (profilePhotoBlobUrlRef.current) URL.revokeObjectURL(profilePhotoBlobUrlRef.current);
        profilePhotoBlobUrlRef.current = blobUrl;
        setProfilePhotoDisplayUrl(blobUrl);
      });
      return () => {
        if (profilePhotoBlobUrlRef.current) {
          URL.revokeObjectURL(profilePhotoBlobUrlRef.current);
          profilePhotoBlobUrlRef.current = null;
        }
      };
    }
    setProfilePhotoDisplayUrl(null);
  }, [user?.profilePhoto]);

  useEffect(() => {
    if (formData.state) {
      setLoadingCities(true);
      setCities([]);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.state}/municipios?orderBy=nome`)
        .then(res => res.json())
        .then((data: IBGECity[]) => {
          setCities(data);
          setLoadingCities(false);
        })
        .catch(err => {
          console.error('Erro ao carregar cidades:', err);
          setLoadingCities(false);
        });
    } else {
      setCities([]);
    }
  }, [formData.state]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    let cancelled = false;
    authService
      .getProfile()
      .then((profile: any) => {
        if (cancelled) return;
        const p = profile || {};
        setUser(p);
        setFormData({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          email: p.email || '',
          phone: p.phone || '',
          cpfCnpj: p.cpfCnpj || '',
          city: p.city || '',
          state: p.state || '',
          userType: p.userType || '',
        });
        localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), ...p }));
      })
      .catch(() => {
        if (cancelled) return;
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.id) {
          setUser(userData);
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            cpfCnpj: userData.cpfCnpj || '',
            city: userData.city || '',
            state: userData.state || '',
            userType: userData.userType || '',
          });
        } else {
          navigate('/login');
        }
      });
    return () => { cancelled = true; };
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cpfCnpj') setCpfError(null);
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'state') next.city = '';
      return next;
    });
  };

  const handleSave = async () => {
    setCpfError(null);
    const cpfTrimmed = (formData.cpfCnpj || '').replace(/\D/g, '');
    if (cpfTrimmed.length > 0) {
      const cpfResult = validateCpfCnpj(formData.cpfCnpj);
      if (!cpfResult.valid) {
        setCpfError(cpfResult.message || 'CPF/CNPJ inválido.');
        return;
      }
    }
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !userData.id) {
        alert('Você não está logado. Faça login novamente.');
        navigate('/login');
        return;
      }
      
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
    } catch (error: any) {
      console.error('Error updating profile:', error);

      if (error.response?.status === 401) {
        alert('Sua sessão expirou. Faça login novamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      if (error.response?.status === 409) {
        const msg = error.response?.data?.message || 'Este CPF/CNPJ já está cadastrado para outra conta.';
        setCpfError(msg);
        return;
      }
      alert(error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.');
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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    e.target.value = '';
    setUploadingPhoto(true);
    try {
      const updatedUser = await authService.uploadProfilePhoto(file);
      setUser((prev: any) => ({ ...prev, profilePhoto: updatedUser.profilePhoto }));
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, profilePhoto: updatedUser.profilePhoto }));
      window.dispatchEvent(new Event('profilePhotoUpdated'));
    } catch (err) {
      console.error(err);
      alert('Não foi possível enviar a foto. Tente novamente.');
    } finally {
      setUploadingPhoto(false);
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
            <ProfileImageWrapper
              onClick={() => !uploadingPhoto && fileInputRef.current?.click()}
              title="Alterar foto de perfil"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              <ProfileImage>
                {profilePhotoDisplayUrl ? (
                  <ProfileImageImg
                    src={profilePhotoDisplayUrl}
                    alt=""
                  />
                ) : (
                  user.firstName ? user.firstName.charAt(0).toUpperCase() : <User size={24} />
                )}
              </ProfileImage>
              <ProfileImageOverlay>
                {uploadingPhoto ? 'Enviando...' : 'Alterar foto'}
              </ProfileImageOverlay>
            </ProfileImageWrapper>
            <UserName>{user.firstName} {user.lastName}</UserName>
            <UserEmail>{user.email}</UserEmail>
            <UserType>
              {user.userType === 'lessee' && 'Quero Alugar Carros'}
              {user.userType === 'lessor' && 'Quero Alugar Meu Carro'}
              {user.userType === 'both' && 'Ambos (Locador e Locatário)'}
            </UserType>
            
            <StatsGrid>
              <StatCard>
                <StatNumber>{bookingsCount}</StatNumber>
                <StatLabel>Bookings</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{vehiclesCount}</StatNumber>
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
              <Label>Telefone</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>CPF / CNPJ</Label>
              <Input
                type="text"
                name="cpfCnpj"
                value={formData.cpfCnpj}
                onChange={handleInputChange}
                placeholder="Somente números (11 ou 14 dígitos)"
                maxLength={18}
              />
              {cpfError && <small style={{ color: '#c62828', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>{cpfError}</small>}
            </FormGroup>

            <FormGroup>
              <Label>Estado</Label>
              <Select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              >
                <option value="">Selecione seu estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Cidade</Label>
              <Select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!formData.state || loadingCities}
              >
                <option value="">
                  {!formData.state
                    ? 'Selecione o estado primeiro'
                    : loadingCities
                      ? 'Carregando cidades...'
                      : 'Selecione sua cidade'}
                </option>
                {cities.map(c => (
                  <option key={c.id} value={c.nome}>{c.nome}</option>
                ))}
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
