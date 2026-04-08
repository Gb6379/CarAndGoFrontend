import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CheckCircle, Error as ErrorIcon, Schedule } from './IconSystem';
import { authService } from '../services/authService';
import modernTheme from '../styles/modernTheme';
import {
  errorNoticeCss,
  glassPanelCss,
  primaryButtonCss,
  successNoticeCss,
  titleCss,
} from '../styles/modernPrimitives';

const Container = styled.div`
  ${glassPanelCss}
  padding: 2rem;
  margin: 2rem 0;
`;

const Title = styled.h3`
  ${titleCss}
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.p`
  color: ${modernTheme.colors.muted};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const Button = styled.button`
  ${primaryButtonCss}
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusContainer = styled.div<{ status: 'idle' | 'loading' | 'success' | 'error' }>`
  ${props => props.status === 'success' ? successNoticeCss : props.status === 'error' ? errorNoticeCss : glassPanelCss}
  padding: 1rem;
  margin-top: 1rem;
  color: ${props => {
    switch (props.status) {
      case 'loading': return modernTheme.colors.inkSoft;
      case 'success': return '#047857';
      case 'error': return '#b91c1c';
      default: return modernTheme.colors.muted;
    }
  }};
`;

const VerifiedCard = styled.div`
  text-align: center;
  padding: 2.5rem 2rem;
  ${successNoticeCss}
  border-radius: 24px;
  margin-bottom: 1.5rem;
`;

const VerifiedTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const VerifiedText = styled.p`
  color: #047857;
  margin: 0;
  font-size: 1.05rem;
`;

const GovBrIntegration: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isVerified = user?.documentsVerified === true;

  const handleGoToUploadDocuments = () => {
    navigate('/verification/upload-documents');
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
            <CheckCircle size={32} />
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
        <Button onClick={handleGoToUploadDocuments}>
          <CheckCircle size={16} /> Validar documentos
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
