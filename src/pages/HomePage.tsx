import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Car, Check, Phone, Calendar, Edit, Smartphone, Money, Shield, Lock, Star, Location, Map, ArrowRight, FlightTakeoff, BarChart, LocationOn, User } from '../components/IconSystem';
import heroBg from '../assets/one-way-car-rentals.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
import { PlayArrow } from '@mui/icons-material';
import { vehicleService, bookingService } from '../services/authService';

// Hero Section with Search - Turo Style
const HeroSection = styled.section`
  background: linear-gradient(
    135deg, 
    rgba(10, 50, 80, 0.9) 0%, 
    rgba(15, 70, 110, 0.95) 100%
  ), url(${heroBg});
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  color: white;
  padding: 3rem 2rem 2.5rem;
  min-height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${heroBg});
    background-size: cover;
    background-position: center;
    filter: blur(3px) brightness(0.4);
    opacity: 0.5;
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem 1.5rem;
  }
`;

const HeroWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeroContent = styled.div`
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 10;
  width: 100%;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  opacity: 1;
  max-width: none;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  line-height: 1.5;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.25rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 12px;
    margin: 0 0.5rem;
    width: calc(100% - 1rem);
  }
  @media (max-width: 480px) {
    margin: 0 0.25rem;
    width: calc(100% - 0.5rem);
  }
`;

const SearchForm = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  gap: 0;
  min-width: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchField = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  min-width: 0;

  &:not(:last-child) {
    border-right: 1px solid #e5e5e5;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex: none;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 1.25rem 1.5rem;
  background: white;
  color: #333;
  transition: all 0.2s ease;
  height: 64px;
  box-sizing: border-box;
  font-weight: 400;
  width: 100%;

  &:focus {
    background: #fafafa;
  }

  &::placeholder {
    color: #999;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    height: 56px;
    padding: 1rem 1.25rem;
  }
`;

const DateTimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  position: relative;

  &:not(:last-child) {
    border-right: 1px solid #e5e5e5;
  }

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    flex-direction: column;
    
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

const DateInput = styled.input`
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 1.5rem 1rem 0.75rem 1rem;
  background: white;
  color: #333;
  transition: all 0.2s ease;
  height: 64px;
  box-sizing: border-box;
  font-weight: 400;
  flex: 1;
  cursor: pointer;
  min-width: 140px;
  width: 100%;

  &:focus {
    background: #fafafa;
  }

  &::placeholder {
    color: #999;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    height: 52px;
    min-height: 48px;
    padding: 1rem 0.75rem 0.5rem 0.75rem;
    border-bottom: none;
    min-width: 0;
    font-size: 0.95rem;
  }
  @media (max-width: 480px) {
    flex: none;
    width: 100%;
    border-bottom: 1px solid #eee;
  }
`;

const TimeSelect = styled.select`
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 1.5rem 1rem 0.75rem 1rem;
  background: white;
  color: #333;
  transition: all 0.2s ease;
  height: 64px;
  box-sizing: border-box;
  font-weight: 400;
  flex: 1;
  cursor: pointer;
  border-left: 1px solid #e5e5e5;
  min-width: 90px;

  &:focus {
    background: #fafafa;
  }

  @media (max-width: 768px) {
    height: 52px;
    min-height: 48px;
    padding: 1rem 0.75rem 0.5rem 0.75rem;
    border-left: 1px solid #eee;
    border-bottom: none;
    min-width: 0;
    flex: 1;
    font-size: 0.95rem;
  }
  @media (max-width: 480px) {
    flex: none;
    width: 100%;
    border-left: none;
    border-top: 1px solid #eee;
  }
`;

const DateTimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  min-width: 0;

  &:not(:last-child) {
    border-right: 1px solid #e5e5e5;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex: none;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
    
    &:last-of-type {
      border-bottom: none;
    }
  }
`;

const DateLabel = styled.span`
  position: absolute;
  top: 4px;
  left: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 1;

  @media (max-width: 480px) {
    left: 10px;
    top: 6px;
  }
`;

const DateTimeInner = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const LocationInputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  position: relative;
  min-width: 0;

  &:not(:last-child) {
    border-right: 1px solid #e5e5e5;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex: none;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
  }
`;

const GeoLocationButton = styled.button`
  position: absolute;
  right: 8px;
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    right: 12px;
  }
`;

const SearchButton = styled.button`
  background: #F6885CFF;
  color: white;
  border: none;
  padding: 0;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 64px;
  width: 64px;
  min-width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background: #ED733AFF;
  }

  &:active {
    background: #D95128FF;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 56px;
    border-radius: 0 0 12px 12px;
  }
`;

const GetToKnowButton = styled.button`
  background: #000000;
  color: white;
  border: none;
  padding: 0.75rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

  &:hover {
    background: #1a1a1a;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
    margin-top: 1.25rem;
  }
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #1a1a1a;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.85rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 400;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2.5rem;
  border: 2px solid ${props => props.active ? '#667eea' : '#e0e0e0'};
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)'};

  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5'};
    transform: translateY(-2px);
    box-shadow: ${props => props.active ? '0 6px 16px rgba(102, 126, 234, 0.35)' : '0 4px 12px rgba(0,0,0,0.08)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StepCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.12);
    border-color: rgba(102, 126, 234, 0.15);
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const StepDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

// Featured Cars Section - Turo Style
const FeaturedSection = styled.section`
  padding: 3rem 2rem;
  background: white;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const SectionTitleWithArrow = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #8B5CF6;
  }
`;

const CarsScrollContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 1rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;

    &:hover {
      background: #555;
    }
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const CarCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.08);
  min-width: 320px;
  max-width: 320px;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border-color: rgba(0,0,0,0.12);
  }

  @media (max-width: 768px) {
    min-width: 280px;
    max-width: 280px;
  }
`;

const CarImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #8B5CF6;
  position: relative;
  overflow: hidden;

  svg {
    position: relative;
    z-index: 1;
  }
`;

const CarInfo = styled.div`
  padding: 1.25rem;
`;

const CarTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  line-height: 1.3;
`;

const CarRatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const CarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #1a1a1a;
  font-size: 0.95rem;
  font-weight: 600;
`;

const CarTrips = styled.span`
  color: #666;
  font-size: 0.85rem;
  font-weight: 400;
`;

const CarPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const CarPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
`;

const CarSave = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: #10b981;
`;

const ViewAllButton = styled.button`
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 1.125rem 2.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  display: block;
  margin: 4rem auto 0;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Trust Section
const TrustSection = styled.section`
  padding: 6rem 2rem;
  background: #f8f9fa;
`;

const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TrustCard = styled.div`
  text-align: center;
  padding: 2rem;
`;

const TrustIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const TrustTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const TrustDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

// CTA Section
const CTASection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

// Filter Bar Section
const FilterBarSection = styled.section`
  background: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  justify-content: center;
  max-width: 1200px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 0.5rem;
    justify-content: flex-start;
  }
`;

const FilterOption = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#e5e5e5' : 'transparent'};
  color: #333;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    background: ${props => props.active ? '#d5d5d5' : '#f5f5f5'};
  }

  svg {
    font-size: 1rem;
    color: #333;
  }
`;

// Cars Grid Section
const CarsGridSection = styled.section`
  padding: 2rem;
  background: white;
`;

const CTAButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 1.25rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.75rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);

  &:hover {
    background: #f8f9fa;
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.25);
    color: #5568d3;
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    margin: 0.5rem;
    padding: 1rem 2.5rem;
  }
`;

// Lessor home – painel administrativo
const LessorHero = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
`;

const LessorHeroTitle = styled.h1`
  font-size: 2.25rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  @media (max-width: 768px) { font-size: 1.75rem; }
`;

const LessorHeroSubtitle = styled.p`
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.95;
  @media (max-width: 768px) { font-size: 1rem; }
`;

const LessorContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const LessorStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const LessorStatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  text-align: center;
`;

const LessorStatIcon = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  color: #667eea;
`;

const LessorStatNumber = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.25rem;
`;

const LessorStatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const LessorSectionTitle = styled.h2`
  font-size: 1.35rem;
  color: #333;
  margin: 0 0 1.25rem 0;
  font-weight: 600;
`;

const LessorActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
`;

const LessorActionCard = styled.button`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);

  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }
`;

const LessorActionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const LessorActionTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.35rem;
`;

const LessorActionDesc = styled.div`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
`;

// Conteúdo exibido ao clicar nos cards (sem abas)
const LessorPanelContent = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
`;

const LessorVehiclesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
`;

const LessorVehicleCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
`;

const LessorVehicleCardTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.35rem;
`;

const LessorVehicleCardMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const LessorVehicleCardPrice = styled.div`
  font-weight: 700;
  color: #667eea;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const LessorVehicleCardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const LessorCardBtn = styled.button<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #ddd;
  background: ${p => p.$primary ? '#667eea' : 'white'};
  color: ${p => p.$primary ? 'white' : '#333'};
  &:hover { background: ${p => p.$primary ? '#5a6fd8' : '#f8f9fa'}; }
`;

const LessorBookingCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
`;

const LessorBookingCardLink = styled.span`
  color: #667eea;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  &:hover { text-decoration: underline; }
`;

const LessorModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const LessorModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
`;

const LessorModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LessorModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LessorModalCloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  &:hover { color: #333; }
`;

const LessorModalBody = styled.div`
  padding: 1.25rem 1.5rem;
`;

const LessorModalAddress = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  border-left: 4px solid #667eea;
`;

const LessorModalAddressLine = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
  & + & { margin-top: 0.25rem; font-size: 0.95rem; color: #555; }
`;

const LessorModalMapWrap = styled.div`
  height: 220px;
  border-radius: 8px;
  overflow: hidden;
  .leaflet-container { height: 100%; width: 100%; }
`;

const LessorProfileRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  &:last-child { border-bottom: none; }
`;

const LessorProfileLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const LessorProfileValue = styled.span`
  font-size: 1rem;
  color: #333;
  a { color: #667eea; text-decoration: none; &:hover { text-decoration: underline; } }
`;

const LessorHomeView: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [panelView, setPanelView] = useState<'overview' | 'bookings'>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'bookings') return 'bookings';
    return 'overview';
  });
  const [vehiclesCount, setVehiclesCount] = useState<number>(0);
  const [bookingsCount, setBookingsCount] = useState<number>(0);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickupLocationBooking, setPickupLocationBooking] = useState<any>(null);
  const [lesseeProfileBooking, setLesseeProfileBooking] = useState<any>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'vehicles') {
      navigate('/vehicles/my');
      return;
    }
    if (tab === 'bookings') setPanelView('bookings');
  }, [searchParams, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      vehicleService.getAllVehicles().catch(() => []),
      bookingService.getBookings().catch(() => []),
    ]).then(([allVehicles, allBookings]) => {
      const myVehicles = Array.isArray(allVehicles) ? allVehicles.filter((v: any) => v.ownerId === user.id || v.owner?.id === user.id) : [];
      const lessorBookings = Array.isArray(allBookings) ? allBookings.filter((b: any) => b.lessorId === user.id || b.lessor?.id === user.id) : [];
      setVehiclesCount(myVehicles.length);
      setBookingsCount(lessorBookings.length);
      setVehicles(myVehicles);
      setBookings(Array.isArray(allBookings) ? allBookings : []);
    }).finally(() => setLoading(false));
  }, [user?.id]);

  const setTab = (tab: 'overview' | 'bookings') => {
    setPanelView(tab);
    if (tab === 'overview') setSearchParams({});
    else setSearchParams({ tab });
    if (tab === 'bookings') {
      setTimeout(() => contentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendente', 'confirmed': 'Confirmada', 'active': 'Em andamento',
      'awaiting_return': 'Aguardando Devolução', 'completed': 'Concluída', 'cancelled': 'Cancelada',
      'rejected': 'Rejeitada', 'expired': 'Expirada'
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'pending': '#f59e0b', 'confirmed': '#10b981', 'awaiting_return': '#8b5cf6', 'active': '#3b82f6',
      'completed': '#6b7280', 'cancelled': '#ef4444', 'rejected': '#ef4444', 'expired': '#9ca3af'
    };
    return colorMap[status?.toLowerCase()] || '#6b7280';
  };

  const lesseeBookings = bookings.filter((b: any) => b.lesseeId === user?.id || b.lessee?.id === user?.id);
  const lessorBookings = bookings.filter((b: any) => b.lessorId === user?.id || b.lessor?.id === user?.id);

  const actions = [
    { title: 'Meus veículos', desc: 'Ver e editar seus anúncios', path: '/vehicles/my', icon: <Car size={24} /> },
    { title: 'Anunciar veículo', desc: 'Cadastrar um novo carro para locação', path: '/list-vehicle', icon: <Edit size={24} /> },
    { title: 'Reservas', desc: 'Reservas dos seus veículos e locatários', onClick: () => setTab('bookings'), icon: <Calendar size={24} /> },
    { title: 'Dados bancários', desc: 'Onde receber os pagamentos', path: '/bank-details', icon: <Money size={24} /> },
  ];

  return (
    <>
      <LessorHero>
        <LessorHeroTitle>Seu painel de locador</LessorHeroTitle>
        <LessorHeroSubtitle>Gerencie seus anúncios, reservas e recebimentos</LessorHeroSubtitle>
      </LessorHero>
      <LessorContent>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Carregando...</p>
        ) : (
          <>
            <LessorStats>
              <LessorStatCard>
                <LessorStatIcon><Car size={28} /></LessorStatIcon>
                <LessorStatNumber>{vehiclesCount}</LessorStatNumber>
                <LessorStatLabel>Veículos anunciados</LessorStatLabel>
              </LessorStatCard>
              <LessorStatCard>
                <LessorStatIcon><Calendar size={28} /></LessorStatIcon>
                <LessorStatNumber>{bookingsCount}</LessorStatNumber>
                <LessorStatLabel>Reservas recebidas</LessorStatLabel>
              </LessorStatCard>
            </LessorStats>
            <LessorSectionTitle>Ações rápidas</LessorSectionTitle>
            <LessorActionsGrid>
              {actions.map((action) => (
                <LessorActionCard
                  key={action.title}
                  type="button"
                  onClick={() => ('path' in action && action.path) ? navigate(action.path) : ('onClick' in action && action.onClick) ? action.onClick() : undefined}
                >
                  <LessorActionIcon>{action.icon}</LessorActionIcon>
                  <LessorActionTitle>{action.title}</LessorActionTitle>
                  <LessorActionDesc>{action.desc}</LessorActionDesc>
                </LessorActionCard>
              ))}
            </LessorActionsGrid>

            <LessorPanelContent ref={contentSectionRef} style={{ marginTop: '2rem' }}>
              {panelView === 'overview' && (
                <>
                  <h3 style={{ marginBottom: '1rem', color: '#333' }}>Resumo</h3>
                  <p style={{ color: '#666', marginBottom: '1rem' }}>
                    Você tem <strong>{vehiclesCount}</strong> veículo(s) anunciado(s) e <strong>{bookingsCount}</strong> reserva(s) recebida(s).
                  </p>
                  <LessorStats>
                    <LessorStatCard>
                      <LessorStatIcon><Car size={28} /></LessorStatIcon>
                      <LessorStatNumber>{vehiclesCount}</LessorStatNumber>
                      <LessorStatLabel>Veículos anunciados</LessorStatLabel>
                    </LessorStatCard>
                    <LessorStatCard>
                      <LessorStatIcon><Calendar size={28} /></LessorStatIcon>
                      <LessorStatNumber>{bookingsCount}</LessorStatNumber>
                      <LessorStatLabel>Reservas recebidas</LessorStatLabel>
                    </LessorStatCard>
                  </LessorStats>
                </>
              )}
              {panelView === 'bookings' && (
                <>
                  <h3 style={{ marginBottom: '1rem', color: '#333' }}>Minhas Reservas</h3>
                  {lesseeBookings.length === 0 && lessorBookings.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Você ainda não possui reservas.</p>
                  ) : (
                    <>
                      {lesseeBookings.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                          <h4 style={{ marginBottom: '1rem', color: '#333' }}>Reservas como Locatário</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {lesseeBookings.map((booking: any) => (
                              <LessorBookingCard key={booking.id} onClick={() => booking.vehicle && setPickupLocationBooking(booking)}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                    {booking.vehicle?.make || 'Veículo'} {booking.vehicle?.model || ''} {booking.vehicle?.year || ''}
                                  </div>
                                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                  </div>
                                  <div style={{ marginTop: '0.5rem' }}>
                                    <LessorBookingCardLink onClick={(e) => { e.stopPropagation(); navigate(`/booking/${booking.id}/details`); }}>
                                      Ver detalhes
                                    </LessorBookingCardLink>
                                    {booking.vehicle && (
                                      <LessorBookingCardLink onClick={(e) => { e.stopPropagation(); setPickupLocationBooking(booking); }}>
                                        <LocationOn size={14} /> Ver local de retirada
                                      </LessorBookingCardLink>
                                    )}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    background: `${getStatusColor(booking.status)}20`,
                                    color: getStatusColor(booking.status),
                                    marginBottom: '0.5rem'
                                  }}>
                                    {getStatusLabel(booking.status)}
                                  </span>
                                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                                    R$ {typeof booking.totalAmount === 'number' ? booking.totalAmount.toFixed(2) : (parseFloat(booking.totalAmount) || 0).toFixed(2)}
                                  </div>
                                </div>
                              </LessorBookingCard>
                            ))}
                          </div>
                        </div>
                      )}
                      {lessorBookings.length > 0 && (
                        <div>
                          <h4 style={{ marginBottom: '1rem', color: '#333' }}>Reservas dos Meus Veículos</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {lessorBookings.map((booking: any) => (
                              <LessorBookingCard key={booking.id} onClick={() => booking.vehicle && setPickupLocationBooking(booking)}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                    {booking.vehicle?.make || 'Veículo'} {booking.vehicle?.model || ''} {booking.vehicle?.year || ''}
                                  </div>
                                  <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                    Locatário: {booking.lessee?.firstName || booking.lessee?.name || 'N/A'}
                                  </div>
                                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                  </div>
                                  <div style={{ marginTop: '0.5rem' }}>
                                    <LessorBookingCardLink onClick={(e) => { e.stopPropagation(); navigate(`/booking/${booking.id}/details`); }}>
                                      Ver detalhes
                                    </LessorBookingCardLink>
                                    {booking.lessee && (
                                      <LessorBookingCardLink onClick={(e) => { e.stopPropagation(); setLesseeProfileBooking(booking); }}>
                                        <User size={14} /> Ver perfil do locatário
                                      </LessorBookingCardLink>
                                    )}
                                    {booking.vehicle && (
                                      <LessorBookingCardLink onClick={(e) => { e.stopPropagation(); setPickupLocationBooking(booking); }}>
                                        <LocationOn size={14} /> Ver local de retirada
                                      </LessorBookingCardLink>
                                    )}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    background: `${getStatusColor(booking.status)}20`,
                                    color: getStatusColor(booking.status),
                                    marginBottom: '0.5rem'
                                  }}>
                                    {getStatusLabel(booking.status)}
                                  </span>
                                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                                    R$ {typeof booking.totalAmount === 'number' ? booking.totalAmount.toFixed(2) : (parseFloat(booking.totalAmount) || 0).toFixed(2)}
                                  </div>
                                </div>
                              </LessorBookingCard>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </LessorPanelContent>
          </>
        )}
      </LessorContent>

      {pickupLocationBooking?.vehicle && (
        <LessorModalOverlay onClick={() => setPickupLocationBooking(null)}>
          <LessorModalContent onClick={(e) => e.stopPropagation()}>
            <LessorModalHeader>
              <LessorModalTitle><LocationOn size={22} /> Local de retirada</LessorModalTitle>
              <LessorModalCloseBtn type="button" onClick={() => setPickupLocationBooking(null)} aria-label="Fechar">×</LessorModalCloseBtn>
            </LessorModalHeader>
            <LessorModalBody>
              <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#333' }}>
                {pickupLocationBooking.vehicle.make} {pickupLocationBooking.vehicle.model} {pickupLocationBooking.vehicle.year}
              </p>
              <LessorModalAddress>
                <LessorModalAddressLine>{pickupLocationBooking.vehicle.address}</LessorModalAddressLine>
                <LessorModalAddressLine>
                  {pickupLocationBooking.vehicle.city}
                  {pickupLocationBooking.vehicle.state ? `, ${pickupLocationBooking.vehicle.state}` : ''}
                </LessorModalAddressLine>
              </LessorModalAddress>
              {pickupLocationBooking.vehicle.latitude != null && pickupLocationBooking.vehicle.longitude != null && (
                <LessorModalMapWrap>
                  <MapContainer
                    center={[Number(pickupLocationBooking.vehicle.latitude), Number(pickupLocationBooking.vehicle.longitude)]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[Number(pickupLocationBooking.vehicle.latitude), Number(pickupLocationBooking.vehicle.longitude)]} />
                  </MapContainer>
                </LessorModalMapWrap>
              )}
            </LessorModalBody>
          </LessorModalContent>
        </LessorModalOverlay>
      )}

      {lesseeProfileBooking?.lessee && (
        <LessorModalOverlay onClick={() => setLesseeProfileBooking(null)}>
          <LessorModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <LessorModalHeader>
              <LessorModalTitle><User size={22} /> Perfil do locatário</LessorModalTitle>
              <LessorModalCloseBtn type="button" onClick={() => setLesseeProfileBooking(null)} aria-label="Fechar">×</LessorModalCloseBtn>
            </LessorModalHeader>
            <LessorModalBody>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#333', fontSize: '1.1rem' }}>
                {lesseeProfileBooking.vehicle?.make} {lesseeProfileBooking.vehicle?.model} {lesseeProfileBooking.vehicle?.year}
              </p>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#666' }}>
                Retirada: {formatDate(lesseeProfileBooking.startDate)} – {formatDate(lesseeProfileBooking.endDate)}
              </p>
              <LessorProfileRow>
                <LessorProfileLabel>Nome</LessorProfileLabel>
                <LessorProfileValue>
                  {([lesseeProfileBooking.lessee.firstName, lesseeProfileBooking.lessee.lastName].filter(Boolean).join(' ')) || '—'}
                </LessorProfileValue>
              </LessorProfileRow>
              <LessorProfileRow>
                <LessorProfileLabel>E-mail</LessorProfileLabel>
                <LessorProfileValue>
                  {lesseeProfileBooking.lessee.email ? (
                    <a href={`mailto:${lesseeProfileBooking.lessee.email}`}>{lesseeProfileBooking.lessee.email}</a>
                  ) : '—'}
                </LessorProfileValue>
              </LessorProfileRow>
              <LessorProfileRow>
                <LessorProfileLabel>Telefone</LessorProfileLabel>
                <LessorProfileValue>
                  {lesseeProfileBooking.lessee.phone ? (
                    <a href={`tel:${lesseeProfileBooking.lessee.phone}`}>{lesseeProfileBooking.lessee.phone}</a>
                  ) : '—'}
                </LessorProfileValue>
              </LessorProfileRow>
              <LessorProfileRow>
                <LessorProfileLabel>Cidade / Estado</LessorProfileLabel>
                <LessorProfileValue>
                  {[lesseeProfileBooking.lessee.city, lesseeProfileBooking.lessee.state].filter(Boolean).join(', ') || '—'}
                </LessorProfileValue>
              </LessorProfileRow>
            </LessorModalBody>
          </LessorModalContent>
        </LessorModalOverlay>
      )}
    </>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLessorHome = (user?.userType === 'lessor' || user?.userType === 'both') && user?.id;
  const [searchData, setSearchData] = useState({
    location: '',
    fromDate: '',
    fromTime: '10:00',
    untilDate: '',
    untilTime: '10:00'
  });

  const [geoLoading, setGeoLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Try to get user's location on mount
  useEffect(() => {
    if (navigator.geolocation && !searchData.location) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding using free Nominatim API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&addressdetails=1`,
              { headers: { 'Accept-Language': 'pt-BR' } }
            );
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.municipality || '';
            const state = data.address?.state || '';
            if (city) {
              setSearchData(prev => ({ ...prev, location: `${city}${state ? ', ' + state : ''}` }));
            }
          } catch (error) {
            console.error('Erro ao obter localização:', error);
          } finally {
            setGeoLoading(false);
          }
        },
        (error) => {
          console.log('Geolocalização não disponível:', error);
          setGeoLoading(false);
        },
        { timeout: 10000 }
      );
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'pt-BR' } }
          );
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.municipality || '';
          const state = data.address?.state || '';
          if (city) {
            setSearchData(prev => ({ ...prev, location: `${city}${state ? ', ' + state : ''}` }));
          }
        } catch (error) {
          console.error('Erro ao obter localização:', error);
          alert('Erro ao obter sua localização');
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        setGeoLoading(false);
        alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
      },
      { timeout: 10000 }
    );
  };
  const [activeTab, setActiveTab] = useState('rent');
  const [activeFilter, setActiveFilter] = useState('all');
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [carsLoadError, setCarsLoadError] = useState(false);

  const validateDates = (): string | null => {
    if (!searchData.fromDate || !searchData.untilDate) {
      return null; // Don't validate if dates are not set
    }

    const fromDateTime = new Date(`${searchData.fromDate}T${searchData.fromTime}`);
    const untilDateTime = new Date(`${searchData.untilDate}T${searchData.untilTime}`);

    // Check if "from" date is after "until" date
    if (fromDateTime >= untilDateTime) {
      return 'A data/hora de devolução deve ser posterior à data/hora de retirada';
    }

    // Check minimum rental period (1 day = 24 hours)
    const diffInHours = (untilDateTime.getTime() - fromDateTime.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return 'O período mínimo de locação é de 1 dia (24 horas)';
    }

    return null;
  };

  const handleSearch = () => {
    setSearchError('');

    // Validate dates
    const error = validateDates();
    if (error) {
      setSearchError(error);
      return;
    }

    // Navigate to vehicles page with search parameters
    const params = new URLSearchParams({
      location: searchData.location,
      from: searchData.fromDate,
      fromTime: searchData.fromTime,
      until: searchData.untilDate,
      untilTime: searchData.untilTime
    });
    navigate(`/vehicles?${params.toString()}`);
  };

  const filterOptions = [
    { id: 'all', label: 'Todos', icon: <Car size={16} /> },
    { id: 'airports', label: 'Aeroportos', icon: <FlightTakeoff size={16} /> },
    { id: 'monthly', label: 'Mensal', icon: <Calendar size={16} /> },
    { id: 'nearby', label: 'Próximo', icon: <Location size={16} /> },
    { id: 'delivered', label: 'Entregue', icon: <ArrowRight size={16} /> },
    { id: 'cities', label: 'Cidades', icon: <BarChart size={16} /> },
  ];

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    // You can add additional logic here to filter cars based on the selected filter
  };

  useEffect(() => {
    const loadFeaturedCars = async () => {
      try {
        setLoadingCars(true);
        setCarsLoadError(false);
        const data = await vehicleService.getAllVehicles();
        const vehicles = Array.isArray(data) ? data : [];
        
        const formattedCars = vehicles.slice(0, 6).map((vehicle: any, index: number) => ({
          id: vehicle.id,
          title: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
          price: Math.round((Number(vehicle.dailyRate) || 0) * 3).toString(),
          days: 3,
          rating: vehicle.rating != null ? Number(vehicle.rating).toFixed(2) : '4.9',
          trips: vehicle.totalBookings ?? 0,
          save: index < 3 ? Math.floor(Math.random() * 5) + 2 : null,
          location: `${vehicle.city || ''}, ${vehicle.state || ''}`.trim() || '—',
          dailyRate: vehicle.dailyRate
        }));
        
        setFeaturedCars(formattedCars);
      } catch (error) {
        console.error('Error loading featured cars:', error);
        setFeaturedCars([]);
        setCarsLoadError(true);
      } finally {
        setLoadingCars(false);
      }
    };

    loadFeaturedCars();
  }, []);

  const renterSteps = [
    {
      icon: <Search size={24} />,
      title: 'Busque e Escolha',
      description: 'Encontre o carro perfeito na sua região em nossa ampla seleção de veículos.'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Reserve e Pague',
      description: 'Reserve seu carro com pagamento seguro. Receba confirmação instantânea.'
    },
    {
      icon: <Car size={24} />,
      title: 'Retire e Dirija',
      description: 'Encontre seu anfitrião, pegue as chaves e comece sua aventura.'
    }
  ];

  const ownerSteps = [
    {
      icon: <Edit size={24} />,
      title: 'Anuncie Seu Carro',
      description: 'Adicione detalhes do seu carro, fotos e defina seus preços.'
    },
    {
      icon: <Smartphone size={24} />,
      title: 'Receba Reservas',
      description: 'Receba solicitações de reserva e comunique-se com hóspedes.'
    },
    {
      icon: <Money size={24} />,
      title: 'Ganhe Dinheiro',
      description: 'Ganhe dinheiro quando seu carro não estiver em uso. Fique com 70% dos ganhos.'
    }
  ];


  const trustFeatures = [
    {
      icon: <Shield size={24} />,
      title: 'Totalmente Segurado',
      description: 'Todas as viagens são cobertas por seguro abrangente'
    },
    {
      icon: <Check size={24} />,
      title: 'Anfitriões Verificados',
      description: 'Cada anfitrião é verificado com RG'
    },
    {
      icon: <Phone size={24} />,
      title: 'Suporte 24/7',
      description: 'Equipe de suporte ao cliente 24 horas por dia'
    },
    {
      icon: <Lock size={24} />,
      title: 'Pagamentos Seguros',
      description: 'Processamento de pagamento seguro e protegido'
    }
  ];

  if (isLessorHome) {
    return <LessorHomeView navigate={navigate} />;
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <HeroWrapper>
          <HeroContent>
            <HeroTitle>Encontre o carro perfeito para você</HeroTitle>
            <HeroSubtitle>
              Alugue qualquer carro, em qualquer lugar
            </HeroSubtitle>
            <SearchContainer>
            <SearchForm>
              <LocationInputWrapper>
                <SearchInput
                  type="text"
                  placeholder={geoLoading ? "Obtendo sua localização..." : "Cidade, aeroporto ou endereço"}
                  value={searchData.location}
                  onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                />
                <GeoLocationButton 
                  onClick={handleGetLocation} 
                  disabled={geoLoading}
                  title="Usar minha localização"
                  type="button"
                >
                  <Location size={18} />
                </GeoLocationButton>
              </LocationInputWrapper>
              
              <DateTimeWrapper>
                <DateLabel>De</DateLabel>
                <DateTimeInner>
                  <DateInput
                    type="date"
                    value={searchData.fromDate}
                    onChange={(e) => {
                      setSearchError('');
                      setSearchData(prev => ({ ...prev, fromDate: e.target.value }));
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <TimeSelect
                    value={searchData.fromTime}
                    onChange={(e) => {
                      setSearchError('');
                      setSearchData(prev => ({ ...prev, fromTime: e.target.value }));
                    }}
                  >
                    <option value="00:00">00:00</option>
                    <option value="01:00">01:00</option>
                    <option value="02:00">02:00</option>
                    <option value="03:00">03:00</option>
                    <option value="04:00">04:00</option>
                    <option value="05:00">05:00</option>
                    <option value="06:00">06:00</option>
                    <option value="07:00">07:00</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                    <option value="23:00">23:00</option>
                  </TimeSelect>
                </DateTimeInner>
              </DateTimeWrapper>
              
              <DateTimeWrapper>
                <DateLabel>Até</DateLabel>
                <DateTimeInner>
                  <DateInput
                    type="date"
                    value={searchData.untilDate}
                    onChange={(e) => {
                      setSearchError('');
                      setSearchData(prev => ({ ...prev, untilDate: e.target.value }));
                    }}
                    min={searchData.fromDate || new Date().toISOString().split('T')[0]}
                  />
                  <TimeSelect
                    value={searchData.untilTime}
                    onChange={(e) => {
                      setSearchError('');
                      setSearchData(prev => ({ ...prev, untilTime: e.target.value }));
                    }}
                  >
                    <option value="00:00">00:00</option>
                    <option value="01:00">01:00</option>
                    <option value="02:00">02:00</option>
                    <option value="03:00">03:00</option>
                    <option value="04:00">04:00</option>
                    <option value="05:00">05:00</option>
                    <option value="06:00">06:00</option>
                    <option value="07:00">07:00</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00</option>
                    <option value="23:00">23:00</option>
                  </TimeSelect>
                </DateTimeInner>
              </DateTimeWrapper>
              
              <SearchButton onClick={handleSearch}>
                <Search size={24} color="white" />
              </SearchButton>
            </SearchForm>
            {searchError && (
              <div style={{ 
                color: '#c33', 
                backgroundColor: '#fee', 
                padding: '0.75rem 1rem', 
                borderRadius: '0 0 12px 12px',
                fontSize: '0.9rem',
                textAlign: 'center',
                borderTop: '1px solid #fcc'
              }}>
                {searchError}
              </div>
            )}
            </SearchContainer>
            
            <GetToKnowButton onClick={() => navigate('/how-it-works')}>
              <PlayArrow style={{ fontSize: '20px' }} />
              Conheça o CarAndGo
            </GetToKnowButton>
          </HeroContent>
        </HeroWrapper>
      </HeroSection>

      {/* Filter Bar Section */}
      <FilterBarSection>
        <FilterBar>
          {filterOptions.map((option) => (
            <FilterOption
              key={option.id}
              active={activeFilter === option.id}
              onClick={() => handleFilterChange(option.id)}
            >
              {option.icon}
              {option.label}
            </FilterOption>
          ))}
        </FilterBar>
      </FilterBarSection>

      {/* Featured Cars - sempre exibir a seção */}
      <FeaturedSection>
        <SectionHeader>
          <SectionTitleWithArrow onClick={() => navigate('/vehicles')}>
            Carros em destaque perto de você
            <ArrowRight size={20} />
          </SectionTitleWithArrow>
        </SectionHeader>
        
        {loadingCars ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Carregando carros...
          </div>
        ) : carsLoadError ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Não foi possível carregar os carros.</p>
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Ver todos os veículos
            </button>
          </div>
        ) : featuredCars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#666', marginBottom: '1rem' }}>Nenhum carro em destaque no momento.</p>
            <button
              type="button"
              onClick={() => navigate('/vehicles')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Ver todos os veículos
            </button>
          </div>
        ) : (
          <CarsScrollContainer>
            {featuredCars.map((car) => (
              <CarCard key={car.id} onClick={() => navigate(`/vehicle/${car.id}`)}>
                <CarImage>
                  <Car size={48} />
                </CarImage>
                <CarInfo>
                  <CarTitle>{car.title}</CarTitle>
                  <CarRatingRow>
                    <CarRating>
                      <Star size={16} color="#8B5CF6" />
                      {car.rating}
                    </CarRating>
                    <CarTrips>({car.trips} viagens)</CarTrips>
                  </CarRatingRow>
                  <CarPriceRow>
                    <CarPrice>R$ {car.price} por {car.days} dias</CarPrice>
                    {car.save && <CarSave>Economize R$ {car.save}</CarSave>}
                  </CarPriceRow>
                </CarInfo>
              </CarCard>
            ))}
          </CarsScrollContainer>
        )}
      </FeaturedSection>

      {/* How It Works */}
      <HowItWorksSection>
        <SectionTitle>Como funciona</SectionTitle>
        <SectionSubtitle>
          Seja para alugar um carro ou compartilhar o seu, tornamos tudo simples
        </SectionSubtitle>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'rent'} 
            onClick={() => setActiveTab('rent')}
          >
            Para Hóspedes
          </Tab>
          <Tab 
            active={activeTab === 'host'} 
            onClick={() => setActiveTab('host')}
          >
            Para Anfitriões
          </Tab>
        </TabsContainer>

        <StepsGrid>
          {(activeTab === 'rent' ? renterSteps : ownerSteps).map((step, index) => (
            <StepCard key={index}>
              <StepNumber>{index + 1}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </StepsGrid>
      </HowItWorksSection>

      {/* Trust Section */}
      <TrustSection>
        <SectionTitle>Por que escolher CAR AND GO?</SectionTitle>
        <SectionSubtitle>
          Estamos comprometidos em fornecer uma experiência segura, confiável e segura de compartilhamento de carros
        </SectionSubtitle>
        
        <TrustGrid>
          {trustFeatures.map((feature, index) => (
            <TrustCard key={index}>
              <TrustIcon>{feature.icon}</TrustIcon>
              <TrustTitle>{feature.title}</TrustTitle>
              <TrustDescription>{feature.description}</TrustDescription>
            </TrustCard>
          ))}
        </TrustGrid>
      </TrustSection>

      {/* CTA Section */}
      <CTASection>
        <SectionTitle style={{ color: 'white', marginBottom: '2rem' }}>
          Pronto para começar?
        </SectionTitle>
        <SectionSubtitle style={{ color: 'white', marginBottom: '3rem' }}>
          Junte-se a milhares de clientes satisfeitos em todo o Brasil
        </SectionSubtitle>
        <div>
          <CTAButton onClick={() => navigate('/vehicles')}>
            Encontrar um Carro
          </CTAButton>
          <CTAButton onClick={() => navigate('/register')}>
            Anunciar Seu Carro
          </CTAButton>
        </div>
      </CTASection>
    </>
  );
};

export default HomePage;