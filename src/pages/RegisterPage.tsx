import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/authService';
import { Car } from '../components/IconSystem';
import { validateCpfCnpj } from '../utils/cpfValidation';
import { getErrorMessage, errorToDisplay } from '../utils/errorUtils';
import modernTheme from '../styles/modernTheme';
import {
  errorNoticeCss,
  formFieldCss,
  glassPanelCss,
  primaryButtonCss,
  subtitleCss,
  titleCss,
} from '../styles/modernPrimitives';

const RegisterContainer = styled.div`
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 2rem;
`;

const RegisterCard = styled.div`
  ${glassPanelCss}
  padding: 3rem;
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h1`
  text-align: center;
  ${titleCss}
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Subtitle = styled.p`
  ${subtitleCss}
  text-align: center;
  margin: -1.25rem auto 2rem;
  max-width: 360px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  ${formFieldCss}
`;

const Select = styled.select`
  ${formFieldCss}
`;

const Button = styled.button`
  ${primaryButtonCss}
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: ${modernTheme.colors.muted};
  
  a {
    color: ${modernTheme.colors.brandStrong};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  ${errorNoticeCss}
  padding: 0.75rem 0.9rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const FieldError = styled.span`
  display: block;
  color: #c62828;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
`;

const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordInput = styled(Input)`
  padding-right: 3rem;
`;

const PasswordToggleBtn = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${modernTheme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  -webkit-tap-highlight-color: transparent;
  &:hover { color: ${modernTheme.colors.ink}; background: rgba(15, 23, 42, 0.06); }
`;

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cpfCnpj: '',
    userType: 'lessee',
    phone: '',
    city: '',
    state: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ cpfCnpj?: string; phone?: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    setFormData({
      ...formData,
      [name]: e.target.value,
    });
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const cpfResult = validateCpfCnpj(formData.cpfCnpj);
    if (!cpfResult.valid) {
      setFieldErrors(prev => ({ ...prev, cpfCnpj: cpfResult.message }));
    }
    if (!(formData.phone || '').trim()) {
      setFieldErrors(prev => ({ ...prev, phone: 'Telefone é obrigatório.' }));
    }
    if (!cpfResult.valid || !(formData.phone || '').trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await authService.register({ ...formData, phone: (formData.phone || '').trim() });
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(getErrorMessage(err, 'Falha no cadastro'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title><Car size={24} /> Cadastrar</Title>
        <Subtitle>
          Crie sua conta para reservar, anunciar e acompanhar tudo em uma interface mais clara e moderna.
        </Subtitle>
        
        {error && <ErrorMessage>{errorToDisplay(error)}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="firstName"
            placeholder="Nome"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          
          <Input
            type="text"
            name="lastName"
            placeholder="Sobrenome"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          
          <Input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <PasswordWrapper>
            <PasswordInput
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordToggleBtn
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </PasswordToggleBtn>
          </PasswordWrapper>
          
          <Input
            type="text"
            name="cpfCnpj"
            placeholder="CPF/CNPJ"
            value={formData.cpfCnpj}
            onChange={handleChange}
            required
          />
          
          <Select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            required
          >
            <option value="lessee">Quero alugar carros</option>
            <option value="lessor">Quero alugar meu carro</option>
            <option value="both">Ambos</option>
          </Select>
          
          <Input
            type="tel"
            name="phone"
            placeholder="Telefone *"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {fieldErrors.phone && <FieldError>{fieldErrors.phone}</FieldError>}
          
          <Input
            type="text"
            name="city"
            placeholder="Cidade"
            value={formData.city}
            onChange={handleChange}
          />
          
          <Input
            type="text"
            name="state"
            placeholder="Estado"
            value={formData.state}
            onChange={handleChange}
          />
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando Conta...' : 'Cadastrar'}
          </Button>
        </Form>
        
        <LinkText>
          Já tem uma conta? <Link to="/login">Entre aqui</Link>
        </LinkText>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPage;
