import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Calendar, Car, CheckCircle, Money } from '../components/IconSystem';
import modernTheme from '../styles/modernTheme';
import {
  darkPanelCss,
  glassPanelCss,
  pageShellCss,
  primaryButtonCss,
  secondaryButtonCss,
  titleCss,
} from '../styles/modernPrimitives';

const Container = styled.div`
  ${pageShellCss}
  min-height: calc(100vh - 96px);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    min-height: auto;
    align-items: stretch;
  }
`;

const Hero = styled.section`
  ${darkPanelCss}
  width: 100%;
  max-width: 1160px;
  padding: 2.25rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    border-radius: 24px;
  }
`;

const HeroInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.8rem;

  @media (max-width: 768px) {
    gap: 1.25rem;
  }
`;

const Title = styled.h1`
  ${titleCss}
  color: white;
  margin: 0;
  font-size: 2rem;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 1.05rem;
  opacity: 0.96;
  max-width: 760px;
  line-height: 1.65;

  @media (max-width: 768px) {
    font-size: 0.98rem;
  }
`;

const Steps = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 980px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 560px;
  }
`;

const StepCard = styled.div`
  ${glassPanelCss}
  padding: 1.15rem 1rem;
  color: ${modernTheme.colors.ink};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-height: 100%;
  position: relative;
  z-index: 1;
`;

const StepTitle = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepText = styled.p`
  margin: 0;
  color: ${modernTheme.colors.muted};
  font-size: 0.92rem;
  line-height: 1.55;
`;

const Actions = styled.div`
  margin: 0 auto;
  padding-top: 0.5rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 560px;
  position: relative;
  z-index: 2;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    padding-top: 0.25rem;
  }
`;

const PrimaryButton = styled.button`
  ${primaryButtonCss}
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 1.2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  color: white;
  min-width: 220px;
  flex: 1;

  @media (max-width: 640px) {
    width: 100%;
    min-width: 0;
  }
`;

const SecondaryButton = styled.button`
  ${secondaryButtonCss}
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 1.2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  min-width: 220px;
  flex: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }

  @media (max-width: 640px) {
    width: 100%;
    min-width: 0;
  }
`;

const MensalistaLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Hero>
        <HeroInner>
          <Title>Area de Aluguel Mensal de Carro</Title>
          <Subtitle>
            Escolha um carro, receba 20% de desconto no plano mensal e finalize tudo com um fluxo mais simples e direto.
          </Subtitle>

          <Steps>
            <StepCard>
              <StepTitle><Car size={18} /> 1. Escolha o carro</StepTitle>
              <StepText>Acesse os carros disponiveis e selecione o modelo ideal para o aluguel mensal.</StepText>
            </StepCard>
            <StepCard>
              <StepTitle><Calendar size={18} /> 2. Defina o mes</StepTitle>
              <StepText>Escolha o mes no checkout mensalista e veja o valor final ja com o desconto aplicado.</StepText>
            </StepCard>
            <StepCard>
              <StepTitle><Money size={18} /> 3. Pague online</StepTitle>
              <StepText>Conclua a contratacao com menos etapas e siga para o pagamento de forma segura.</StepText>
            </StepCard>
          </Steps>

          <Actions>
            <PrimaryButton onClick={() => navigate('/vehicles?flow=mensalista')}>
              Ver carros disponiveis
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('/mensalista/checkout')}>
              Ja tenho um carro selecionado
            </SecondaryButton>
          </Actions>
        </HeroInner>
      </Hero>
    </Container>
  );
};

export default MensalistaLandingPage;
