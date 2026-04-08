import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Car, Check, Phone, Calendar, Edit, Smartphone, Money, Shield, Lock, Star, Location, Map, ArrowRight, LocationOn, User, Electric } from '../components/IconSystem';
import heroBg from '../assets/one-way-car-rentals.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
import { PlayArrow } from '@mui/icons-material';
import { vehicleService, bookingService } from '../services/authService';
import modernTheme from '../styles/modernTheme';
import { darkPanelCss, glassPanelCss, primaryButtonCss, secondaryButtonCss, solidPanelCss, subtitleCss } from '../styles/modernPrimitives';

function normalizePhotoSrc(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!s) return null;
  if (s.startsWith('data:')) return s;
  if (s.startsWith('http://') || s.startsWith('https://')) return s;

  const head = s.slice(0, 12);
  const mime =
    head.startsWith('iVBOR') ? 'image/png'
    : head.startsWith('/9j/') ? 'image/jpeg'
    : head.startsWith('R0lGOD') ? 'image/gif'
    : head.startsWith('UklGR') ? 'image/webp'
    : 'image/jpeg';
  return `data:${mime};base64,${s}`;
}

function getFeaturedCarImageSrc(vehicle: any): string | null {
  const raw = vehicle?.thumbnail || vehicle?.photos?.[0];
  return normalizePhotoSrc(raw);
}

function getStoredUser(): any {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

// Hero Section with Search - Turo Style
const HeroSection = styled.section`
  background: ${modernTheme.gradients.hero}, url(${heroBg});
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  color: white;
  padding: 4.25rem 2rem 3.5rem;
  min-height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  max-width: ${modernTheme.widths.hero};
  margin: 1.25rem auto 0;
  border-radius: 36px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.24);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 18% 18%, rgba(246, 136, 92, 0.28), transparent 24%),
      radial-gradient(circle at 84% 12%, rgba(139, 92, 246, 0.22), transparent 22%),
      radial-gradient(circle at 50% 100%, rgba(56, 189, 248, 0.18), transparent 24%);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: auto -10% -32% 46%;
    height: 280px;
    background: rgba(246, 136, 92, 0.18);
    filter: blur(70px);
    z-index: 0;
  }

  @media (max-width: 768px) {
    margin: 0.75rem 1rem 0;
    padding: 3rem 1.25rem 2.5rem;
    border-radius: 28px;
  }

  @media (max-width: 480px) {
    margin: 0.5rem 0.75rem 0;
    padding: 2.5rem 1rem 2rem;
    border-radius: 24px;
  }
`;

const HeroWrapper = styled.div`
  max-width: 1180px;
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

const HeroEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  border-radius: ${modernTheme.radii.pill};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.6rem, 6vw, 4.8rem);
  margin: 0 auto 1rem;
  max-width: 840px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.04em;
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
  font-size: 1.15rem;
  margin-bottom: 1.75rem;
  opacity: 1;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.86);
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

const HeroHighlights = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
`;

const HeroHighlight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: ${modernTheme.radii.pill};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.95rem;
  backdrop-filter: blur(10px);

  svg {
    color: #ffb594;
    flex-shrink: 0;
  }
`;

const SearchContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  padding: 0;
  box-shadow: 0 28px 65px rgba(15, 23, 42, 0.22);
  max-width: 100%;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  backdrop-filter: blur(18px);

  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 24px;
    width: 100%;
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
    border-right: 1px solid rgba(15, 23, 42, 0.08);
  }

  @media (max-width: 768px) {
    width: 100%;
    flex: none;
    border-right: none;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    
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
  background: transparent;
  color: ${modernTheme.colors.ink};
  transition: all 0.2s ease;
  height: 64px;
  box-sizing: border-box;
  font-weight: 400;
  width: 100%;

  &:focus {
    background: rgba(248, 250, 252, 0.86);
  }

  &::placeholder {
    color: ${modernTheme.colors.muted};
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
    border-right: 1px solid rgba(15, 23, 42, 0.08);
  }

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
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
  background: transparent;
  color: ${modernTheme.colors.ink};
  transition: all 0.2s ease;
  height: 64px;
  box-sizing: border-box;
  font-weight: 400;
  flex: 1;
  cursor: pointer;
  min-width: 140px;
  width: 100%;

  &:focus {
    background: rgba(248, 250, 252, 0.86);
  }

  &::placeholder {
    color: ${modernTheme.colors.muted};
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
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  }
`;

const TimeSelect = styled.select`
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 1.5rem 1rem 0.75rem 1rem;
  background: transparent;
  color: ${modernTheme.colors.ink};
  transition: all 0.2s ease;
  height: 64px;
  box-sizing: border-box;
  font-weight: 400;
  flex: 1;
  cursor: pointer;
  border-left: 1px solid rgba(15, 23, 42, 0.08);
  min-width: 90px;

  &:focus {
    background: rgba(248, 250, 252, 0.86);
  }

  @media (max-width: 768px) {
    height: 52px;
    min-height: 48px;
    padding: 1rem 0.75rem 0.5rem 0.75rem;
    border-left: 1px solid rgba(15, 23, 42, 0.08);
    border-bottom: none;
    min-width: 0;
    flex: 1;
    font-size: 0.95rem;
  }
  @media (max-width: 480px) {
    flex: none;
    width: 100%;
    border-left: none;
    border-top: 1px solid rgba(15, 23, 42, 0.08);
  }
`;

const DateTimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  min-width: 0;

  &:not(:last-child) {
    border-right: 1px solid rgba(15, 23, 42, 0.08);
  }

  @media (max-width: 768px) {
    width: 100%;
    flex: none;
    border-right: none;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    
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
  color: ${modernTheme.colors.muted};
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
    border-right: 1px solid rgba(15, 23, 42, 0.08);
  }

  @media (max-width: 768px) {
    width: 100%;
    flex: none;
    border-right: none;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  }
`;

const GeoLocationButton = styled.button`
  position: absolute;
  right: 8px;
  background: ${modernTheme.colors.brandSoft};
  border: 1px solid rgba(246, 136, 92, 0.2);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${modernTheme.colors.brandStrong};

  &:hover {
    background: rgba(246, 136, 92, 0.18);
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
  background: ${modernTheme.gradients.brand};
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 20px;
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
  margin: 8px;
  box-shadow: ${modernTheme.shadows.glow};

  &:hover {
    transform: translateY(-1px) scale(1.01);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 56px;
    border-radius: 0 0 24px 24px;
    margin: 0;
  }
`;

const GetToKnowButton = styled.button`
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 0.75rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: ${modernTheme.radii.pill};
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  backdrop-filter: blur(12px);

  &:hover {
    background: rgba(255, 255, 255, 0.18);
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
  padding: 4.5rem 2rem;
  background: ${modernTheme.gradients.section};
  max-width: ${modernTheme.widths.content};
  margin: 1.5rem auto 0;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: ${modernTheme.shadows.soft};

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
    margin: 1rem 1rem 0;
  }

  @media (max-width: 480px) {
    padding: 3rem 1rem;
    margin: 0.75rem 0.75rem 0;
    border-radius: 24px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3.25rem);
  text-align: center;
  margin-bottom: 1rem;
  color: ${modernTheme.colors.ink};
  font-weight: 800;
  letter-spacing: -0.04em;
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
  font-size: 1.08rem;
  color: ${modernTheme.colors.muted};
  margin-bottom: 3rem;
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
  padding: 0.4rem;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  background: rgba(15, 23, 42, 0.05);
  border-radius: ${modernTheme.radii.pill};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2.25rem;
  border: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.26)' : 'transparent'};
  background: ${props => props.active ? modernTheme.gradients.brand : 'transparent'};
  color: ${props => props.active ? 'white' : modernTheme.colors.muted};
  border-radius: ${modernTheme.radii.pill};
  cursor: pointer;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? modernTheme.shadows.glow : 'none'};

  &:hover {
    background: ${props => props.active ? modernTheme.gradients.brand : 'rgba(255, 255, 255, 0.8)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.active ? modernTheme.shadows.glow : '0 10px 25px rgba(15, 23, 42, 0.08)'};
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
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.92) 100%);
  padding: 2.5rem;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 50px rgba(15, 23, 42, 0.14);
    border-color: rgba(246, 136, 92, 0.2);
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  background: ${modernTheme.gradients.brand};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
  box-shadow: ${modernTheme.shadows.glow};
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
  padding: 2.5rem 2rem;
  background: ${modernTheme.gradients.section};
  max-width: ${modernTheme.widths.hero};
  margin: 1.25rem auto 0;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: ${modernTheme.shadows.soft};

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin: 1rem 1rem 0;
    border-radius: 24px;
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
  color: ${modernTheme.colors.ink};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${modernTheme.colors.brandStrong};
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
    background: rgba(15, 23, 42, 0.08);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(15, 23, 42, 0.24);
    border-radius: 4px;

    &:hover {
      background: rgba(15, 23, 42, 0.36);
    }
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const CarCard = styled.div`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.85);
  min-width: 320px;
  max-width: 320px;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 52px rgba(15, 23, 42, 0.16);
    border-color: rgba(246, 136, 92, 0.2);
  }

  @media (max-width: 768px) {
    min-width: 280px;
    max-width: 280px;
  }
`;

const CarImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, rgba(246, 136, 92, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #ea580c;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

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
  color: ${modernTheme.colors.ink};
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
`;

const ViewAllButton = styled.button`
  background: transparent;
  border: 2px solid #F6885C;
  color: #F6885C;
  padding: 1.125rem 2.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  display: block;
  margin: 4rem auto 0;

  &:hover {
    background: #F6885C;
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
  padding: 4.5rem 2rem;
  background: ${modernTheme.gradients.section};
  max-width: ${modernTheme.widths.content};
  margin: 1.5rem auto 0;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow: ${modernTheme.shadows.soft};

  @media (max-width: 768px) {
    padding: 3.5rem 1.25rem;
    margin: 1rem 1rem 0;
    border-radius: 24px;
  }
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
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 24px;
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.08);
`;

const TrustIcon = styled.div`
  width: 68px;
  height: 68px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: rgba(246, 136, 92, 0.12);
  color: ${modernTheme.colors.brandStrong};
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
  padding: 4.5rem 2rem;
  background: ${modernTheme.gradients.dark};
  color: white;
  text-align: center;
  max-width: ${modernTheme.widths.content};
  margin: 1.5rem auto 0;
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 32px 80px rgba(15, 23, 42, 0.22);

  &::before {
    content: '';
    position: absolute;
    inset: -20% auto auto -10%;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: rgba(246, 136, 92, 0.16);
    filter: blur(80px);
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 3.5rem 1.25rem;
    margin: 1rem 1rem 0;
    border-radius: 24px;
  }
`;

// Filter Bar Section
const FilterBarSection = styled.section`
  background: transparent;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  width: 100%;
  margin: -1.5rem auto 0;
  position: relative;
  z-index: 4;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: -1rem;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  justify-content: center;
  max-width: ${modernTheme.widths.content};
  width: 100%;
  padding: 0.65rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: ${modernTheme.radii.pill};
  box-shadow: ${modernTheme.shadows.soft};
  backdrop-filter: blur(18px);

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
  border: 1px solid ${props => props.active ? 'rgba(255, 255, 255, 0.18)' : 'transparent'};
  border-radius: ${modernTheme.radii.pill};
  background: ${props => props.active ? modernTheme.gradients.brand : 'transparent'};
  color: ${props => props.active ? 'white' : modernTheme.colors.inkSoft};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;

  &:hover {
    background: ${props => props.active ? modernTheme.gradients.brand : 'rgba(255, 255, 255, 0.82)'};
  }

  svg {
    font-size: 1rem;
    color: inherit;
  }
`;

// Cars Grid Section
const CarsGridSection = styled.section`
  padding: 2rem;
  background: white;
`;

const CTAButtons = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CTAButton = styled.button<{ $secondary?: boolean }>`
  background: ${props => props.$secondary ? 'rgba(255, 255, 255, 0.08)' : modernTheme.gradients.brand};
  color: white;
  border: 1px solid ${props => props.$secondary ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.14)'};
  padding: 1.25rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$secondary ? 'none' : modernTheme.shadows.glow};
  backdrop-filter: blur(12px);

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.$secondary ? '0 20px 40px rgba(15, 23, 42, 0.16)' : '0 24px 60px rgba(220, 94, 49, 0.28)'};
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 1rem 2.5rem;
  }
`;

// Lessor home – painel administrativo
const LessorShell = styled.section`
  max-width: 1320px;
  margin: 1.25rem auto 0;
  padding: 0 1rem 2rem;
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 1rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    padding: 0 0.9rem 1.5rem;
    margin-top: 0.9rem;
  }
`;

const LessorSidebar = styled.aside`
  ${darkPanelCss}
  padding: 1.5rem;
  position: sticky;
  top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 1100px) {
    position: static;
  }

  @media (max-width: 768px) {
    padding: 1.15rem;
    border-radius: 24px;
  }
`;

const LessorSidebarBrand = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
`;

const LessorSidebarIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(246, 136, 92, 0.98) 0%, rgba(220, 94, 49, 0.98) 100%);
  color: white;
  box-shadow: 0 18px 36px rgba(220, 94, 49, 0.28);
  flex-shrink: 0;
`;

const LessorSidebarCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const LessorSidebarTitle = styled.h1`
  margin: 0;
  font-size: 1.15rem;
  line-height: 1.2;
`;

const LessorSidebarText = styled.p`
  margin: 0;
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  line-height: 1.6;
`;

const LessorSidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  @media (max-width: 1100px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
`;

const LessorSidebarNavButton = styled.button<{ $active?: boolean }>`
  border: 1px solid ${p => p.$active ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)'};
  border-radius: 18px;
  background: ${p => p.$active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'};
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.95rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.16);
  }
`;

const LessorSidebarStats = styled.div`
  display: grid;
  gap: 0.75rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
`;

const LessorSidebarStat = styled.div`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 1rem;
`;

const LessorSidebarStatLabel = styled.span`
  display: block;
  color: rgba(255,255,255,0.68);
  font-size: 0.82rem;
`;

const LessorSidebarStatValue = styled.strong`
  display: block;
  margin-top: 0.35rem;
  font-size: 1.35rem;
  line-height: 1.1;
`;

const LessorMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
`;

const LessorHero = styled.section`
  ${darkPanelCss}
  padding: 1.75rem;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(220px, 0.9fr);
  gap: 1.2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: auto -6% -18% auto;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: rgba(246, 136, 92, 0.18);
    filter: blur(76px);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 1.35rem;
  }
`;

const LessorHeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const LessorHeroEyebrow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.48rem 0.82rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.09);
  color: rgba(255,255,255,0.84);
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const LessorHeroTitle = styled.h2`
  margin: 0 0 0.8rem;
  font-size: clamp(1.9rem, 2.2vw, 2.5rem);
  line-height: 1.08;
  letter-spacing: -0.03em;
`;

const LessorHeroSubtitle = styled.p`
  margin: 0;
  max-width: 620px;
  color: rgba(255,255,255,0.72);
  line-height: 1.7;
`;

const LessorHeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.5rem;
`;

const LessorHeroButton = styled.button<{ $secondary?: boolean }>`
  ${p => p.$secondary ? secondaryButtonCss : primaryButtonCss}
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.15rem;
  font-size: 0.94rem;
  font-weight: 600;
  cursor: pointer;
  ${p => p.$secondary && `
    background: rgba(255,255,255,0.1);
    color: white;
    border-color: rgba(255,255,255,0.12);
  `}
`;

const LessorHeroMetrics = styled.div`
  display: grid;
  gap: 0.8rem;
  position: relative;
  z-index: 1;
`;

const LessorHeroMetricCard = styled.div`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 22px;
  padding: 1rem 1.05rem;

  span {
    display: block;
    color: rgba(255,255,255,0.66);
    font-size: 0.82rem;
    margin-bottom: 0.35rem;
  }
`;

const LessorHeroMetricValue = styled.strong`
  display: block;
  font-size: 1.45rem;
  line-height: 1.1;
`;

const LessorStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
`;

const LessorStatCard = styled.article`
  ${glassPanelCss}
  border-radius: 24px;
  padding: 1.2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
    height: 4px;
    background: ${modernTheme.gradients.brand};
  }
`;

const LessorStatIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.85rem;
  background: rgba(246, 136, 92, 0.12);
  color: ${modernTheme.colors.brandStrong};
`;

const LessorStatNumber = styled.div`
  font-size: 1.85rem;
  font-weight: 700;
  color: ${modernTheme.colors.ink};
  line-height: 1.1;
`;

const LessorStatLabel = styled.div`
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: ${modernTheme.colors.inkSoft};
`;

const LessorStatMeta = styled.div`
  margin-top: 0.4rem;
  font-size: 0.84rem;
  color: ${modernTheme.colors.muted};
`;

const LessorOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
`;

const LessorInsightCard = styled.article<{ $span?: number; $dark?: boolean }>`
  ${p => p.$dark ? darkPanelCss : glassPanelCss}
  grid-column: span ${p => p.$span || 4};
  border-radius: 28px;
  padding: 1.35rem;
  overflow: hidden;
  position: relative;
  min-width: 0;
  color: ${p => p.$dark ? 'white' : modernTheme.colors.ink};

  @media (max-width: 1100px) {
    grid-column: span 12;
  }
`;

const LessorCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.85rem;
  margin-bottom: 1rem;
`;

const LessorCardTitle = styled.h3<{ $dark?: boolean }>`
  margin: 0;
  font-size: 1.05rem;
  color: ${p => p.$dark ? 'white' : modernTheme.colors.ink};
`;

const LessorCardSubtitle = styled.p<{ $dark?: boolean }>`
  ${subtitleCss}
  margin: 0.3rem 0 0;
  color: ${p => p.$dark ? 'rgba(255,255,255,0.72)' : modernTheme.colors.muted};
  font-size: 0.92rem;
`;

const LessorQuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.9rem;
`;

const LessorActionCard = styled.button`
  ${solidPanelCss}
  border-radius: 22px;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 44px rgba(15, 23, 42, 0.12);
  }
`;

const LessorActionIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${modernTheme.gradients.brand};
  color: white;
  box-shadow: ${modernTheme.shadows.glow};
`;

const LessorActionTitle = styled.div`
  font-weight: 700;
  color: ${modernTheme.colors.ink};
`;

const LessorActionDesc = styled.div`
  font-size: 0.9rem;
  color: ${modernTheme.colors.muted};
  line-height: 1.5;
`;

const LessorStatusStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const LessorStatusRow = styled.div`
  background: rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 0.85rem 0.95rem;
`;

const LessorStatusMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.6rem;
`;

const LessorStatusLabel = styled.span`
  color: inherit;
  font-weight: 600;
`;

const LessorStatusValue = styled.span`
  color: inherit;
  opacity: 0.78;
  font-size: 0.88rem;
`;

const LessorStatusTrack = styled.div`
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
`;

const LessorStatusFill = styled.div<{ $accent?: string; $width: number }>`
  height: 100%;
  width: ${p => (p.$width <= 0 ? 0 : Math.max(6, p.$width))}%;
  border-radius: inherit;
  background: ${p => p.$accent || modernTheme.colors.brand};
`;

const LessorRingWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.1rem 0 1rem;
`;

const LessorRing = styled.div<{ $value: number }>`
  width: 176px;
  height: 176px;
  border-radius: 50%;
  position: relative;
  display: grid;
  place-items: center;
  background:
    conic-gradient(
      ${modernTheme.colors.brand} 0 ${p => p.$value}%,
      rgba(255,255,255,0.12) ${p => p.$value}% 100%
    );

  &::before {
    content: '';
    position: absolute;
    inset: 16px;
    border-radius: 50%;
    background: rgba(7, 17, 31, 0.92);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
  }
`;

const LessorRingCenter = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;

  strong {
    display: block;
    font-size: 2rem;
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 0.35rem;
    color: rgba(255,255,255,0.68);
    font-size: 0.88rem;
  }
`;

const LessorBookingPreviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const LessorBookingPreviewItem = styled.button`
  ${solidPanelCss}
  border-radius: 20px;
  padding: 0.95rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  cursor: pointer;
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.1);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LessorBookingPreviewMain = styled.div`
  min-width: 0;
`;

const LessorBookingPreviewTitle = styled.div`
  font-weight: 700;
  color: ${modernTheme.colors.ink};
`;

const LessorBookingPreviewMeta = styled.div`
  margin-top: 0.3rem;
  font-size: 0.88rem;
  color: ${modernTheme.colors.muted};
`;

const LessorStatusBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: ${p => `${p.$color}18`};
  color: ${p => p.$color};
  font-size: 0.8rem;
  font-weight: 700;
`;

const LessorVehicleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const LessorVehicleItem = styled.div`
  background: rgba(255,255,255,0.58);
  border: 1px solid rgba(255,255,255,0.76);
  border-radius: 20px;
  padding: 0.95rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LessorVehicleSummary = styled.div`
  min-width: 0;
`;

const LessorVehicleTitle = styled.div`
  font-weight: 700;
  color: ${modernTheme.colors.ink};
`;

const LessorVehicleMeta = styled.div`
  margin-top: 0.25rem;
  color: ${modernTheme.colors.muted};
  font-size: 0.88rem;
`;

const LessorVehicleValue = styled.div`
  text-align: right;

  strong {
    display: block;
    color: ${modernTheme.colors.ink};
    font-size: 1rem;
  }

  span {
    display: block;
    margin-top: 0.25rem;
    color: ${modernTheme.colors.muted};
    font-size: 0.84rem;
  }

  @media (max-width: 640px) {
    text-align: left;
  }
`;

const LessorPanelContent = styled.div`
  ${glassPanelCss}
  border-radius: 28px;
  padding: 1.4rem;
`;

const LessorBookingCard = styled.div`
  ${solidPanelCss}
  border-radius: 22px;
  padding: 1.15rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 20px 44px rgba(15, 23, 42, 0.12);
  }
`;

const LessorBookingCardLink = styled.span`
  color: ${modernTheme.colors.brandStrong};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.86rem;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const LessorModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(7, 17, 31, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const LessorModalContent = styled.div`
  ${glassPanelCss}
  background: rgba(255,255,255,0.96);
  border-radius: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.2);
`;

const LessorModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LessorModalTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: ${modernTheme.colors.ink};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LessorModalCloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${modernTheme.colors.muted};
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;

  &:hover {
    color: ${modernTheme.colors.ink};
  }
`;

const LessorModalBody = styled.div`
  padding: 1.25rem 1.5rem;
`;

const LessorModalAddress = styled.div`
  background: rgba(246, 136, 92, 0.08);
  border-radius: 16px;
  padding: 1rem 1.1rem;
  margin-bottom: 1rem;
  border-left: 4px solid ${modernTheme.colors.brand};
`;

const LessorModalAddressLine = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${modernTheme.colors.ink};
  line-height: 1.5;

  & + & {
    margin-top: 0.25rem;
    font-size: 0.95rem;
    color: ${modernTheme.colors.inkSoft};
  }
`;

const LessorModalMapWrap = styled.div`
  height: 220px;
  border-radius: 14px;
  overflow: hidden;

  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const LessorProfileRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);

  &:last-child {
    border-bottom: none;
  }
`;

const LessorProfileLabel = styled.span`
  font-size: 0.8rem;
  color: ${modernTheme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const LessorProfileValue = styled.span`
  font-size: 1rem;
  color: ${modernTheme.colors.ink};

  a {
    color: ${modernTheme.colors.brandStrong};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LessorHomeView: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [panelView, setPanelView] = useState<'overview' | 'bookings'>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'bookings') return 'bookings';
    return 'overview';
  });
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
    setPanelView(tab === 'bookings' ? 'bookings' : 'overview');
  }, [searchParams, navigate]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    Promise.all([
      vehicleService.getAllVehicles().catch(() => []),
      bookingService.getBookings().catch(() => []),
    ]).then(([allVehicles, allBookings]) => {
      const myVehicles = Array.isArray(allVehicles) ? allVehicles.filter((v: any) => v.ownerId === user.id || v.owner?.id === user.id) : [];
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

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

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
      'pending': '#f59e0b', 'confirmed': '#10b981', 'awaiting_return': '#ea580c', 'active': '#F6885C',
      'completed': '#6b7280', 'cancelled': '#ef4444', 'rejected': '#ef4444', 'expired': '#9ca3af'
    };
    return colorMap[status?.toLowerCase()] || '#6b7280';
  };

  const getLessorAmount = (booking: any) => {
    const lessorAmount = typeof booking?.lessorAmount === 'number' ? booking.lessorAmount : parseFloat(booking?.lessorAmount) || 0;
    if (lessorAmount > 0) return lessorAmount;
    return typeof booking?.totalAmount === 'number' ? booking.totalAmount : parseFloat(booking?.totalAmount) || 0;
  };

  const getBookingTimestamp = (booking: any) => {
    const source = booking?.startDate || booking?.createdAt || booking?.updatedAt;
    const date = source ? new Date(source) : null;
    return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
  };

  const lesseeBookings = bookings.filter((b: any) => b.lesseeId === user?.id || b.lessee?.id === user?.id);
  const lessorBookings = bookings.filter((b: any) => b.lessorId === user?.id || b.lessor?.id === user?.id);
  const vehiclesCount = vehicles.length;
  const bookingsCount = lessorBookings.length;
  const activeStatuses = ['pending', 'confirmed', 'active', 'awaiting_return'];
  const activeLessorBookings = lessorBookings.filter((b: any) => activeStatuses.includes(String(b.status || '').toLowerCase()));
  const pendingLessorBookings = lessorBookings.filter((b: any) => String(b.status || '').toLowerCase() === 'pending');
  const confirmedLessorBookings = lessorBookings.filter((b: any) => String(b.status || '').toLowerCase() === 'confirmed');
  const completedLessorBookings = lessorBookings.filter((b: any) => String(b.status || '').toLowerCase() === 'completed');
  const cancelledLessorBookings = lessorBookings.filter((b: any) => ['cancelled', 'rejected'].includes(String(b.status || '').toLowerCase()));
  const totalEarnings = lessorBookings.reduce((sum: number, booking: any) => sum + getLessorAmount(booking), 0);
  const avgTicket = bookingsCount ? totalEarnings / bookingsCount : 0;
  const completionRate = bookingsCount ? Math.round((completedLessorBookings.length / bookingsCount) * 100) : 0;
  const occupancyRate = vehiclesCount ? Math.min(100, Math.round((activeLessorBookings.length / vehiclesCount) * 100)) : 0;
  const firstName = user?.firstName || 'Locador';

  const vehiclePerformance = useMemo(() => {
    const bookingsByVehicle: Record<string, { count: number; earnings: number }> = {};

    for (const booking of lessorBookings) {
      const vehicleId = booking.vehicleId || booking.vehicle?.id;
      if (!vehicleId) continue;
      if (!bookingsByVehicle[vehicleId]) {
        bookingsByVehicle[vehicleId] = { count: 0, earnings: 0 };
      }
      bookingsByVehicle[vehicleId].count += 1;
      bookingsByVehicle[vehicleId].earnings += getLessorAmount(booking);
    }

    return vehicles
      .map((vehicle: any) => {
        const stats = bookingsByVehicle[vehicle.id] || { count: 0, earnings: 0 };
        return {
          ...vehicle,
          totalBookings: stats.count,
          totalEarnings: stats.earnings,
        };
      })
      .sort((a: any, b: any) => {
        if (b.totalBookings !== a.totalBookings) return b.totalBookings - a.totalBookings;
        return b.totalEarnings - a.totalEarnings;
      })
      .slice(0, 3);
  }, [vehicles, lessorBookings]);

  const recentBookings = useMemo(
    () => [...lessorBookings].sort((a: any, b: any) => getBookingTimestamp(b) - getBookingTimestamp(a)).slice(0, 4),
    [lessorBookings]
  );

  const statusRows = [
    { label: 'Pendentes', value: pendingLessorBookings.length, accent: '#f59e0b' },
    { label: 'Confirmadas', value: confirmedLessorBookings.length, accent: '#10b981' },
    { label: 'Em andamento', value: activeLessorBookings.length, accent: modernTheme.colors.brand },
    { label: 'Concluídas', value: completedLessorBookings.length, accent: '#8b5cf6' },
  ];
  const maxStatusValue = Math.max(...statusRows.map((item) => item.value), 1);

  const actions = [
    { title: 'Meus veículos', desc: 'Ver e editar seus anúncios ativos', onClick: () => navigate('/vehicles/my'), icon: <Car size={22} /> },
    { title: 'Anunciar veículo', desc: 'Cadastrar um novo carro para locação', onClick: () => navigate('/list-vehicle'), icon: <Edit size={22} /> },
    { title: 'Reservas', desc: 'Acompanhar solicitações e locatários', onClick: () => setTab('bookings'), icon: <Calendar size={22} /> },
    { title: 'Dados bancários', desc: 'Configurar onde receber os pagamentos', onClick: () => navigate('/bank-details'), icon: <Money size={22} /> },
  ];

  return (
    <>
      <LessorShell>
        <LessorSidebar>
          <LessorSidebarBrand>
            <LessorSidebarIcon>
              <Car size={24} color="white" />
            </LessorSidebarIcon>
            <LessorSidebarCopy>
              <LessorSidebarTitle>Painel do locador</LessorSidebarTitle>
              <LessorSidebarText>
                Gerencie anúncios, reservas e recebimentos com o visual principal do CarAndGo.
              </LessorSidebarText>
            </LessorSidebarCopy>
          </LessorSidebarBrand>

          <LessorSidebarNav>
            <LessorSidebarNavButton type="button" $active={panelView === 'overview'} onClick={() => setTab('overview')}>
              <Car size={18} color="white" />
              Visão geral
            </LessorSidebarNavButton>
            <LessorSidebarNavButton type="button" $active={panelView === 'bookings'} onClick={() => setTab('bookings')}>
              <Calendar size={18} color="white" />
              Reservas
            </LessorSidebarNavButton>
            <LessorSidebarNavButton type="button" onClick={() => navigate('/vehicles/my')}>
              <Edit size={18} color="white" />
              Meus veículos
            </LessorSidebarNavButton>
            <LessorSidebarNavButton type="button" onClick={() => navigate('/bank-details')}>
              <Money size={18} color="white" />
              Recebimentos
            </LessorSidebarNavButton>
          </LessorSidebarNav>

          <LessorSidebarStats>
            <LessorSidebarStat>
              <LessorSidebarStatLabel>Receita total</LessorSidebarStatLabel>
              <LessorSidebarStatValue>{formatCurrency(totalEarnings)}</LessorSidebarStatValue>
            </LessorSidebarStat>
            <LessorSidebarStat>
              <LessorSidebarStatLabel>Taxa de conclusão</LessorSidebarStatLabel>
              <LessorSidebarStatValue>{completionRate}%</LessorSidebarStatValue>
            </LessorSidebarStat>
          </LessorSidebarStats>
        </LessorSidebar>

        <LessorMain>
          <LessorHero>
            <LessorHeroContent>
              <LessorHeroEyebrow>
                <Calendar size={14} color="white" />
                Operação do locador
              </LessorHeroEyebrow>
              <LessorHeroTitle>Olá, {firstName}. Seu negócio está centralizado aqui.</LessorHeroTitle>
              <LessorHeroSubtitle>
                Acompanhe o desempenho dos seus veículos, veja reservas recentes e acesse rapidamente os principais fluxos do locador.
              </LessorHeroSubtitle>
              <LessorHeroActions>
                <LessorHeroButton type="button" onClick={() => navigate('/list-vehicle')}>
                  Anunciar veículo
                  <ArrowRight size={16} color="white" />
                </LessorHeroButton>
                <LessorHeroButton type="button" $secondary onClick={() => setTab('bookings')}>
                  Abrir reservas
                </LessorHeroButton>
              </LessorHeroActions>
            </LessorHeroContent>

            <LessorHeroMetrics>
              <LessorHeroMetricCard>
                <span>Pendentes</span>
                <LessorHeroMetricValue>{pendingLessorBookings.length}</LessorHeroMetricValue>
              </LessorHeroMetricCard>
              <LessorHeroMetricCard>
                <span>Em andamento</span>
                <LessorHeroMetricValue>{activeLessorBookings.length}</LessorHeroMetricValue>
              </LessorHeroMetricCard>
              <LessorHeroMetricCard>
                <span>Concluídas</span>
                <LessorHeroMetricValue>{completedLessorBookings.length}</LessorHeroMetricValue>
              </LessorHeroMetricCard>
            </LessorHeroMetrics>
          </LessorHero>

          {loading ? (
            <LessorPanelContent>
              <p style={{ textAlign: 'center', color: modernTheme.colors.muted }}>Carregando painel do locador...</p>
            </LessorPanelContent>
          ) : (
            <>
              <LessorStats>
                <LessorStatCard>
                  <LessorStatIcon><Car size={22} color={modernTheme.colors.brandStrong} /></LessorStatIcon>
                  <LessorStatNumber>{vehiclesCount}</LessorStatNumber>
                  <LessorStatLabel>Veículos anunciados</LessorStatLabel>
                  <LessorStatMeta>{activeLessorBookings.length} com operação em andamento</LessorStatMeta>
                </LessorStatCard>

                <LessorStatCard>
                  <LessorStatIcon><Calendar size={22} color={modernTheme.colors.brandStrong} /></LessorStatIcon>
                  <LessorStatNumber>{bookingsCount}</LessorStatNumber>
                  <LessorStatLabel>Reservas recebidas</LessorStatLabel>
                  <LessorStatMeta>{pendingLessorBookings.length} aguardando ação</LessorStatMeta>
                </LessorStatCard>

                <LessorStatCard>
                  <LessorStatIcon><Money size={22} color={modernTheme.colors.brandStrong} /></LessorStatIcon>
                  <LessorStatNumber>{formatCurrency(totalEarnings)}</LessorStatNumber>
                  <LessorStatLabel>Receita total</LessorStatLabel>
                  <LessorStatMeta>{formatCurrency(avgTicket)} por reserva em média</LessorStatMeta>
                </LessorStatCard>

                <LessorStatCard>
                  <LessorStatIcon><Star size={22} color={modernTheme.colors.brandStrong} /></LessorStatIcon>
                  <LessorStatNumber>{completionRate}%</LessorStatNumber>
                  <LessorStatLabel>Reservas concluídas</LessorStatLabel>
                  <LessorStatMeta>{cancelledLessorBookings.length} canceladas ou rejeitadas</LessorStatMeta>
                </LessorStatCard>
              </LessorStats>

              {panelView === 'overview' ? (
                <LessorOverviewGrid ref={contentSectionRef}>
                  <LessorInsightCard $span={7} $dark>
                    <LessorCardHeader>
                      <div>
                        <LessorCardTitle $dark>Ritmo das reservas</LessorCardTitle>
                        <LessorCardSubtitle $dark>Status atual das reservas dos seus veículos.</LessorCardSubtitle>
                      </div>
                    </LessorCardHeader>
                    <LessorStatusStack>
                      {statusRows.map((row) => (
                        <LessorStatusRow key={row.label}>
                          <LessorStatusMeta>
                            <LessorStatusLabel>{row.label}</LessorStatusLabel>
                            <LessorStatusValue>{row.value} reserva(s)</LessorStatusValue>
                          </LessorStatusMeta>
                          <LessorStatusTrack>
                            <LessorStatusFill $accent={row.accent} $width={(row.value / maxStatusValue) * 100} />
                          </LessorStatusTrack>
                        </LessorStatusRow>
                      ))}
                    </LessorStatusStack>
                  </LessorInsightCard>

                  <LessorInsightCard $span={5} $dark>
                    <LessorCardHeader>
                      <div>
                        <LessorCardTitle $dark>Eficiência operacional</LessorCardTitle>
                        <LessorCardSubtitle $dark>Leitura rápida da ocupação e do ticket médio.</LessorCardSubtitle>
                      </div>
                    </LessorCardHeader>
                    <LessorRingWrap>
                      <LessorRing $value={occupancyRate}>
                        <LessorRingCenter>
                          <strong>{occupancyRate}%</strong>
                          <span>ocupação estimada</span>
                        </LessorRingCenter>
                      </LessorRing>
                    </LessorRingWrap>
                    <LessorHeroMetrics>
                      <LessorHeroMetricCard>
                        <span>Ticket médio</span>
                        <LessorHeroMetricValue>{formatCurrency(avgTicket)}</LessorHeroMetricValue>
                      </LessorHeroMetricCard>
                      <LessorHeroMetricCard>
                        <span>Reservas ativas</span>
                        <LessorHeroMetricValue>{activeLessorBookings.length}</LessorHeroMetricValue>
                      </LessorHeroMetricCard>
                    </LessorHeroMetrics>
                  </LessorInsightCard>

                  <LessorInsightCard $span={7}>
                    <LessorCardHeader>
                      <div>
                        <LessorCardTitle>Ações rápidas</LessorCardTitle>
                        <LessorCardSubtitle>Atalhos para os fluxos principais do locador.</LessorCardSubtitle>
                      </div>
                    </LessorCardHeader>
                    <LessorQuickActionsGrid>
                      {actions.map((action) => (
                        <LessorActionCard key={action.title} type="button" onClick={action.onClick}>
                          <LessorActionIcon>{action.icon}</LessorActionIcon>
                          <div>
                            <LessorActionTitle>{action.title}</LessorActionTitle>
                            <LessorActionDesc>{action.desc}</LessorActionDesc>
                          </div>
                        </LessorActionCard>
                      ))}
                    </LessorQuickActionsGrid>
                  </LessorInsightCard>

                  <LessorInsightCard $span={5}>
                    <LessorCardHeader>
                      <div>
                        <LessorCardTitle>Veículos em destaque</LessorCardTitle>
                        <LessorCardSubtitle>Seus anúncios com melhor tração recente.</LessorCardSubtitle>
                      </div>
                    </LessorCardHeader>
                    {vehiclePerformance.length === 0 ? (
                      <p style={{ margin: 0, color: modernTheme.colors.muted, lineHeight: 1.6 }}>
                        Você ainda não anunciou nenhum veículo. Use o atalho acima para publicar o primeiro carro.
                      </p>
                    ) : (
                      <LessorVehicleList>
                        {vehiclePerformance.map((vehicle: any) => (
                          <LessorVehicleItem key={vehicle.id}>
                            <LessorVehicleSummary>
                              <LessorVehicleTitle>{vehicle.make} {vehicle.model} {vehicle.year}</LessorVehicleTitle>
                              <LessorVehicleMeta>
                                {[vehicle.city, vehicle.state].filter(Boolean).join(', ') || 'Localização não informada'}
                              </LessorVehicleMeta>
                            </LessorVehicleSummary>
                            <LessorVehicleValue>
                              <strong>{vehicle.totalBookings} reserva(s)</strong>
                              <span>{formatCurrency(vehicle.totalEarnings)} acumulados</span>
                            </LessorVehicleValue>
                          </LessorVehicleItem>
                        ))}
                      </LessorVehicleList>
                    )}
                  </LessorInsightCard>

                  <LessorInsightCard $span={12}>
                    <LessorCardHeader>
                      <div>
                        <LessorCardTitle>Reservas recentes</LessorCardTitle>
                        <LessorCardSubtitle>Últimas movimentações dos seus veículos.</LessorCardSubtitle>
                      </div>
                    </LessorCardHeader>
                    {recentBookings.length === 0 ? (
                      <p style={{ margin: 0, color: modernTheme.colors.muted, lineHeight: 1.6 }}>
                        Nenhuma reserva recebida ainda. Quando surgirem solicitações, elas aparecerão aqui.
                      </p>
                    ) : (
                      <LessorBookingPreviewList>
                        {recentBookings.map((booking: any) => (
                          <LessorBookingPreviewItem
                            key={booking.id}
                            type="button"
                            onClick={() => navigate(`/booking/${booking.id}/details`)}
                          >
                            <LessorBookingPreviewMain>
                              <LessorBookingPreviewTitle>
                                {booking.vehicle?.make || 'Veículo'} {booking.vehicle?.model || ''} {booking.vehicle?.year || ''}
                              </LessorBookingPreviewTitle>
                              <LessorBookingPreviewMeta>
                                Locatário: {booking.lessee?.firstName || booking.lessee?.name || 'N/A'} • {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </LessorBookingPreviewMeta>
                            </LessorBookingPreviewMain>
                            <div>
                              <LessorStatusBadge $color={getStatusColor(booking.status)}>
                                {getStatusLabel(booking.status)}
                              </LessorStatusBadge>
                              <LessorBookingPreviewMeta style={{ textAlign: 'right', marginTop: '0.45rem' }}>
                                {formatCurrency(getLessorAmount(booking))}
                              </LessorBookingPreviewMeta>
                            </div>
                          </LessorBookingPreviewItem>
                        ))}
                      </LessorBookingPreviewList>
                    )}
                  </LessorInsightCard>
                </LessorOverviewGrid>
              ) : (
                <LessorPanelContent ref={contentSectionRef}>
                  <LessorCardHeader>
                    <div>
                      <LessorCardTitle>Minhas reservas</LessorCardTitle>
                      <LessorCardSubtitle>
                        Acompanhe reservas como locador e, se aplicável, também como locatário.
                      </LessorCardSubtitle>
                    </div>
                  </LessorCardHeader>
                  {lesseeBookings.length === 0 && lessorBookings.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '2rem', color: modernTheme.colors.muted }}>Você ainda não possui reservas.</p>
                  ) : (
                    <>
                      {lesseeBookings.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                          <h4 style={{ marginBottom: '1rem', color: modernTheme.colors.ink }}>Reservas como locatário</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {lesseeBookings.map((booking: any) => (
                              <LessorBookingCard key={booking.id} onClick={() => booking.vehicle && setPickupLocationBooking(booking)}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', color: modernTheme.colors.ink }}>
                                    {booking.vehicle?.make || 'Veículo'} {booking.vehicle?.model || ''} {booking.vehicle?.year || ''}
                                  </div>
                                  <div style={{ color: modernTheme.colors.muted, fontSize: '0.9rem' }}>
                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                  </div>
                                  <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
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
                                  <LessorStatusBadge $color={getStatusColor(booking.status)}>
                                    {getStatusLabel(booking.status)}
                                  </LessorStatusBadge>
                                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.55rem', color: modernTheme.colors.ink }}>
                                    {formatCurrency(typeof booking.totalAmount === 'number' ? booking.totalAmount : parseFloat(booking.totalAmount) || 0)}
                                  </div>
                                </div>
                              </LessorBookingCard>
                            ))}
                          </div>
                        </div>
                      )}

                      {lessorBookings.length > 0 && (
                        <div>
                          <h4 style={{ marginBottom: '1rem', color: modernTheme.colors.ink }}>Reservas dos meus veículos</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {lessorBookings
                              .slice()
                              .sort((a: any, b: any) => getBookingTimestamp(b) - getBookingTimestamp(a))
                              .map((booking: any) => (
                                <LessorBookingCard key={booking.id} onClick={() => booking.vehicle && setPickupLocationBooking(booking)}>
                                  <div style={{ flex: 1, minWidth: '200px' }}>
                                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', color: modernTheme.colors.ink }}>
                                      {booking.vehicle?.make || 'Veículo'} {booking.vehicle?.model || ''} {booking.vehicle?.year || ''}
                                    </div>
                                    <div style={{ color: modernTheme.colors.muted, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                      Locatário: {booking.lessee?.firstName || booking.lessee?.name || 'N/A'}
                                    </div>
                                    <div style={{ color: modernTheme.colors.muted, fontSize: '0.9rem' }}>
                                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                    </div>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
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
                                    <LessorStatusBadge $color={getStatusColor(booking.status)}>
                                      {getStatusLabel(booking.status)}
                                    </LessorStatusBadge>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.55rem', color: modernTheme.colors.ink }}>
                                      {formatCurrency(getLessorAmount(booking))}
                                    </div>
                                  </div>
                                </LessorBookingCard>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </LessorPanelContent>
              )}
            </>
          )}
        </LessorMain>
      </LessorShell>

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
  const [viewerUser, setViewerUser] = useState<any>(() => getStoredUser());
  const userType = viewerUser?.userType;
  const isLoggedIn = !!viewerUser?.id;
  const isLocatarioUser = userType === 'lessee' || userType === 'rent';
  const isLocadorUser = userType === 'lessor' || userType === 'host';
  const isBothUser = userType === 'both';
  const isLessorHome = (isLocadorUser || isBothUser) && viewerUser?.id;
  const canShowFindCarCta = !isLoggedIn || isLocatarioUser || isBothUser || (!isLocadorUser && !isLocatarioUser);
  const canShowListCarCta = !isLoggedIn || isLocadorUser || isBothUser || (!isLocadorUser && !isLocatarioUser);
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

  useEffect(() => {
    const refreshUser = () => setViewerUser(getStoredUser());

    window.addEventListener('userLoggedIn', refreshUser);
    window.addEventListener('storage', refreshUser);
    window.addEventListener('focus', refreshUser);

    return () => {
      window.removeEventListener('userLoggedIn', refreshUser);
      window.removeEventListener('storage', refreshUser);
      window.removeEventListener('focus', refreshUser);
    };
  }, []);

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
    { id: 'monthly', label: 'Mensalistas', icon: <Calendar size={16} /> },
    { id: 'nearby', label: 'Próximo', icon: <Location size={16} /> },
  ];

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    // You can add additional logic here to filter cars based on the selected filter
  };

  useEffect(() => {
    let cancelled = false;

    const loadFeaturedCars = async () => {
      try {
        setLoadingCars(true);
        setCarsLoadError(false);

        const coords = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
          if (!navigator.geolocation) {
            resolve(null);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
            },
            () => resolve(null),
            { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
          );
        });

        if (cancelled) return;

        let vehicles: any[];
        if (coords) {
          vehicles = await vehicleService.searchVehicles({
            userLat: coords.lat,
            userLng: coords.lng,
            sortBy: 'distance',
            sortOrder: 'ASC',
          });
        } else {
          const data = await vehicleService.getAllVehicles();
          vehicles = Array.isArray(data) ? data : [];
        }

        const formattedCars = vehicles.slice(0, 6).map((vehicle: any) => ({
          id: vehicle.id,
          title: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
          price: Math.round((Number(vehicle.dailyRate) || 0) * 3).toString(),
          days: 3,
          rating: vehicle.rating != null ? Number(vehicle.rating).toFixed(2) : '4.9',
          trips: vehicle.totalBookings ?? 0,
          location: `${vehicle.city || ''}, ${vehicle.state || ''}`.trim() || '—',
          dailyRate: vehicle.dailyRate,
          imageSrc: getFeaturedCarImageSrc(vehicle),
          fuelType: vehicle.fuelType,
        }));

        setFeaturedCars(formattedCars);
      } catch (error) {
        console.error('Error loading featured cars:', error);
        setFeaturedCars([]);
        setCarsLoadError(true);
      } finally {
        if (!cancelled) {
          setLoadingCars(false);
        }
      }
    };

    loadFeaturedCars();
    return () => {
      cancelled = true;
    };
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
            <HeroEyebrow>
              <Star size={14} />
              Experiência premium para alugar e anunciar
            </HeroEyebrow>
            <HeroTitle>Mobilidade com visual moderno e reserva sem atrito</HeroTitle>
            <HeroSubtitle>
              Descubra carros perto de você, reserve em minutos e acompanhe toda a jornada em uma experiência mais elegante, confiável e clara.
            </HeroSubtitle>
            <HeroHighlights>
              <HeroHighlight>
                <Check size={16} />
                Reserva 100% online
              </HeroHighlight>
              <HeroHighlight>
                <Location size={16} />
                Retirada flexível
              </HeroHighlight>
              <HeroHighlight>
                <Shield size={16} />
                Proteção e suporte 24/7
              </HeroHighlight>
            </HeroHighlights>
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
                backgroundColor: 'rgba(255, 241, 242, 0.94)', 
                padding: '0.75rem 1rem', 
                borderRadius: '0 0 28px 28px',
                fontSize: '0.9rem',
                textAlign: 'center',
                borderTop: '1px solid rgba(248, 113, 113, 0.18)'
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
                background: 'linear-gradient(135deg, #F6885C 0%, #D95128 100%)',
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
                background: 'linear-gradient(135deg, #F6885C 0%, #D95128 100%)',
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
                  {car.imageSrc ? (
                    <img src={car.imageSrc} alt={car.title} loading="lazy" />
                  ) : car.fuelType === 'eletrico' ? (
                    <Electric size={48} />
                  ) : (
                    <Car size={48} />
                  )}
                </CarImage>
                <CarInfo>
                  <CarTitle>{car.title}</CarTitle>
                  <CarRatingRow>
                    <CarRating>
                      <Star size={16} color="#ea580c" />
                      {car.rating}
                    </CarRating>
                    <CarTrips>({car.trips} viagens)</CarTrips>
                  </CarRatingRow>
                  <CarPriceRow>
                    <CarPrice>R$ {car.price} por {car.days} dias</CarPrice>
                  </CarPriceRow>
                </CarInfo>
              </CarCard>
            ))}
          </CarsScrollContainer>
        )}
      </FeaturedSection>

      {!isLoggedIn && (
        <>
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
        </>
      )}

      {/* CTA Section */}
      <CTASection>
        <SectionTitle style={{ color: 'white', marginBottom: '2rem' }}>
          Pronto para começar?
        </SectionTitle>
        <SectionSubtitle style={{ color: 'white', marginBottom: '3rem' }}>
          Junte-se a milhares de clientes satisfeitos em todo o Brasil
        </SectionSubtitle>
        <CTAButtons>
          {canShowFindCarCta && (
            <CTAButton onClick={() => navigate('/vehicles')}>
              Encontrar um Carro
            </CTAButton>
          )}
          {canShowListCarCta && (
            <CTAButton $secondary onClick={() => navigate('/register')}>
              Anunciar Seu Carro
            </CTAButton>
          )}
        </CTAButtons>
      </CTASection>
    </>
  );
};

export default HomePage;