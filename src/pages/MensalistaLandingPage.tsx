import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Calendar, Car, CheckCircle, Money } from '../components/IconSystem';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Hero = styled.section`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  border-radius: 16px;
  padding: 2.25rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
`;

const Subtitle = styled.p`
  margin: 0.75rem 0 0;
  font-size: 1.05rem;
  opacity: 0.96;
`;

const Steps = styled.div`
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled.div`
  background: #fff;
  border: 1px solid #e8ecf5;
  border-radius: 12px;
  padding: 1rem;
  color: #222;
`;

const StepTitle = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepText = styled.p`
  margin: 0;
  color: #556;
  font-size: 0.95rem;
`;

const Actions = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 0.9rem 1.2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: #fff;
  color: #3445a8;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    background: #f2f5ff;
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 10px;
  padding: 0.9rem 1.2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: transparent;
  color: #fff;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }
`;

const MensalistaLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Hero>
        <Title>Area de Aluguel Mensal de Carro</Title>
        <Subtitle>
          Voce esta na secao mensalista. Aqui voce escolhe um carro, recebe 20% de desconto no valor mensal e finaliza o pagamento.
        </Subtitle>

        <Steps>
          <StepCard>
            <StepTitle><Car size={18} /> 1. Escolha o carro</StepTitle>
            <StepText>Acesse os carros disponiveis e selecione o modelo ideal para o aluguel mensal.</StepText>
          </StepCard>
          <StepCard>
            <StepTitle><Calendar size={18} /> 2. Defina o mes</StepTitle>
            <StepText>No checkout mensalista, escolha o mes e confira o valor total com desconto.</StepText>
          </StepCard>
          <StepCard>
            <StepTitle><Money size={18} /> 3. Pague online</StepTitle>
            <StepText>Siga para o pagamento e conclua sua contratacao mensal de forma segura.</StepText>
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
      </Hero>
    </Container>
  );
};

export default MensalistaLandingPage;
