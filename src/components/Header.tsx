import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logoSvg from '../assets/logo.svg';
import { User, ArrowDown, Menu, Car, CreditCard, Close } from './IconSystem';
import AuthModal from './AuthModal';
import { authService } from '../services/authService';
import { 
  Inbox, 
  Gavel, 
  HeadsetMic,
  LogoutOutlined,
  VerifiedUser,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  DirectionsCar as CarIcon
} from '@mui/icons-material';
import { FlightTakeoff } from './IconSystem';

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
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;

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
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;

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

const DesktopOnly = styled.div`
  @media (max-width: 768px) {
    display: none !important;
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
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const HeaderAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background 0.3s ease;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background: #f8f9fa;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #333;
    font-size: 20px;
  }

  &.favorite {
    svg {
      color: #8B5CF6;
    }
    color: #8B5CF6;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #e5e5e5;
  margin: 0;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: #333;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid #f0f0f0;

  &:hover {
    background: #f8f9fa;
  }

  svg {
    width: 20px;
    height: 20px;
    font-size: 20px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  padding: 0.5rem;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  -webkit-tap-highlight-color: transparent;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenuOverlay = styled.div<{ isOpen: boolean }>`
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 999;
    opacity: ${p => p.isOpen ? 1 : 0};
    visibility: ${p => p.isOpen ? 'visible' : 'hidden'};
    transition: opacity 0.2s, visibility 0.2s;
    pointer-events: ${p => p.isOpen ? 'auto' : 'none'};
    cursor: pointer;
  }
`;

const MobileMenuPanel = styled.div<{ isOpen: boolean }>`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: min(320px, 100vw - 2rem);
    max-width: 100%;
    height: 100vh;
    background: white;
    box-shadow: -4px 0 20px rgba(0,0,0,0.15);
    z-index: 1001;
    padding: 0 0 1.5rem;
    overflow-y: auto;
    transform: ${p => p.isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.25s ease;
  }
`;

const MobileMenuHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #eee;
    flex-shrink: 0;
  }
`;

const MobileMenuUser = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MobileMenuAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const MobileMenuCloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  color: #333;
  cursor: pointer;
  border-radius: 8px;
  -webkit-tap-highlight-color: transparent;
  &:hover { background: #f0f0f0; }
`;

const MobileMenuLink = styled(Link)`
  padding: 1rem 1.5rem;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  -webkit-tap-highlight-color: transparent;
  svg { flex-shrink: 0; font-size: 20px; }
`;

const MobileMenuButtonAction = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  text-align: left;
  border: none;
  background: none;
  color: #333;
  font-weight: 500;
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  svg { flex-shrink: 0; font-size: 20px; }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [headerPhotoUrl, setHeaderPhotoUrl] = useState<string | null>(null);
  const headerPhotoBlobRef = useRef<string | null>(null);
  const isLoggedIn = !!localStorage.getItem('token');
  
  // Get user data to check userType and profile photo
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userType = userData.userType;

  const loadHeaderPhoto = () => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    if (!u?.profilePhoto) {
      if (headerPhotoBlobRef.current) {
        URL.revokeObjectURL(headerPhotoBlobRef.current);
        headerPhotoBlobRef.current = null;
      }
      setHeaderPhotoUrl(null);
      return;
    }
    const url = authService.getProfilePhotoUrl(u.profilePhoto);
    if (url) {
      setHeaderPhotoUrl(url);
      return;
    }
    if (u.profilePhoto === 'inline') {
      authService.fetchProfilePhotoBlobUrl().then((blobUrl) => {
        if (!blobUrl) return;
        if (headerPhotoBlobRef.current) URL.revokeObjectURL(headerPhotoBlobRef.current);
        headerPhotoBlobRef.current = blobUrl;
        setHeaderPhotoUrl(blobUrl);
      });
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isLoggedIn) {
      if (headerPhotoBlobRef.current) {
        URL.revokeObjectURL(headerPhotoBlobRef.current);
        headerPhotoBlobRef.current = null;
      }
      setHeaderPhotoUrl(null);
      return;
    }
    loadHeaderPhoto();
    const onPhotoUpdated = () => loadHeaderPhoto();
    window.addEventListener('profilePhotoUpdated', onPhotoUpdated);
    return () => {
      window.removeEventListener('profilePhotoUpdated', onPhotoUpdated);
      if (headerPhotoBlobRef.current) {
        URL.revokeObjectURL(headerPhotoBlobRef.current);
        headerPhotoBlobRef.current = null;
      }
    };
  }, [isLoggedIn, userData?.profilePhoto]);

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <HeaderContainer>
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClick={closeMobileMenu}
        onPointerDown={closeMobileMenu}
        aria-hidden="true"
        role="button"
        tabIndex={-1}
      />
      <MobileMenuPanel isOpen={isMobileMenuOpen}>
        <MobileMenuHeader>
          <MobileMenuUser>
            {isLoggedIn && (headerPhotoUrl ? (
              <MobileMenuAvatar src={headerPhotoUrl} alt="" />
            ) : (
              <MobileMenuAvatar as="span" style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} color="#666" />
              </MobileMenuAvatar>
            ))}
            <span style={{ fontWeight: 600, color: '#333' }}>
              {isLoggedIn ? (userData?.firstName ? `Olá, ${userData.firstName}` : 'Conta') : 'Menu'}
            </span>
          </MobileMenuUser>
          <MobileMenuCloseBtn
            type="button"
            onClick={closeMobileMenu}
            aria-label="Fechar menu"
          >
            <Close size={24} />
          </MobileMenuCloseBtn>
        </MobileMenuHeader>
        <MobileMenuLink to="/" onClick={closeMobileMenu}><DashboardIcon fontSize="small" /> Painel</MobileMenuLink>
        {(userType === 'lessee' || userType === 'both' || !isLoggedIn) && (
          <MobileMenuLink to="/vehicles" onClick={closeMobileMenu}><CarIcon fontSize="small" /> Encontrar Carros</MobileMenuLink>
        )}
        {(userType === 'lessor' || userType === 'both' || !isLoggedIn) && (
          <MobileMenuLink to="/list-vehicle" onClick={closeMobileMenu}><AddIcon fontSize="small" /> Anunciar Seu Carro</MobileMenuLink>
        )}
        <MobileMenuLink to="/how-it-works" onClick={closeMobileMenu}><InfoIcon fontSize="small" /> Como Funciona</MobileMenuLink>
        <MobileMenuLink to="/help" onClick={closeMobileMenu}><HelpIcon fontSize="small" /> Ajuda</MobileMenuLink>
        {isLoggedIn ? (
          <>
            <MobileMenuLink to="/bookings" onClick={closeMobileMenu}><FlightTakeoff size={20} /> Viagens</MobileMenuLink>
            <MobileMenuLink to="/profile" onClick={closeMobileMenu}><User size={20} /> Perfil</MobileMenuLink>
            <MobileMenuLink to="/verification" onClick={closeMobileMenu}><VerifiedUser fontSize="small" /> Verificação</MobileMenuLink>
            {(userType === 'lessor' || userType === 'both') && (
              <MobileMenuLink to="/bank-details" onClick={closeMobileMenu}><CreditCard size={20} /> Dados bancários</MobileMenuLink>
            )}
            <MobileMenuButtonAction
              onClick={() => { closeMobileMenu(); handleLogout(); }}
            >
              <LogoutOutlined fontSize="small" /> Sair
            </MobileMenuButtonAction>
          </>
        ) : (
          <>
            <MobileMenuButtonAction onClick={() => { closeMobileMenu(); openAuthModal('login'); }}>
              Entrar
            </MobileMenuButtonAction>
            <MobileMenuButtonAction onClick={() => { closeMobileMenu(); openAuthModal('register'); }}>
              Cadastrar
            </MobileMenuButtonAction>
          </>
        )}
      </MobileMenuPanel>
      <Nav>
        <Logo to="/">
          <LogoImage src={logoSvg} alt="Car and Go Logo" />
          CAR AND GO
        </Logo>
        
        <NavLinks>
          {/* Show "Encontrar Carros" only for lessees or both */}
          {(userType === 'lessee' || userType === 'both' || !isLoggedIn) && (
            <NavLink to="/vehicles">Encontrar Carros</NavLink>
          )}
          
          {/* Show "Anunciar Seu Carro" only for lessors or both */}
          {(userType === 'lessor' || userType === 'both' || !isLoggedIn) && (
            <NavLink to="/list-vehicle">Anunciar Seu Carro</NavLink>
          )}
          
          <NavLink to="/how-it-works">Como Funciona</NavLink>
          <NavLink to="/help">Ajuda</NavLink>
        </NavLinks>

        {isLoggedIn ? (
          <DesktopOnly>
          <UserMenu>
            <UserButton onClick={toggleUserMenu}>
              {headerPhotoUrl ? (
                <HeaderAvatar src={headerPhotoUrl} alt="" />
              ) : (
                <User size={16} />
              )}
              Conta
              <ArrowDown size={12} />
            </UserButton>
                        <DropdownMenu isOpen={isUserMenuOpen}>
              {/* Painel = tela inicial */}
              <DropdownItem 
                to="/"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <DashboardIcon fontSize="small" />
                Painel
              </DropdownItem>
              <DropdownDivider />
              {/* Seção Superior */}
              <DropdownItem 
                to="/bookings"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <FlightTakeoff size={20} />
                Viagens
              </DropdownItem>
              <DropdownItem 
                to="/inbox"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <Inbox fontSize="small" />
                Chat
              </DropdownItem>

              <DropdownDivider />

              {/* Seção Intermediária */}
              <DropdownItem 
                to="/profile"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <User size={20} />
                Perfil
              </DropdownItem>
              <DropdownItem 
                to="/verification"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <VerifiedUser size={20} />
                Verificação
              </DropdownItem>
              {(userType === 'lessor' || userType === 'both') && (
                <DropdownItem 
                  to="/bank-details"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <CreditCard size={20} />
                  Dados bancários
                </DropdownItem>
              )}
              <DropdownDivider />

              {/* Seção Inferior */}
              <DropdownItem 
                to="/support"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <HeadsetMic fontSize="small" />
                Suporte
              </DropdownItem>
              <DropdownItem 
                to="/legal"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <Gavel fontSize="small" />
                Legal
              </DropdownItem>

              <LogoutButton onClick={handleLogout}>
                <LogoutOutlined fontSize="small" />
                Sair
              </LogoutButton>
            </DropdownMenu>
          </UserMenu>
          </DesktopOnly>
        ) : (
          <DesktopOnly>
          <AuthButtons>
            <LoginButton onClick={() => openAuthModal('login')}>Entrar</LoginButton>
            <SignUpButton onClick={() => openAuthModal('register')}>Cadastrar</SignUpButton>
          </AuthButtons>
          </DesktopOnly>
        )}

        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menu"
        >
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