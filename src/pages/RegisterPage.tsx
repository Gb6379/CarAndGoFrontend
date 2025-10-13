import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../services/authService';
import { Car } from '../components/IconSystem';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const RegisterCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 1rem;
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
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
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
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #666;
  
  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const RegisterPage: React.FC = () => {
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
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha no cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Title><Car size={24} /> Cadastrar</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
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
          
          <Input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
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
            placeholder="Telefone"
            value={formData.phone}
            onChange={handleChange}
          />
          
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
