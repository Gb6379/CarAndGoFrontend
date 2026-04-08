import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logoSvg from '../assets/logo.svg';
import { User, ArrowDown, Menu, Car, CreditCard, Close } from './IconSystem';
import AuthModal from './AuthModal';
import { authService } from '../services/authService';
import modernTheme from '../styles/modernTheme';
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
  background: rgba(248, 251, 255, 0.72);
  backdrop-filter: blur(24px) saturate(165%);
  -webkit-backdrop-filter: blur(24px) saturate(165%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
  padding: 1rem 2rem;
  z-index: 1000;
  transition: background 0.3s ease, box-shadow 0.3s ease;

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
  max-width: ${modernTheme.widths.content};
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${modernTheme.colors.ink};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.03em;
  
  &:hover {
    color: ${modernTheme.colors.brandStrong};
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
  filter: drop-shadow(0 10px 20px rgba(246, 136, 92, 0.3));

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
  color: ${modernTheme.colors.inkSoft};
  text-decoration: none;
  font-weight: 500;
  padding: 0.65rem 1rem;
  border-radius: ${modernTheme.radii.pill};
  transition: all 0.3s ease;
  border: 1px solid transparent;
  
  &:hover {
    color: ${modernTheme.colors.brandStrong};
    background: rgba(255, 255, 255, 0.72);
    border-color: rgba(255, 255, 255, 0.82);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
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
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(255, 255, 255, 0.72);
  color: ${modernTheme.colors.inkSoft};
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: ${modernTheme.radii.pill};
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);

  &:hover {
    color: ${modernTheme.colors.brandStrong};
    background: rgba(255, 255, 255, 0.86);
    transform: translateY(-1px);
  }
`;

const SignUpButton = styled.button`
  background: ${modernTheme.gradients.brand};
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: ${modernTheme.radii.pill};
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.18);
  cursor: pointer;
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
  box-shadow: ${modernTheme.shadows.glow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 28px 60px rgba(220, 94, 49, 0.28);
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
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid rgba(255, 255, 255, 0.75);
  color: ${modernTheme.colors.inkSoft};
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: ${modernTheme.radii.pill};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);

  &:hover {
    background: rgba(255, 255, 255, 0.84);
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
  margin-top: 0.75rem;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 22px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
  min-width: 240px;
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
  color: ${modernTheme.colors.inkSoft};
  text-decoration: none;
  transition: background 0.3s ease;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);

  &:hover {
    background: rgba(246, 136, 92, 0.08);
  }

  &:first-child {
    border-radius: 22px 22px 0 0;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #333;
    font-size: 20px;
  }

  &.favorite {
    svg {
      color: #ea580c;
    }
    color: #ea580c;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(15, 23, 42, 0.08);
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
  color: ${modernTheme.colors.inkSoft};
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease;
  border-radius: 0 0 22px 22px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);

  &:hover {
    background: rgba(246, 136, 92, 0.08);
  }

  svg {
    width: 20px;
    height: 20px;
    font-size: 20px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.78);
  font-size: 1.5rem;
  color: ${modernTheme.colors.ink};
  cursor: pointer;
  padding: 0.5rem;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);

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
    background: rgba(7, 17, 31, 0.45);
    backdrop-filter: blur(6px);
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
    height: 100dvh;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(244, 247, 251, 0.99) 100%);
    box-shadow: -16px 0 40px rgba(15, 23, 42, 0.18);
    z-index: 1001;
    padding: 0;
    overflow: hidden;
    transform: ${p => p.isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.25s ease;
  }
`;

const MobileMenuScroll = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    padding-bottom: 1.5rem;
  }
`;

const MobileMenuHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
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
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.72);
  color: ${modernTheme.colors.inkSoft};
  cursor: pointer;
  border-radius: 12px;
  -webkit-tap-highlight-color: transparent;
  &:hover { background: white; }
`;

const MobileMenuLink = styled(Link)`
  padding: 1rem 1.5rem;
  color: ${modernTheme.colors.inkSoft};
  text-decoration: none;
  font-weight: 500;
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s ease;
  &:hover { background: rgba(246, 136, 92, 0.08); }
  svg { flex-shrink: 0; font-size: 20px; }
`;

const MobileMenuButtonAction = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  text-align: left;
  border: none;
  background: none;
  color: ${modernTheme.colors.inkSoft};
  font-weight: 500;
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.2s ease;
  &:hover { background: rgba(246, 136, 92, 0.08); }
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
  const isLocatario = userType === 'lessee' || userType === 'rent';

  const loadHeaderPhoto = () => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    if (!u?.id) {
      if (headerPhotoBlobRef.current) {
        URL.revokeObjectURL(headerPhotoBlobRef.current);
        headerPhotoBlobRef.current = null;
      }
      setHeaderPhotoUrl(null);
      return;
    }
    if (u?.profilePhoto && u.profilePhoto !== 'inline') {
      const url = authService.getProfilePhotoUrl(u.profilePhoto);
      if (url) {
        setHeaderPhotoUrl(url);
        return;
      }
    }
    if (u?.profilePhoto === 'inline' || (u?.id && u?.profilePhoto === undefined)) {
      authService.fetchProfilePhotoBlobUrl().then((blobUrl) => {
        if (!blobUrl) return;
        if (headerPhotoBlobRef.current) URL.revokeObjectURL(headerPhotoBlobRef.current);
        headerPhotoBlobRef.current = blobUrl;
        setHeaderPhotoUrl(blobUrl);
      });
    } else {
      if (headerPhotoBlobRef.current) {
        URL.revokeObjectURL(headerPhotoBlobRef.current);
        headerPhotoBlobRef.current = null;
      }
      setHeaderPhotoUrl(null);
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
    const onUserLoggedIn = () => loadHeaderPhoto();
    window.addEventListener('profilePhotoUpdated', onPhotoUpdated);
    window.addEventListener('userLoggedIn', onUserLoggedIn);
    return () => {
      window.removeEventListener('profilePhotoUpdated', onPhotoUpdated);
      window.removeEventListener('userLoggedIn', onUserLoggedIn);
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
        <MobileMenuScroll>
        <MobileMenuLink to="/" onClick={closeMobileMenu}><DashboardIcon fontSize="small" /> Painel</MobileMenuLink>
        {(userType === 'lessee' || userType === 'both' || !isLoggedIn) && (
          <MobileMenuLink to="/vehicles" onClick={closeMobileMenu}><CarIcon fontSize="small" /> Encontrar Carros</MobileMenuLink>
        )}
        {(userType === 'lessor' || userType === 'both' || !isLoggedIn) && (
          <MobileMenuLink to="/list-vehicle" onClick={closeMobileMenu}><AddIcon fontSize="small" /> Anunciar Seu Carro</MobileMenuLink>
        )}
        {isLocatario && (
          <MobileMenuLink to="/mensalista" onClick={closeMobileMenu}><CarIcon fontSize="small" /> Ser Mensalista</MobileMenuLink>
        )}
        <MobileMenuLink to="/how-it-works" onClick={closeMobileMenu}><InfoIcon fontSize="small" /> Como Funciona</MobileMenuLink>
        <MobileMenuLink to="/help" onClick={closeMobileMenu}><HelpIcon fontSize="small" /> Ajuda</MobileMenuLink>
        {isLoggedIn ? (
          <>
            {userType === 'admin' && (
              <MobileMenuLink to="/admin" onClick={closeMobileMenu}><DashboardIcon fontSize="small" /> Painel Admin</MobileMenuLink>
            )}
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
        </MobileMenuScroll>
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
          {isLocatario && (
            <NavLink to="/mensalista">Ser Mensalista</NavLink>
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
              {userType === 'admin' && (
                <DropdownItem 
                  to="/admin"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <DashboardIcon fontSize="small" />
                  Painel Admin
                </DropdownItem>
              )}
              <DropdownDivider />
              {/* Seção Superior */}
              <DropdownItem 
                to="/bookings"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <FlightTakeoff size={20} />
                Viagens
              </DropdownItem>
              {isLocatario && (
                <DropdownItem 
                  to="/mensalista"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <CarIcon fontSize="small" />
                  Ser Mensalista
                </DropdownItem>
              )}
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