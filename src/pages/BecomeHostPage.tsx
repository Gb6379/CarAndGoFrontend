import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Money,
  Calendar,
  Shield,
  Check,
  Star,
  TrendingUp,
  Timer,
  Edit,
  Smartphone,
  Payment,
  Location,
  Phone,
  Lock,
  People,
  ArrowRight,
  BarChart,
  Security
} from '../components/IconSystem';

// Hero Section
const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="4"/></g></svg>');
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    padding: 4rem 1.5rem 3rem;
  }
`;

const HeroContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.4rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const CTAButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

// Benefits Section
const BenefitsSection = styled.section`
  padding: 6rem 2rem;
  background: white;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BenefitCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
`;

const BenefitIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
  font-size: 1.5rem;
`;

const BenefitTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
`;

const BenefitDescription = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const StepCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
`;

const StepIcon = styled.div`
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
`;

const StepDescription = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
`;

// Earnings Calculator Section
const CalculatorSection = styled.section`
  padding: 6rem 2rem;
  background: white;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const CalculatorContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const CalculatorForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ResultBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #667eea;
`;

const ResultLabel = styled.div`
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const ResultAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const ResultPeriod = styled.div`
  font-size: 0.9rem;
  color: #999;
`;

// Success Stories Section
const SuccessSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TestimonialCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const TestimonialHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const TestimonialInfo = styled.div`
  flex: 1;
`;

const TestimonialName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const TestimonialLocation = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  color: #ffc107;
  margin-bottom: 1rem;
`;

const TestimonialText = styled.p`
  color: #666;
  line-height: 1.6;
  font-style: italic;
`;

const TestimonialEarnings = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  color: #667eea;
  font-weight: 600;
`;

// Protection Section
const ProtectionSection = styled.section`
  padding: 6rem 2rem;
  background: white;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const ProtectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProtectionCard = styled.div`
  text-align: center;
  padding: 2rem;
`;

const ProtectionIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
`;

const ProtectionTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
`;

const ProtectionDescription = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
`;

// Requirements Section
const RequirementsSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const RequirementsList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const RequirementIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  font-size: 1.2rem;
`;

const RequirementContent = styled.div`
  flex: 1;
`;

const RequirementTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
`;

const RequirementDescription = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
`;

// Final CTA Section
const FinalCTASection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const FinalCTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FinalCTASubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const BecomeHostPage: React.FC = () => {
  const navigate = useNavigate();
  const [calculatorInputs, setCalculatorInputs] = useState({
    dailyRate: '',
    daysPerMonth: ''
  });

  const calculateEarnings = () => {
    const daily = parseFloat(calculatorInputs.dailyRate) || 0;
    const days = parseFloat(calculatorInputs.daysPerMonth) || 0;
    const monthly = daily * days;
    const yearly = monthly * 12;
    return { monthly, yearly };
  };

  const earnings = calculateEarnings();

  const benefits = [
    {
      icon: <Money size={24} />,
      title: 'Ganhe Dinheiro Extra',
      description: 'Transforme seu carro parado em uma fonte de renda. Anfitriões em média ganham R$ 1.500 por mês alugando seus veículos.'
    },
    {
      icon: <Timer size={24} />,
      title: 'Flexibilidade Total',
      description: 'Você decide quando e por quanto tempo seu carro fica disponível. Controle total sobre seu calendário de aluguel.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Proteção Completa',
      description: 'Cobertura de seguro abrangente para seu veículo e tranquilidade durante todo o período de aluguel.'
    },
    {
      icon: <People size={24} />,
      title: 'Comunidade Confiável',
      description: 'Nossa plataforma verifica todos os locatários, garantindo segurança e confiança em cada reserva.'
    },
    {
      icon: <Smartphone size={24} />,
      title: 'Fácil de Gerenciar',
      description: 'Gerencie reservas, comunique-se com clientes e acompanhe seus ganhos tudo pelo app ou site.'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Crescimento Contínuo',
      description: 'Quanto mais você aluga, melhor suas avaliações, maior sua visibilidade e maiores seus ganhos.'
    }
  ];

  const steps = [
    {
      icon: <Edit size={24} />,
      title: 'Anuncie Seu Carro',
      description: 'Cadastre seu veículo com fotos e detalhes. O processo leva menos de 10 minutos.'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Receba Reservas',
      description: 'Defina suas datas disponíveis e preços. Receba solicitações de locatários verificados.'
    },
    {
      icon: <Payment size={24} />,
      title: 'Receba Pagamentos',
      description: 'Pagamentos seguros são transferidos diretamente para sua conta. Você mantém 70% dos ganhos.'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Silva',
      location: 'São Paulo, SP',
      rating: 5,
      text: 'Em apenas 3 meses já consegui pagar o financiamento do meu carro! A plataforma é muito fácil de usar e os clientes são todos verificados.',
      earnings: 'R$ 4.200/mês'
    },
    {
      name: 'Ana Costa',
      location: 'Rio de Janeiro, RJ',
      rating: 5,
      text: 'Estou usando meu carro apenas nos finais de semana, e durante a semana ele está gerando uma renda extra incrível. Recomendo muito!',
      earnings: 'R$ 2.800/mês'
    },
    {
      name: 'Roberto Santos',
      location: 'Belo Horizonte, MG',
      rating: 5,
      text: 'O suporte é excelente e me sinto seguro alugando meu veículo. Já tenho clientes recorrentes que sempre voltam a alugar.',
      earnings: 'R$ 3.500/mês'
    }
  ];

  const protections = [
    {
      icon: <Shield size={24} />,
      title: 'Seguro Completo',
      description: 'Cobertura de seguro abrangente para seu veículo durante todo o período de aluguel'
    },
    {
      icon: <Security size={24} />,
      title: 'Verificação de Locatários',
      description: 'Todos os locatários são verificados antes de poderem fazer reservas'
    },
    {
      icon: <Lock size={24} />,
      title: 'Proteção Financeira',
      description: 'Garantia de pagamento e proteção contra danos não cobertos pelo seguro'
    },
    {
      icon: <Phone size={24} />,
      title: 'Suporte 24/7',
      description: 'Nossa equipe está sempre disponível para ajudar em qualquer situação'
    }
  ];

  const requirements = [
    {
      icon: <Car size={20} />,
      title: 'Veículo em Bom Estado',
      description: 'Seu carro deve estar em boas condições mecânicas e estéticas, com documentação em dia.'
    },
    {
      icon: <Check size={20} />,
      title: 'Documentação Completa',
      description: 'CNH válida, documento do veículo (CRLV), seguro e demais documentos necessários.'
    },
    {
      icon: <Calendar size={20} />,
      title: 'Disponibilidade',
      description: 'Defina quando seu carro está disponível para aluguel. Você tem controle total sobre o calendário.'
    },
    {
      icon: <Location size={20} />,
      title: 'Localização',
      description: 'Seu veículo deve estar em uma área onde há demanda por aluguel de carros.'
    },
    {
      icon: <Star size={20} />,
      title: 'Comprometimento',
      description: 'Mantenha seu carro limpo e bem cuidado, e responda rapidamente às solicitações de reserva.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Ganhe Dinheiro Alugando Seu Carro</HeroTitle>
          <HeroSubtitle>
            Transforme seu veículo em uma fonte de renda. Anfitriões ganham em média R$ 1.500 por mês na CarGoApp.
          </HeroSubtitle>
          <CTAButton onClick={() => navigate('/list-vehicle')}>
            Começar Agora
            <ArrowRight size={20} />
          </CTAButton>
          
          <HeroStats>
            <StatCard>
              <StatNumber>70%</StatNumber>
              <StatLabel>dos ganhos são seus</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>suporte disponível</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>100%</StatNumber>
              <StatLabel>protegido e segurado</StatLabel>
            </StatCard>
          </HeroStats>
        </HeroContent>
      </HeroSection>

      {/* Benefits Section */}
      <BenefitsSection>
        <SectionTitle>Por Que Se Tornar um Anfitrião?</SectionTitle>
        <SectionSubtitle>
          Descubra como é fácil e lucrativo compartilhar seu carro na CarGoApp
        </SectionSubtitle>
        
        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index}>
              <BenefitIcon>{benefit.icon}</BenefitIcon>
              <BenefitTitle>{benefit.title}</BenefitTitle>
              <BenefitDescription>{benefit.description}</BenefitDescription>
            </BenefitCard>
          ))}
        </BenefitsGrid>
      </BenefitsSection>

      {/* How It Works Section */}
      <HowItWorksSection>
        <SectionTitle>Como Funciona</SectionTitle>
        <SectionSubtitle>
          Três passos simples para começar a ganhar dinheiro
        </SectionSubtitle>
        
        <StepsContainer>
          {steps.map((step, index) => (
            <StepCard key={index}>
              <StepNumber>{index + 1}</StepNumber>
              <StepIcon>{step.icon}</StepIcon>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </StepsContainer>
      </HowItWorksSection>

      {/* Earnings Calculator Section */}
      <CalculatorSection>
        <SectionTitle>Quanto Você Pode Ganhar?</SectionTitle>
        <SectionSubtitle>
          Use nossa calculadora para estimar seus ganhos mensais
        </SectionSubtitle>
        
        <CalculatorContainer>
          <CalculatorForm>
            <FormGroup>
              <Label>Taxa Diária (R$)</Label>
              <Input
                type="number"
                placeholder="150"
                value={calculatorInputs.dailyRate}
                onChange={(e) => setCalculatorInputs(prev => ({ ...prev, dailyRate: e.target.value }))}
              />
            </FormGroup>
            <FormGroup>
              <Label>Dias Disponíveis por Mês</Label>
              <Input
                type="number"
                placeholder="20"
                value={calculatorInputs.daysPerMonth}
                onChange={(e) => setCalculatorInputs(prev => ({ ...prev, daysPerMonth: e.target.value }))}
              />
            </FormGroup>
          </CalculatorForm>
          
          <ResultBox>
            <ResultLabel>Ganho Estimado</ResultLabel>
            <ResultAmount>
              R$ {earnings.monthly.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </ResultAmount>
            <ResultPeriod>por mês • R$ {earnings.yearly.toLocaleString('pt-BR')} por ano</ResultPeriod>
          </ResultBox>
          
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
            * Valores são estimativas. Você mantém 70% dos ganhos, 30% vai para a plataforma.
          </p>
        </CalculatorContainer>
      </CalculatorSection>

      {/* Success Stories Section */}
      <SuccessSection>
        <SectionTitle>Histórias de Sucesso</SectionTitle>
        <SectionSubtitle>
          Veja como outros anfitriões estão ganhando dinheiro na CarGoApp
        </SectionSubtitle>
        
        <TestimonialsGrid>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index}>
              <TestimonialHeader>
                <Avatar>{testimonial.name.charAt(0)}</Avatar>
                <TestimonialInfo>
                  <TestimonialName>{testimonial.name}</TestimonialName>
                  <TestimonialLocation>{testimonial.location}</TestimonialLocation>
                </TestimonialInfo>
              </TestimonialHeader>
              <Stars>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} />
                ))}
              </Stars>
              <TestimonialText>"{testimonial.text}"</TestimonialText>
              <TestimonialEarnings>
                <BarChart size={16} style={{ marginRight: '0.5rem' }} />
                {testimonial.earnings}
              </TestimonialEarnings>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </SuccessSection>

      {/* Protection Section */}
      <ProtectionSection>
        <SectionTitle>Proteção e Segurança</SectionTitle>
        <SectionSubtitle>
          Seu veículo está protegido em todas as situações
        </SectionSubtitle>
        
        <ProtectionGrid>
          {protections.map((protection, index) => (
            <ProtectionCard key={index}>
              <ProtectionIcon>{protection.icon}</ProtectionIcon>
              <ProtectionTitle>{protection.title}</ProtectionTitle>
              <ProtectionDescription>{protection.description}</ProtectionDescription>
            </ProtectionCard>
          ))}
        </ProtectionGrid>
      </ProtectionSection>

      {/* Requirements Section */}
      <RequirementsSection>
        <SectionTitle>Requisitos para Se Tornar Anfitrião</SectionTitle>
        <SectionSubtitle>
          O que você precisa para começar
        </SectionSubtitle>
        
        <RequirementsList>
          {requirements.map((requirement, index) => (
            <RequirementItem key={index}>
              <RequirementIcon>{requirement.icon}</RequirementIcon>
              <RequirementContent>
                <RequirementTitle>{requirement.title}</RequirementTitle>
                <RequirementDescription>{requirement.description}</RequirementDescription>
              </RequirementContent>
            </RequirementItem>
          ))}
        </RequirementsList>
      </RequirementsSection>

      {/* Final CTA Section */}
      <FinalCTASection>
        <FinalCTATitle>Pronto para Começar?</FinalCTATitle>
        <FinalCTASubtitle>
          Junte-se a milhares de anfitriões que já estão ganhando dinheiro compartilhando seus carros na CarGoApp
        </FinalCTASubtitle>
        <CTAButton onClick={() => navigate('/list-vehicle')}>
          Anunciar Meu Carro Agora
          <ArrowRight size={20} />
        </CTAButton>
      </FinalCTASection>
    </>
  );
};

export default BecomeHostPage;

