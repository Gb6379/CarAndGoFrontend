import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logoSvg from '../assets/logo.svg';
import { User, ArrowDown, Menu } from './IconSystem';
import AuthModal from './AuthModal';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  z-index: 1000;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #667eea;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    gap: 0.25rem;
  }
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const LoginButton = styled.button`
  background: none;
  border: none;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

const SignUpButton = styled.button`
  background: #667eea;
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  
  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  z-index: 1001;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: #e74c3c;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease;
  border-radius: 0 0 8px 8px;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <LogoImage src={logoSvg} alt="Car and Go Logo" />
          CAR AND GO
        </Logo>
        
        <NavLinks>
          <NavLink to="/vehicles">Encontrar Carros</NavLink>
          <NavLink to="/list-vehicle">Anunciar Seu Carro</NavLink>
          <NavLink to="/how-it-works">Como Funciona</NavLink>
          <NavLink to="/help">Ajuda</NavLink>
        </NavLinks>

        {isLoggedIn ? (
          <UserMenu>
            <UserButton onClick={toggleUserMenu}>
              <User size={16} />
              Conta
              <ArrowDown size={12} />
            </UserButton>
            <DropdownMenu isOpen={isUserMenuOpen}>
              <DropdownItem to="/dashboard">Painel</DropdownItem>
              <DropdownItem to="/profile">Perfil</DropdownItem>
              <DropdownItem to="/bookings">Minhas Reservas</DropdownItem>
              <DropdownItem to="/vehicles/my">Meus Carros</DropdownItem>
              <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
            </DropdownMenu>
          </UserMenu>
        ) : (
          <AuthButtons>
            <LoginButton onClick={() => openAuthModal('login')}>Entrar</LoginButton>
            <SignUpButton onClick={() => openAuthModal('register')}>Cadastrar</SignUpButton>
          </AuthButtons>
        )}

        <MobileMenuButton>
          <Menu size={24} />
        </MobileMenuButton>
      </Nav>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </HeaderContainer>
  );
};

export default Header;