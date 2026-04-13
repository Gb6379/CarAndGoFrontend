import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { User, Email as EmailIcon, Phone as PhoneIcon, Shield, City, LocationOn, Verified, Info } from '../components/IconSystem';
import { authService, vehicleService, bookingService } from '../services/authService';
import { validateCpfCnpj } from '../utils/cpfValidation';
import modernTheme from '../styles/modernTheme';
import {
  formFieldCss,
  glassPanelCss,
  labelCss,
  pageShellCss,
  primaryButtonCss,
  titleCss,
} from '../styles/modernPrimitives';

interface IBGECity {
  id: number;
  nome: string;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  city: string;
  state: string;
  userType: string;
}

const createEmptyFormData = (): ProfileFormData => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  cpfCnpj: '',
  city: '',
  state: '',
  userType: '',
});

const mapUserToFormData = (profile: any): ProfileFormData => ({
  firstName: profile?.firstName || '',
  lastName: profile?.lastName || '',
  email: profile?.email || '',
  phone: profile?.phone || '',
  cpfCnpj: profile?.cpfCnpj || '',
  city: profile?.city || '',
  state: profile?.state || '',
  userType: profile?.userType || '',
});

const Container = styled.div`
  ${pageShellCss}
`;

const Title = styled.h1`
  ${titleCss}
  font-size: 2.5rem;
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
  ${glassPanelCss}
  padding: 2rem;
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
  background: ${modernTheme.gradients.brand};
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
  color: ${modernTheme.colors.ink};
`;

const UserEmail = styled.p`
  text-align: center;
  color: ${modernTheme.colors.muted};
  margin-bottom: 1.5rem;
`;

const UserType = styled.div`
  display: inline-block;
  background: ${modernTheme.gradients.brand};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: ${modernTheme.radii.pill};
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
  background: rgba(255, 255, 255, 0.72);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.78);
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${modernTheme.colors.brandStrong};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${modernTheme.colors.muted};
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: ${modernTheme.colors.ink};
  margin: 0;
  font-weight: 600;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SectionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(246, 136, 92, 0.18) 0%, rgba(139, 92, 246, 0.16) 100%);
  color: ${modernTheme.colors.brandStrong};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 38px rgba(246, 136, 92, 0.12);
  flex-shrink: 0;
`;

const SectionHeaderText = styled.div`
  min-width: 0;
`;

const SectionSubtitle = styled.p`
  margin: 0.35rem 0 0;
  color: ${modernTheme.colors.muted};
  line-height: 1.6;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ $full?: boolean }>`
  padding: 1rem;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.76) 0%, rgba(255, 255, 255, 0.56) 100%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.06);
  ${props => (props.$full ? 'grid-column: 1 / -1;' : '')}

  @media (max-width: 960px) {
    grid-column: 1 / -1;
  }
`;

const FieldHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  margin-bottom: 0.85rem;
`;

const FieldIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(246, 136, 92, 0.14) 0%, rgba(139, 92, 246, 0.12) 100%);
  color: ${modernTheme.colors.brandStrong};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FieldCopy = styled.div`
  min-width: 0;
`;

const FieldHint = styled.p`
  margin: 0.18rem 0 0;
  color: ${modernTheme.colors.muted};
  font-size: 0.83rem;
  line-height: 1.45;
`;

const Label = styled.label`
  ${labelCss}
  margin-bottom: 0;
  font-size: 0.95rem;
`;

const Input = styled.input`
  ${formFieldCss}
  min-height: 54px;
  padding: 1rem 1.05rem;
  border-radius: 16px;
  border-color: rgba(15, 23, 42, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.84) 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 10px 22px rgba(15, 23, 42, 0.04);

  &:hover {
    border-color: rgba(246, 136, 92, 0.24);
    background: white;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
    background: rgba(248, 250, 252, 0.92);
    box-shadow: none;
  }
`;

const Select = styled.select`
  ${formFieldCss}
  min-height: 54px;
  padding: 1rem 1.05rem;
  border-radius: 16px;
  border-color: rgba(15, 23, 42, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.84) 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92), 0 10px 22px rgba(15, 23, 42, 0.04);

  &:hover {
    border-color: rgba(246, 136, 92, 0.24);
    background: white;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
    background: rgba(248, 250, 252, 0.92);
    box-shadow: none;
  }
`;

const FieldError = styled.small`
  color: #c62828;
  font-size: 0.85rem;
  margin-top: 0.55rem;
  display: block;
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
`;

const Button = styled.button`
  ${primaryButtonCss}
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  min-width: 190px;
`;

const DangerButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${modernTheme.radii.pill};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-width: 170px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 44px rgba(185, 28, 28, 0.22);
  }
`;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState<ProfileFormData>(createEmptyFormData());
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
        setFormData(mapUserToFormData(p));
        localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), ...p }));
      })
      .catch(() => {
        if (cancelled) return;
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.id) {
          setUser(userData);
          setFormData(mapUserToFormData(userData));
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
      const newUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      // Update local state
      setUser(newUserData);
      setFormData(mapUserToFormData(newUserData));
      
      alert('Perfil atualizado com sucesso! A página será recarregada para aplicar as alterações.');
      
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
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
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
        <Title>Carregando...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Meu Perfil</Title>
      
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
                <StatLabel>Reservas</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{vehiclesCount}</StatNumber>
                <StatLabel>Carros anunciados</StatLabel>
              </StatCard>
            </StatsGrid>
          </ProfileCard>
        </div>

        <div>
          <ProfileCard>
            <SectionHeader>
              <SectionIcon>
                <Info size={22} />
              </SectionIcon>
              <SectionHeaderText>
                <SectionTitle>Informações pessoais</SectionTitle>
                <SectionSubtitle>
                  Atualize seus dados de contato, documento e localização em um layout mais claro e agradável.
                </SectionSubtitle>
              </SectionHeaderText>
            </SectionHeader>

            <FormGrid>
              <FormGroup>
                <FieldHeader>
                  <FieldIcon>
                    <User size={18} />
                  </FieldIcon>
                  <FieldCopy>
                    <Label htmlFor="firstName">Nome</Label>
                    <FieldHint>Como seu nome aparece no perfil.</FieldHint>
                  </FieldCopy>
                </FieldHeader>
                <Input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FieldHeader>
                  <FieldIcon>
                    <User size={18} />
                  </FieldIcon>
                  <FieldCopy>
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <FieldHint>Usado em reservas e anúncios.</FieldHint>
                  </FieldCopy>
                </FieldHeader>
                <Input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup $full>
                <FieldHeader>
                  <FieldIcon>
                    <EmailIcon size={18} />
                  </FieldIcon>
                  <FieldCopy>
                    <Label htmlFor="email">E-mail</Label>
                    <FieldHint>Seu principal acesso e canal de comunicação da conta.</FieldHint>
                  </FieldCopy>
                </FieldHeader>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FieldHeader>
                  <FieldIcon>
                    <PhoneIcon size={18} />
                  </FieldIcon>
                  <FieldCopy>
                    <Label htmlFor="phone">Telefone</Label>
                    <FieldHint>Contato rápido para tratar reservas.</FieldHint>
                  </FieldCopy>
                </FieldHeader>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <FieldHeader>
                  <FieldIcon>
                    <Shield size={18} />
                  </FieldIcon>
                  <FieldCopy>
                    <Label htmlFor="cpfCnpj">CPF / CNPJ</Label>
                    <FieldHint>Documento usado para validar sua conta.</FieldHint>
                  </FieldCopy>
                </FieldHeader>
                <Input
                  id="cpfCnpj"
                  type="text"
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleInputChange}
                  placeholder="Somente números (11 ou 14 dígitos)"
                  maxLength={18}
                />
                {cpfError && <FieldError>{cpfError}</FieldError>}
              </FormGroup>

              <FormGroup>
                <FieldHeader>
                  <FieldIcon>
                    <LocationOn size={18} />
                  </FieldIcon>
                  <FieldCopy>
                    <Label htmlFor="state">Estado</Label>
                    <FieldHint>Selecione a UF principal do seu cadastro.</FieldHint>
                  </FieldCopy>
                </FieldHeader>
                <Select
                  id="state"
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
                <FieldHeader>
                  <FieldIcon>
                    <City size={18} />
                  </FieldIcon>
                  <FieldCopy>
                    <Label htmlFor="city">Cidade</Label>
                    <FieldHint>
                      {!formData.state
                        ? 'Escolha primeiro o estado para liberar as cidades.'
                        : loadingCities
                          ? 'Buscando as cidades disponíveis para a UF selecionada.'
                          : 'Sua cidade principal para reservas e anúncios.'}
                    </FieldHint>
                  </FieldCopy>
                </FieldHeader>
                <Select
                  id="city"
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

              <FormGroup $full>
                <FieldHeader>
                  <FieldIcon>
                    <Verified size={18} />
                  </FieldIcon>
                  <FieldCopy>
                    <Label htmlFor="userType">Tipo de conta</Label>
                    <FieldHint>Defina se deseja alugar carros, anunciar veículos ou fazer os dois.</FieldHint>
                  </FieldCopy>
                </FieldHeader>
                <Select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                >
                  <option value="lessee">Quero Alugar Carros (Locatário)</option>
                  <option value="lessor">Quero Alugar Meu Carro (Locador)</option>
                  <option value="both">Ambos (Locador e Locatário)</option>
                </Select>
              </FormGroup>
            </FormGrid>

            <ActionRow>
              <Button onClick={handleSave}>Salvar alterações</Button>
              
              <DangerButton onClick={handleDeleteAccount}>
                Excluir conta
              </DangerButton>
            </ActionRow>
          </ProfileCard>
        </div>
      </ProfileGrid>
    </Container>
  );
};

export default ProfilePage;
