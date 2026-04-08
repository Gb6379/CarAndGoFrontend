import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import GovBrIntegration from '../components/GovBrIntegration';
import { Lock } from '../components/IconSystem';
import modernTheme from '../styles/modernTheme';
import { errorNoticeCss, pageShellCss, subtitleCss, titleCss } from '../styles/modernPrimitives';

const Container = styled.div`
  ${pageShellCss}
`;

const Title = styled.h1`
  ${titleCss}
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Subtitle = styled.p`
  ${subtitleCss}
  margin-bottom: 2rem;
`;

const Alert = styled.p`
  ${errorNoticeCss}
  margin-bottom: 1.5rem;
`;

const VerificationPage: React.FC = () => {
  const location = useLocation();
  const state = (location.state || {}) as { from?: string; message?: string };
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLessor = user?.userType === 'host' || user?.userType === 'lessor' || user?.userType === 'both';

  return (
    <Container>
      <Title>
        <Lock size={24} />
        Verificação de Conta
      </Title>
      <Subtitle>
        {state.message || (isLessor ? 'Complete a verificação da sua conta para anunciar veículos.' : 'Complete a verificação da sua conta para realizar reservas.')}
      </Subtitle>
      {state.from === 'list-vehicle' && !state.message && (
        <Alert>Para anunciar um veículo é necessário validar CPF e antecedentes criminais.</Alert>
      )}
      <GovBrIntegration />
    </Container>
  );
};

export default VerificationPage;
