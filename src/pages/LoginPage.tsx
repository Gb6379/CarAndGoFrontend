import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../services/authService';
import { Car } from '../components/IconSystem';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
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
  padding: 0.75rem;
  border-radius: 5px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const RegisterLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState<string>('');
  const [isUserNotFound, setIsUserNotFound] = useState(false);
  const navigate = useNavigate();

  // Safe setError function that only accepts strings
  const setError = (message: string) => {
    if (typeof message === 'string') {
      setErrorState(message);
    } else {
      console.error('Attempted to set non-string error:', message);
      setErrorState('Falha no login. Tente novamente.');
    }
  };

  // Monitor error state to ensure it's always a string
  React.useEffect(() => {
    if (error && typeof error !== 'string') {
      console.error('Error state is not a string:', error);
      setErrorState('Falha no login. Tente novamente.');
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsUserNotFound(false);

    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err: any) {
      console.log('Login error:', err);
      console.log('Error response:', err.response?.data);
      console.log('Error status:', err.response?.status);
      
      // Completely defensive error handling - ensure we never set an object
      let errorMessage = 'Falha no login. Tente novamente.';
      let userNotFound = false;
      
      try {
        // Check if it's a user not found error (by message content)
        if (err.response?.data?.message && typeof err.response.data.message === 'string') {
          if (err.response.data.message.includes('User not found')) {
            errorMessage = 'Usuário não cadastrado.';
            userNotFound = true;
          } else if (err.response.data.message.includes('Invalid password')) {
            errorMessage = 'Senha incorreta. Tente novamente.';
          } else {
            errorMessage = err.response.data.message;
          }
        } else if (typeof err.response?.data === 'string') {
          errorMessage = err.response.data;
        } else if (typeof err.message === 'string') {
          errorMessage = err.message;
        }
      } catch (parseError) {
        console.log('Error parsing error message:', parseError);
        // Keep default error message
      }
      
      // Final safety check - ensure it's a string
      const safeErrorMessage = typeof errorMessage === 'string' ? errorMessage : 'Falha no login. Tente novamente.';
      
      console.log('Setting error message:', safeErrorMessage);
      setError(safeErrorMessage);
      setIsUserNotFound(userNotFound);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title><Car size={24} /> Entrar</Title>
        
        {error && typeof error === 'string' && (
          <ErrorMessage>
            {error}
            {isUserNotFound && (
              <div style={{ marginTop: '0.5rem' }}>
                <RegisterLink to="/register">Clique aqui para se cadastrar</RegisterLink>
              </div>
            )}
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
          />
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
        
        <LinkText>
          Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
        </LinkText>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
