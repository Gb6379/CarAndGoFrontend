import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoSvg from '../assets/logo.svg';
import { Facebook, Instagram, Twitter, LinkedIn } from './IconSystem';
import modernTheme from '../styles/modernTheme';

const FooterContainer = styled.footer`
  position: relative;
  overflow: hidden;
  background: ${modernTheme.gradients.dark};
  color: white;
  padding: 5rem 2rem calc(2rem + env(safe-area-inset-bottom, 0px));
  margin-top: 4rem;

  &::before {
    content: '';
    position: absolute;
    inset: -20% auto auto -10%;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: rgba(246, 136, 92, 0.18);
    filter: blur(80px);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: auto -5% -25% auto;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.18);
    filter: blur(90px);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
  }
`;

const FooterContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${modernTheme.widths.content};
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FooterSection = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 1.5rem;
  backdrop-filter: blur(16px);

  h3 {
    font-size: 1.05rem;
    margin-bottom: 1.25rem;
    color: white;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: rgba(226, 232, 240, 0.84);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #fff;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.03em;
`;

const LogoImage = styled.img`
  width: 35px;
  height: 35px;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(246, 136, 92, 0.32));
`;

const FooterLead = styled.p`
  color: rgba(226, 232, 240, 0.82);
  line-height: 1.7;
  margin: 0 0 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${modernTheme.gradients.brand};
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: rgba(226, 232, 240, 0.72);
  margin: 0;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }

  a {
    color: rgba(226, 232, 240, 0.72);
    text-decoration: none;
    font-size: 0.9rem;
    
    &:hover {
      color: white;
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <Logo>
              <LogoImage src={logoSvg} alt="Car and Go Logo" />
              CAR AND GO
            </Logo>
            <FooterLead>
              A maneira mais fácil de alugar um carro ou compartilhar o seu e ganhar dinheiro. 
              Junte-se a milhares de clientes satisfeitos em todo o Brasil.
            </FooterLead>
            <SocialLinks>
              <SocialLink href="#" aria-label="Facebook"><Facebook size={20} /></SocialLink>
              <SocialLink href="#" aria-label="Instagram"><Instagram size={20} /></SocialLink>
              <SocialLink href="#" aria-label="Twitter"><Twitter size={20} /></SocialLink>
              <SocialLink href="#" aria-label="LinkedIn"><LinkedIn size={20} /></SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>Para Hóspedes</h3>
            <ul>
              <li><Link to="/vehicles">Encontrar um Carro</Link></li>
              <li><Link to="/how-it-works">Como Funciona</Link></li>
              <li><Link to="/safety">Segurança</Link></li>
              <li><Link to="/insurance">Seguro</Link></li>
              <li><Link to="/help">Central de Ajuda</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Para Anfitriões</h3>
            <ul>
              <li><Link to="/host">Tornar-se Anfitrião</Link></li>
              <li><Link to="/host/how-it-works">Guia de Hospedagem</Link></li>
              <li><Link to="/host/protection">Proteção do Anfitrião</Link></li>
              <li><Link to="/host/earnings">Calculadora de Ganhos</Link></li>
              <li><Link to="/host/resources">Recursos</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Empresa</h3>
            <ul>
              <li><Link to="/about">Sobre Nós</Link></li>
              <li><Link to="/careers">Carreiras</Link></li>
              <li><Link to="/press">Imprensa</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contato</Link></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Suporte</h3>
            <ul>
              <li><Link to="/help">Central de Ajuda</Link></li>
              <li><Link to="/safety">Central de Segurança</Link></li>
              <li><Link to="/community">Diretrizes da Comunidade</Link></li>
              <li><Link to="/accessibility">Acessibilidade</Link></li>
              <li><Link to="/contact">Contatar Suporte</Link></li>
            </ul>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>
            © 2024 CAR AND GO. Todos os direitos reservados.
          </Copyright>
          <LegalLinks>
            <Link to="/privacy">Política de Privacidade</Link>
            <Link to="/terms">Termos de Serviço</Link>
            <Link to="/cookies">Política de Cookies</Link>
            <Link to="/accessibility">Acessibilidade</Link>
          </LegalLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
