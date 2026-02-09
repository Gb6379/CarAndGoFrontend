import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import RouteGuard from './components/RouteGuard';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import TripsPage from './pages/TripsPage';
import VehicleListPage from './pages/VehicleListPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import ListVehiclePage from './pages/ListVehiclePage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import PaymentPage from './pages/PaymentPage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import MyCarsPage from './pages/MyCarsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import BecomeHostPage from './pages/BecomeHostPage';
import BankDetailsPage from './pages/BankDetailsPage';
import VerificationPage from './pages/VerificationPage';

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
          
          {/* Favorites - requires authentication */}
          <Route path="/favorites" element={
            <RouteGuard allowedUserTypes={['lessee', 'lessor', 'both']}>
              <FavoritesPage />
            </RouteGuard>
          } />
          
          {/* Trips - requires authentication */}
          <Route path="/bookings" element={
            <RouteGuard allowedUserTypes={['lessee', 'lessor', 'both']}>
              <TripsPage />
            </RouteGuard>
          } />
          
          {/* Public vehicle browsing - accessible to all users */}
          <Route path="/vehicles" element={<VehicleListPage />} />
          <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
          
          {/* Booking - requires authentication as lessee */}
          <Route path="/booking" element={
            <RouteGuard allowedUserTypes={['rent', 'lessee', 'both']}>
              <BookingPage />
            </RouteGuard>
          } />

          {/* Booking Details - requires authentication */}
          <Route path="/booking/:id/details" element={
            <RouteGuard allowedUserTypes={['rent', 'lessee', 'host', 'lessor', 'both']}>
              <BookingDetailsPage />
            </RouteGuard>
          } />

          {/* Payment - after booking */}
          <Route path="/payment" element={
            <RouteGuard allowedUserTypes={['rent', 'lessee', 'both']}>
              <PaymentPage />
            </RouteGuard>
          } />
          <Route path="/payment/callback" element={
            <RouteGuard allowedUserTypes={['rent', 'lessee', 'both']}>
              <PaymentCallbackPage />
            </RouteGuard>
          } />
          
          {/* Lessee-only routes */}
          
          {/* Lessor-only routes */}
          <Route path="/list-vehicle" element={<ListVehiclePage />} />
          <Route path="/list-vehicle/edit/:id" element={<ListVehiclePage />} />
          <Route path="/vehicles/my" element={
            <RouteGuard allowedUserTypes={['lessor', 'both']} redirectTo="/vehicles">
              <MyCarsPage />
            </RouteGuard>
          } />
          
          {/* Dashboard removido: painel do locador fica na home (/) */}
          <Route path="/dashboard" element={
            <RouteGuard allowedUserTypes={['lessee', 'lessor', 'both']}>
              <Navigate to="/" replace />
            </RouteGuard>
          } />
          <Route path="/verification" element={
            <RouteGuard allowedUserTypes={['lessee', 'lessor', 'both']}>
              <VerificationPage />
            </RouteGuard>
          } />
          <Route path="/profile" element={
            <RouteGuard allowedUserTypes={['lessee', 'lessor', 'both']}>
              <ProfilePage />
            </RouteGuard>
          } />
          <Route path="/bank-details" element={
            <RouteGuard allowedUserTypes={['lessor', 'both']} redirectTo="/dashboard">
              <BankDetailsPage />
            </RouteGuard>
          } />
        </Routes>
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App;
