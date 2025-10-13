import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Search, CalendarToday, Car, CreditCard, Key, Edit, Smartphone, AttachMoney, CheckCircle, Star, CameraAlt, Lock, Phone, Shield, User } from '../components/IconSystem';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 4rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 1.2rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  margin: 0 1rem;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
  }
`;

const Section = styled.section`
  margin-bottom: 4rem;
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
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 1rem;
  border-bottom: 1px solid #ddd;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  border: none;
  background: none;
  color: ${props => props.active ? '#667eea' : '#666'};
  border-bottom: 3px solid ${props => props.active ? '#667eea' : 'transparent'};
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;

  &:hover {
    color: #667eea;
  }
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const StepCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
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

const StepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
`;

const StepDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const StepImage = styled.div`
  width: 100%;
  height: 150px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const BenefitCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BenefitIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const BenefitTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
`;

const BenefitDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const ComparisonTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  margin: 3rem 0;
`;

const TableHeader = styled.div`
  background: #667eea;
  color: white;
  padding: 2rem;
  text-align: center;
`;

const TableTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div<{ header?: boolean }>`
  padding: 1.5rem;
  ${props => props.header ? 'font-weight: 600; background: #f8f9fa;' : ''}
  text-align: center;
  border-right: 1px solid #eee;

  &:last-child {
    border-right: none;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  padding: 0.5rem 0;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '✓';
    color: #667eea;
    font-weight: bold;
  }
`;

const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('guest');

  const guestSteps = [
    {
      icon: <Search size={24} />,
      title: 'Busque e Escolha',
      description: 'Encontre o carro perfeito na sua região. Use filtros para refinar por preço, tipo, recursos e localização.',
      image: <Search size={32} />
    },
    {
      icon: <CalendarToday size={24} />,
      title: 'Reserve e Pague',
      description: 'Selecione suas datas, revise os detalhes da reserva e pague com segurança através da nossa plataforma.',
      image: <CreditCard size={32} />
    },
    {
      icon: <Car size={24} />,
      title: 'Retire e Dirija',
      description: 'Encontre seu anfitrião no local de retirada ou use retirada sem contato. Pegue as chaves e comece sua jornada.',
      image: <Key size={32} />
    },
    {
      icon: <Star size={24} />,
      title: 'Devolva e Avalie',
      description: 'Devolva o carro no horário e local combinados. Deixe uma avaliação para ajudar outros hóspedes.',
      image: <Star size={32} />
    }
  ];

  const hostSteps = [
    {
      icon: <Edit size={24} />,
      title: 'Anuncie Seu Carro',
      description: 'Adicione detalhes do seu carro, fotos e defina seus preços. Nossa equipe ajudará a otimizar seu anúncio.',
      image: <CameraAlt size={32} />
    },
    {
      icon: <Smartphone size={24} />,
      title: 'Receba Reservas',
      description: 'Receba solicitações de reserva e comunique-se com hóspedes. Aprove ou recuse com base na sua disponibilidade.',
      image: <Smartphone size={32} />
    },
    {
      icon: <Lock size={24} />,
      title: 'Entregue as Chaves',
      description: 'Encontre seu hóspede ou use entrega sem contato. Certifique-se de que o carro está limpo e pronto para a viagem.',
      image: <Key size={32} />
    },
    {
      icon: <AttachMoney size={24} />,
      title: 'Ganhe Dinheiro',
      description: 'Receba pagamento automaticamente após cada viagem. Fique com 70% do valor da reserva, menos nossa taxa de serviço.',
      image: <AttachMoney size={32} />
    }
  ];

  const benefits = [
    {
      icon: <Shield size={24} />,
      title: 'Fully Insured',
      description: 'Comprehensive protection for every trip with liability and physical damage coverage.'
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Verified Users',
      description: 'All users are verified with government ID and background checks for your safety.'
    },
    {
      icon: <Phone size={24} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support and roadside assistance available whenever you need help.'
    },
    {
      icon: <Lock size={24} />,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing with fraud protection and dispute resolution.'
    }
  ];

  const comparisonData = [
    { feature: 'Processo de Reserva', turo: 'Baseado em aplicativo, instantâneo', traditional: 'Telefone/presencial, demorado' },
    { feature: 'Seleção de Veículos', turo: 'Carros únicos de locais', traditional: 'Veículos de frota padrão' },
    { feature: 'Preços', turo: 'Competitivos, transparentes', traditional: 'Taxas ocultas, caro' },
    { feature: 'Opções de Retirada', turo: 'Locais flexíveis', traditional: 'Limitado a escritórios de aluguel' },
    { feature: 'Suporte', turo: 'Suporte personalizado do anfitrião', traditional: 'Centrais de atendimento corporativas' },
    { feature: 'Experiência', turo: 'Pessoal, impulsionado pela comunidade', traditional: 'Impessoal, corporativo' }
  ];

  const protectionFeatures = [
    {
      title: 'Proteção Contra Danos Físicos',
      features: [
        'Até R$ 5 milhões em cobertura',
        'Múltiplos planos de proteção disponíveis',
        'Cobre danos de acidentes, roubo, vandalismo',
        'Opções de franquia de R$ 0 a R$ 15.000'
      ]
    },
    {
      title: '⚖️ Seguro de Responsabilidade Civil',
      features: [
        'Até R$ 5 milhões em cobertura de responsabilidade',
        'Inclui lesões corporais e danos materiais',
        'Cobertura primária para a maioria dos motoristas',
        'Cobre custos de defesa legal'
      ]
    },
    {
      title: '🆘 Assistência 24/7 na Estrada',
      features: [
        'Troca de pneus e partida de emergência',
        'Assistência para chave trancada',
        'Entrega de combustível',
        'Reboque até a oficina mais próxima'
      ]
    }
  ];

  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <HeroTitle>Como o CAR AND GO Funciona</HeroTitle>
        <HeroSubtitle>
          A maneira mais fácil de alugar um carro ou compartilhar o seu e ganhar dinheiro. 
          Junte-se a milhares de clientes satisfeitos em todo o Brasil.
        </HeroSubtitle>
        <div>
          <CTAButton onClick={() => navigate('/vehicles')}>
            Encontrar um Carro
          </CTAButton>
          <CTAButton onClick={() => navigate('/register')}>
            Anunciar Seu Carro
          </CTAButton>
        </div>
      </HeroSection>

      {/* How It Works Steps */}
      <Section>
        <SectionTitle>Como Funciona</SectionTitle>
        <SectionSubtitle>
          Seja para alugar um carro ou compartilhar o seu, tornamos tudo simples e seguro
        </SectionSubtitle>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'guest'} 
            onClick={() => setActiveTab('guest')}
          >
            Para Hóspedes
          </Tab>
          <Tab 
            active={activeTab === 'host'} 
            onClick={() => setActiveTab('host')}
          >
            Para Anfitriões
          </Tab>
        </TabsContainer>

        <StepsContainer>
          {(activeTab === 'guest' ? guestSteps : hostSteps).map((step, index) => (
            <StepCard key={index}>
              <StepImage>{step.image}</StepImage>
              <StepNumber>{index + 1}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </StepsContainer>
      </Section>

      {/* Why Choose CAR AND GO */}
      <Section>
        <SectionTitle>Por que escolher CAR AND GO?</SectionTitle>
        <SectionSubtitle>
          Estamos comprometidos em fornecer uma experiência segura, confiável e segura de compartilhamento de carros
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
      </Section>

      {/* Comparison Table */}
      <Section>
        <SectionTitle>CAR AND GO vs Aluguel de Carros Tradicional</SectionTitle>
        <SectionSubtitle>
          Veja por que milhares de pessoas escolhem o CAR AND GO em vez de empresas de aluguel de carros tradicionais
        </SectionSubtitle>
        
        <ComparisonTable>
          <TableHeader>
            <TableTitle>Por que escolher CAR AND GO?</TableTitle>
          </TableHeader>
          <TableRow>
            <TableCell header>Recurso</TableCell>
            <TableCell header>CAR AND GO</TableCell>
            <TableCell header>Aluguel Tradicional</TableCell>
          </TableRow>
          {comparisonData.map((row, index) => (
            <TableRow key={index}>
              <TableCell header>{row.feature}</TableCell>
              <TableCell>{row.turo}</TableCell>
              <TableCell>{row.traditional}</TableCell>
            </TableRow>
          ))}
        </ComparisonTable>
      </Section>

      {/* Pickup & Drop-off Options */}
      <Section>
        <SectionTitle>Opções Flexíveis de Retirada e Devolução</SectionTitle>
        <SectionSubtitle>
          Escolha o método de retirada e devolução que melhor funciona para você
        </SectionSubtitle>
        
        <FeatureGrid>
          <FeatureCard>
            <FeatureTitle><User size={18} /> Encontro Pessoal</FeatureTitle>
            <FeatureDescription>
              Encontre seu anfitrião em um local conveniente para ambos. Ideal para tirar dúvidas e receber dicas locais.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle><Lock size={18} /> Retirada Sem Contato</FeatureTitle>
            <FeatureDescription>
              Acesse o carro de forma autônoma usando um aplicativo ou caixa de chaves. Perfeito para flexibilidade e conveniência.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle><Car size={18} /> Entrega no Aeroporto</FeatureTitle>
            <FeatureDescription>
              Tenha o carro esperando por você no aeroporto. Comece sua viagem sem atrasos.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </Section>
      {/* Futuro Seguro */}
      
      {/* Protection & Support */}
      {/* <Section>
        <SectionTitle>Proteção e Suporte</SectionTitle>
        <SectionSubtitle>
          Proteção abrangente e suporte para cada viagem
        </SectionSubtitle>
        
        <FeatureGrid>
          {protectionFeatures.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureList>
                {feature.features.map((item, idx) => (
                  <FeatureItem key={idx}>{item}</FeatureItem>
                ))}
              </FeatureList>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </Section> */}

      {/* Getting Started */}
      <HeroSection>
        <HeroTitle>Pronto para começar?</HeroTitle>
        <HeroSubtitle>
          Junte-se a milhares de clientes satisfeitos em todo o Brasil. Comece sua jornada hoje!
        </HeroSubtitle>
        <div>
          <CTAButton onClick={() => navigate('/register')}>
            Cadastrar Agora
          </CTAButton>
          <CTAButton onClick={() => navigate('/vehicles')}>
            Navegar Carros
          </CTAButton>
        </div>
      </HeroSection>
    </Container>
  );
};

export default HowItWorksPage;
