import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VehicleListPage from './pages/VehicleListPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import ListVehiclePage from './pages/ListVehiclePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import MyCarsPage from './pages/MyCarsPage';
import HowItWorksPage from './pages/HowItWorksPage';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  padding-top: 90px; /* Account for fixed header */
  min-height: calc(100vh - 90px);

  @media (max-width: 768px) {
    padding-top: 70px;
    min-height: calc(100vh - 70px);
  }

  @media (max-width: 480px) {
    padding-top: 60px;
    min-height: calc(100vh - 60px);
  }
`;

const PortInfo = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: #667eea;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

function App() {
  // Get the current port from window.location
  const currentPort = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
  
  // Log port information to console
  console.log('CAR AND GO Web App');
  console.log(`Running on port: ${currentPort}`);
  console.log(`Full URL: ${window.location.origin}`);
  console.log('=====================================');
  
  return (
    <AppContainer>
      <PortInfo>
        Port: {currentPort}
      </PortInfo>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/vehicles" element={<VehicleListPage />} />
              <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
              <Route path="/list-vehicle" element={<ListVehiclePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/vehicles/my" element={<MyCarsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Routes>
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App;
