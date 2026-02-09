import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logoSvg from '../assets/logo.svg';
import { Facebook, Instagram, Twitter, LinkedIn } from './IconSystem';

const FooterContainer = styled.footer`
  background: #1a1a1a;
  color: white;
  padding: 4rem 2rem calc(2rem + env(safe-area-inset-bottom, 0px));
  margin-top: 4rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: white;
    font-weight: 600;
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
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: #667eea;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const LogoImage = styled.img`
  width: 35px;
  height: 35px;
  object-fit: contain;
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
  background: #333;
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #667eea;
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #333;
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
  color: #999;
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
    color: #999;
    text-decoration: none;
    font-size: 0.9rem;
    
    &:hover {
      color: #667eea;
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
            <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '1rem' }}>
              A maneira mais fácil de alugar um carro ou compartilhar o seu e ganhar dinheiro. 
              Junte-se a milhares de clientes satisfeitos em todo o Brasil.
            </p>
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
