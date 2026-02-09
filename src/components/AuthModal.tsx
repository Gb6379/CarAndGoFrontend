import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Close, User, Lock, Email, Phone, Home } from '../components/IconSystem';
import { authService } from '../services/authService';
import { validateCpfCnpj } from '../utils/cpfValidation';

interface IBGECity {
  id: number;
  nome: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  redirectOnSuccess?: string | null; // If null, don't redirect. If string, redirect to that path
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  margin: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const ModalSubtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
  color: ${props => props.active ? '#FF5A5F' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#FF5A5F' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    color: #FF5A5F;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InputLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
`;

const InputContainer = styled.div<{ $hasError?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  input {
    border-color: ${props => props.$hasError ? '#c33' : undefined};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #666;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  background: white;

  &:focus {
    outline: none;
    border-color: #FF5A5F;
  }

  &::placeholder {
    color: #999;
  }
`;

const SelectContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #FF5A5F;
  }
`;

const SubmitButton = styled.button`
  background: #FF5A5F;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #FF4449;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const SwitchModeText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const SwitchModeLink = styled.button`
  background: none;
  border: none;
  color: #FF5A5F;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;

  &:hover {
    color: #FF4449;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border-left: 4px solid #c33;
`;

const FieldError = styled.span`
  display: block;
  color: #c33;
  font-size: 0.8rem;
  margin-top: 0.35rem;
`;

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', redirectOnSuccess = '/dashboard' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Update mode when initialMode prop changes
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setRegisterErrors({});
    }
  }, [initialMode, isOpen]);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cpfCnpj: '',
    phone: '',
    city: '',
    state: '',
    userType: 'rent'
  });

  // Erros de validação por campo (cadastro)
  const [registerErrors, setRegisterErrors] = useState<{ cpfCnpj?: string; phone?: string }>({});

  // Cities from IBGE API
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch cities when state changes
  useEffect(() => {
    if (registerData.state) {
      setLoadingCities(true);
      setCities([]);
      setRegisterData(prev => ({ ...prev, city: '' }));
      
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${registerData.state}/municipios?orderBy=nome`)
        .then(response => response.json())
        .then((data: IBGECity[]) => {
          setCities(data);
          setLoadingCities(false);
        })
        .catch(error => {
          console.error('Erro ao carregar cidades:', error);
          setLoadingCities(false);
        });
    } else {
      setCities([]);
    }
  }, [registerData.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call real API
      const response = await authService.login(loginData.email, loginData.password);
      
      // Store token (backend returns access_token)
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      onClose();
      if (redirectOnSuccess) {
        navigate(redirectOnSuccess);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha no login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterErrors({});

    const cpfResult = validateCpfCnpj(registerData.cpfCnpj);
    if (!cpfResult.valid) {
      setRegisterErrors(prev => ({ ...prev, cpfCnpj: cpfResult.message }));
    }
    const phoneTrimmed = (registerData.phone || '').trim();
    if (!phoneTrimmed) {
      setRegisterErrors(prev => ({ ...prev, phone: 'Telefone é obrigatório.' }));
    }
    if (!cpfResult.valid || !phoneTrimmed) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.register({ ...registerData, phone: phoneTrimmed });
      
      // Store token (backend returns access_token)
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      onClose();
      if (redirectOnSuccess) {
        navigate(redirectOnSuccess);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha no cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <Close size={20} />
        </CloseButton>

        <ModalHeader>
          <ModalTitle>
            {mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </ModalTitle>
          <ModalSubtitle>
            {mode === 'login' 
              ? 'Entre na sua conta para continuar' 
              : 'Crie sua conta e comece a usar'
            }
          </ModalSubtitle>
        </ModalHeader>

        <TabsContainer>
          <TabButton 
            active={mode === 'login'} 
            onClick={() => setMode('login')}
          >
            Entrar
          </TabButton>
          <TabButton 
            active={mode === 'register'} 
            onClick={() => setMode('register')}
          >
            Cadastrar
          </TabButton>
        </TabsContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {mode === 'login' ? (
          <Form onSubmit={handleLogin}>
            <InputGroup>
              <InputLabel>E-mail</InputLabel>
              <InputContainer>
                <InputIcon>
                  <Email size={18} />
                </InputIcon>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </InputContainer>
            </InputGroup>

            <InputGroup>
              <InputLabel>Senha</InputLabel>
              <InputContainer>
                <InputIcon>
                  <Lock size={18} />
                </InputIcon>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </InputContainer>
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </SubmitButton>
          </Form>
        ) : (
          <Form onSubmit={handleRegister}>
            <InputGroup>
              <InputLabel>Nome</InputLabel>
              <InputContainer>
                <InputIcon>
                  <User size={18} />
                </InputIcon>
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </InputContainer>
            </InputGroup>

            <InputGroup>
              <InputLabel>Sobrenome</InputLabel>
              <InputContainer>
                <InputIcon>
                  <User size={18} />
                </InputIcon>
                <Input
                  type="text"
                  placeholder="Seu sobrenome"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </InputContainer>
            </InputGroup>

            <InputGroup>
              <InputLabel>E-mail</InputLabel>
              <InputContainer>
                <InputIcon>
                  <Email size={18} />
                </InputIcon>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </InputContainer>
            </InputGroup>

            <InputGroup>
              <InputLabel>CPF/CNPJ</InputLabel>
              <InputContainer $hasError={!!registerErrors.cpfCnpj}>
                <InputIcon>
                  <User size={18} />
                </InputIcon>
                <Input
                  type="text"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={registerData.cpfCnpj}
                  onChange={(e) => {
                    setRegisterData(prev => ({ ...prev, cpfCnpj: e.target.value }));
                    if (registerErrors.cpfCnpj) setRegisterErrors(prev => ({ ...prev, cpfCnpj: undefined }));
                  }}
                  required
                />
              </InputContainer>
              {registerErrors.cpfCnpj && <FieldError>{registerErrors.cpfCnpj}</FieldError>}
            </InputGroup>

            <InputGroup>
              <InputLabel>Senha</InputLabel>
              <InputContainer>
                <InputIcon>
                  <Lock size={18} />
                </InputIcon>
                <Input
                  type="password"
                  placeholder="Sua senha"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </InputContainer>
            </InputGroup>

            <InputGroup>
              <InputLabel>Telefone *</InputLabel>
              <InputContainer $hasError={!!registerErrors.phone}>
                <InputIcon>
                  <Phone size={18} />
                </InputIcon>
                <Input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={registerData.phone}
                  onChange={(e) => {
                    setRegisterData(prev => ({ ...prev, phone: e.target.value }));
                    if (registerErrors.phone) setRegisterErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  required
                />
              </InputContainer>
              {registerErrors.phone && <FieldError>{registerErrors.phone}</FieldError>}
            </InputGroup>

            <InputGroup>
              <InputLabel>Estado</InputLabel>
              <SelectContainer>
                <InputIcon>
                  <Home size={18} />
                </InputIcon>
                <Select
                  value={registerData.state}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, state: e.target.value }))}
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
              </SelectContainer>
            </InputGroup>

            <InputGroup>
              <InputLabel>Cidade</InputLabel>
              <SelectContainer>
                <InputIcon>
                  <Home size={18} />
                </InputIcon>
                <Select
                  value={registerData.city}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, city: e.target.value }))}
                  disabled={!registerData.state || loadingCities}
                >
                  <option value="">
                    {!registerData.state 
                      ? 'Selecione o estado primeiro' 
                      : loadingCities 
                        ? 'Carregando cidades...' 
                        : 'Selecione sua cidade'}
                  </option>
                  {cities.map(city => (
                    <option key={city.id} value={city.nome}>
                      {city.nome}
                    </option>
                  ))}
                </Select>
              </SelectContainer>
            </InputGroup>

            <InputGroup>
              <InputLabel>Tipo de Usuário</InputLabel>
              <SelectContainer>
                <InputIcon>
                  <User size={18} />
                </InputIcon>
                <Select
                  value={registerData.userType}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, userType: e.target.value }))}
                >
                  <option value="rent">Quero alugar carros</option>
                  <option value="host">Quero alugar meu carro</option>
                  <option value="both">Ambos</option>
                </Select>
              </SelectContainer>
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Criando Conta...' : 'Cadastrar'}
            </SubmitButton>
          </Form>
        )}

        <SwitchModeText>
          {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <br />
          <SwitchModeLink onClick={switchMode}>
            {mode === 'login' ? 'Cadastrar aqui' : 'Entrar aqui'}
          </SwitchModeLink>
        </SwitchModeText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AuthModal;
