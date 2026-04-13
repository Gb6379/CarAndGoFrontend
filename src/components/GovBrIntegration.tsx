import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CheckCircle } from './IconSystem';
import { authService } from '../services/authService';
import modernTheme from '../styles/modernTheme';
import {
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
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const isVerified = currentUser?.documentsVerified === true;

  useEffect(() => {
    let cancelled = false;

    authService.getProfile()
      .then((profile) => {
        if (cancelled) return;
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...storedUser, ...profile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      })
      .catch(() => {
        // Keep the local session state if the profile refresh fails.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleGoToUploadDocuments = () => {
    navigate('/verification/upload-documents');
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
        Envie sua CNH e sua CAC para analise. Depois do envio, nossa equipe revisara os documentos e
        avisara por e-mail quando a aprovacao for concluida.
      </Description>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button onClick={handleGoToUploadDocuments}>
          <CheckCircle size={16} /> Enviar documentos
        </Button>
      </div>
    </Container>
  );
};

export default GovBrIntegration;
