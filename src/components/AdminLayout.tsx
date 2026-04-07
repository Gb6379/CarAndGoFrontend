import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Dashboard, People, Event, Logout } from '@mui/icons-material';

const AdminPage = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f1f3f5;
`;

const Sidebar = styled.aside`
  width: 260px;
  background: #1a1d29;
  color: white;
  padding: 1.5rem 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 72px;
    padding: 1rem 0;
  }
`;

const SidebarTitle = styled.div`
  padding: 0 1.5rem 1.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    padding: 0 0.75rem 1rem;
    font-size: 0.9rem;
    text-align: center;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  &.active {
    background: rgba(102, 126, 234, 0.3);
    color: white;
    border-left: 3px solid #F6885C;
  }
  &:hover:not(.active) {
    background: rgba(255,255,255,0.08);
    color: white;
  }
  @media (max-width: 768px) {
    padding: 0.75rem;
    justify-content: center;
    span.text { display: none; }
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

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  overflow: auto;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AdminPage>
      <Sidebar>
        <SidebarTitle>Painel Admin</SidebarTitle>
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
        <LogoutBtn type="button" onClick={handleLogout}>
          <Logout sx={{ fontSize: 20 }} />
          <span>Sair</span>
        </LogoutBtn>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </AdminPage>
  );
};

export default AdminLayout;
