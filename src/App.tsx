import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import RouteGuard from './components/RouteGuard';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import VehicleListPage from './pages/VehicleListPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import ListVehiclePage from './pages/ListVehiclePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import MyCarsPage from './pages/MyCarsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import BecomeHostPage from './pages/BecomeHostPage';

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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/become-host" element={<BecomeHostPage />} />
          
          {/* Public vehicle browsing - accessible to all logged-in users */}
          <Route path="/vehicles" element={
            <RouteGuard allowedUserTypes={['lessee', 'lessor', 'both']}>
              <VehicleListPage />
            </RouteGuard>
          } />
          <Route path="/vehicle/:id" element={
            <RouteGuard allowedUserTypes={['lessee', 'lessor', 'both']}>
              <VehicleDetailPage />
            </RouteGuard>
          } />
          
          {/* Lessee-only routes */}
          <Route path="/bookings" element={
            <RouteGuard allowedUserTypes={['lessee', 'both']} redirectTo="/vehicles">
              <BookingsPage />
            </RouteGuard>
          } />
          
          {/* Lessor-only routes */}
          <Route path="/list-vehicle" element={
            <RouteGuard allowedUserTypes={['lessor', 'both']} redirectTo="/vehicles">
              <ListVehiclePage />
            </RouteGuard>
          } />
          <Route path="/vehicles/my" element={
            <RouteGuard allowedUserTypes={['lessor', 'both']} redirectTo="/vehicles">
              <MyCarsPage />
            </RouteGuard>
          } />
          
          {/* Common authenticated routes */}
          <Route path="/dashboard" element={
            <RouteGuard allowedUserTypes={['lessee', 'lessor', 'both']}>
              <DashboardPage />
            </RouteGuard>
          } />
          <Route path="/profile" element={
            <RouteGuard allowedUserTypes={['lessee', 'lessor', 'both']}>
              <ProfilePage />
            </RouteGuard>
          } />
        </Routes>
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App;
