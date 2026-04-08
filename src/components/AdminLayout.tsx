import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Dashboard, People, Event, Logout, Search, Shield } from '@mui/icons-material';
import modernTheme from '../styles/modernTheme';
import { glassPanelCss } from '../styles/modernPrimitives';

const AdminPage = styled.div`
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(246, 136, 92, 0.14), transparent 24%),
    radial-gradient(circle at top right, rgba(139, 92, 246, 0.14), transparent 22%),
    linear-gradient(180deg, #08111d 0%, #0c1727 100%);
  padding: 1rem;
  gap: 1rem;

  @media (max-width: 900px) {
    padding: 0.75rem;
    gap: 0.75rem;
  }
`;

const Sidebar = styled.aside`
  width: 260px;
  background: ${modernTheme.gradients.dark};
  color: white;
  padding: 1.5rem 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 32px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.28);
  position: sticky;
  top: 1rem;
  height: calc(100vh - 2rem);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 72px;
    padding: 1rem 0;
    border-radius: 24px;
  }

  @media (max-width: 480px) {
    width: 64px;
  }
`;

const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0 1.5rem 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.12);

  @media (max-width: 768px) {
    justify-content: center;
    padding: 0 0.75rem 1rem;
  }
`;

const BrandMark = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(246, 136, 92, 0.98) 0%, rgba(220, 94, 49, 0.98) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 16px 36px rgba(220, 94, 49, 0.26);
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  small {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.65);
  }

  strong {
    font-size: 1.05rem;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
  padding-right: 0.5rem;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: background 0.2s, color 0.2s, transform 0.2s;
  border-radius: 0 999px 999px 0;
  margin-right: 0.75rem;
  &.active {
    background: rgba(255,255,255,0.14);
    color: white;
    border-left: 3px solid ${modernTheme.colors.brand};
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06);
  }
  &:hover:not(.active) {
    background: rgba(255,255,255,0.08);
    color: white;
    transform: translateX(2px);
  }
  @media (max-width: 768px) {
    padding: 0.75rem;
    justify-content: center;
    span.text { display: none; }
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem 1.5rem 0;
  border-top: 1px solid rgba(255,255,255,0.12);
  margin-top: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem 0;
  }
`;

const SidebarMetaCard = styled.div`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 1rem;

  strong {
    display: block;
    font-size: 1.25rem;
    margin-top: 0.2rem;
  }

  small {
    color: rgba(255,255,255,0.68);
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  margin-top: auto;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  text-align: left;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: rgba(255,255,255,0.1);
    color: white;
  }
  @media (max-width: 768px) {
    padding: 0.75rem;
    justify-content: center;
    span { display: none; }
  }
`;

const Workspace = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const TopBar = styled.header`
  ${glassPanelCss}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 28px;
  color: white;
  background:
    linear-gradient(135deg, rgba(7, 17, 31, 0.96) 0%, rgba(16, 33, 59, 0.94) 58%, rgba(32, 18, 77, 0.94) 100%);
  border-color: rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 0.9rem 1rem;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
  padding: 0.9rem 1rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.74);

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    span {
      font-size: 0.9rem;
    }
  }
`;

const TopBarMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TopBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  background: rgba(246, 136, 92, 0.14);
  color: #ffd8ca;
  font-size: 0.85rem;
  font-weight: 600;

  @media (max-width: 768px) {
    display: none;
  }
`;

const AdminIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const AdminAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f6885c 0%, #dc5e31 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  box-shadow: 0 16px 32px rgba(220, 94, 49, 0.22);
`;

const AdminIdentityText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  strong {
    color: white;
    font-size: 0.95rem;
  }

  span {
    color: rgba(255,255,255,0.7);
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const Content = styled.main`
  ${glassPanelCss}
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 1.5rem;
  border-radius: 32px;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 24px;
  }
`;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Administrador';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part.charAt(0).toUpperCase())
    .join('') || 'AD';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AdminPage>
      <Sidebar>
        <SidebarBrand>
          <BrandMark>
            <Shield sx={{ fontSize: 22 }} />
          </BrandMark>
          <BrandText>
            <small>CarAndGo</small>
            <strong>Painel Admin</strong>
          </BrandText>
        </SidebarBrand>
        <Nav>
          <NavItem to="/admin" end>
            <Dashboard sx={{ fontSize: 20 }} />
            <span className="text">Indicadores</span>
          </NavItem>
          <NavItem to="/admin/users">
            <People sx={{ fontSize: 20 }} />
            <span className="text">Usuários</span>
          </NavItem>
          <NavItem to="/admin/bookings">
            <Event sx={{ fontSize: 20 }} />
            <span className="text">Reservas</span>
          </NavItem>
        </Nav>
        <SidebarFooter>
          <SidebarMetaCard>
            <small>Controle central</small>
            <strong>Operação ativa</strong>
          </SidebarMetaCard>
        </SidebarFooter>
        <LogoutBtn type="button" onClick={handleLogout}>
          <Logout sx={{ fontSize: 20 }} />
          <span>Sair</span>
        </LogoutBtn>
      </Sidebar>
      <Workspace>
        <TopBar>
          <SearchBox>
            <Search sx={{ fontSize: 18 }} />
            <span>Monitore usuários, reservas e receita em tempo real</span>
          </SearchBox>
          <TopBarMeta>
            <TopBadge>
              <Shield sx={{ fontSize: 16 }} />
              Admin
            </TopBadge>
            <AdminIdentity>
              <AdminAvatar>{initials}</AdminAvatar>
              <AdminIdentityText>
                <strong>{displayName}</strong>
                <span>Acesso total ao sistema</span>
              </AdminIdentityText>
            </AdminIdentity>
          </TopBarMeta>
        </TopBar>
        <Content>
          <Outlet />
        </Content>
      </Workspace>
    </AdminPage>
  );
};

export default AdminLayout;
