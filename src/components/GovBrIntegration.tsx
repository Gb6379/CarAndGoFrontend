import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckCircle, Error as ErrorIcon, Lock, Schedule } from './IconSystem';
import { authService } from '../services/authService';

const Container = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  margin: 2rem 0;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const StatusContainer = styled.div<{ status: 'idle' | 'loading' | 'success' | 'error' }>`
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  background: ${props => {
    switch (props.status) {
      case 'loading': return '#e3f2fd';
      case 'success': return '#e8f5e8';
      case 'error': return '#ffebee';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'loading': return '#1976d2';
      case 'success': return '#2e7d32';
      case 'error': return '#c62828';
      default: return '#666';
    }
  }};
`;

const VerifiedCard = styled.div`
  text-align: center;
  padding: 2.5rem 2rem;
  background: linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%);
  border: 2px solid #2e7d32;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

const VerifiedTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1b5e20;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const VerifiedText = styled.p`
  color: #2e7d32;
  margin: 0;
  font-size: 1.05rem;
`;

const GovBrIntegration: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isVerified = user?.documentsVerified === true;

  const handleGovBrAuth = async () => {
    setStatus('loading');
    setMessage('Redirecionando para o GOV.BR...');
    try {
      const state = Math.random().toString(36).substring(2, 15);
      const data = await authService.getGovBrAuthUrl();
      if (data.authUrl) {
        localStorage.setItem('govBrState', state);
        window.location.href = data.authUrl;
      } else {
        throw new Error('URL do GOV.BR não retornada');
      }
    } catch (error: any) {
      setStatus('error');
      const msg = error.response?.data?.message || error.message;
      setMessage(msg || 'Falha ao iniciar autenticação GOV.BR. Tente novamente.');
      console.error('GOV.BR auth error:', error);
    }
  };

  const handleDocumentValidation = async () => {
    setStatus('loading');
    setMessage('Validando CPF e consultando antecedentes...');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const document = (user.cpfCnpj || '').replace(/\D/g, '');

      if (!document) {
        setStatus('error');
        setMessage('Nenhum CPF/CNPJ encontrado no seu cadastro. Atualize seu perfil com seu CPF.');
        return;
      }

      const documentType = document.length === 11 ? 'CPF' : 'CNPJ';
      const data = await authService.validateDocument({ document, type: documentType });

      if (data.success && data.result?.isValid) {
        setStatus('success');
        setMessage('Documentos validados com sucesso. Você já pode anunciar veículos.');
        const updatedUser = { ...user, documentsVerified: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setStatus('error');
        setMessage(data.error || data.result?.errors?.join(', ') || 'Falha na validação. Verifique seus dados ou tente mais tarde.');
      }
    } catch (error: any) {
      setStatus('error');
      const res = error.response;
      let msg = 'Falha ao validar documentos. Tente novamente.';
      if (res?.status === 401) {
        msg = 'Sessão expirada. Faça login novamente.';
      } else if (res?.data?.error) {
        msg = res.data.error;
      } else if (res?.data?.message) {
        msg = res.data.message;
      } else if (error.code === 'ERR_NETWORK' || !res) {
        msg = 'Erro de conexão. Verifique se o servidor está rodando e sua internet.';
      }
      setMessage(msg);
      console.error('Document validation error:', error);
    }
  };

  if (isVerified) {
    return (
      <Container>
        <VerifiedCard>
          <VerifiedTitle>
            <CheckCircle size={32} strokeWidth={2.5} />
            Conta verificada
          </VerifiedTitle>
          <VerifiedText>Seu CPF e antecedentes foram validados. Você já pode anunciar veículos.</VerifiedText>
        </VerifiedCard>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        Verificação de documentos
      </Title>
      
      <Description>
        Para anunciar veículos, validamos seu CPF e consultamos antecedentes criminais. 
        Use o botão abaixo para validar com os dados do seu cadastro.
      </Description>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button onClick={handleGovBrAuth}>
          <Lock size={16} /> Entrar com GOV.BR
        </Button>
        
        <Button onClick={handleDocumentValidation}>
          <CheckCircle size={16} /> Validar CPF e antecedentes
        </Button>
      </div>

      {status !== 'idle' && (
        <StatusContainer status={status}>
          {status === 'loading' && <Schedule size={16} />}
          {status === 'success' && <CheckCircle size={16} />}
          {status === 'error' && <ErrorIcon size={16} />}
          {message}
        </StatusContainer>
      )}
    </Container>
  );
};

export default GovBrIntegration;
