import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowBack } from '@mui/icons-material';
import { Car, Star } from '../components/IconSystem';
import { reviewService, vehicleService } from '../services/authService';
import modernTheme from '../styles/modernTheme';
import { glassPanelCss, pageShellCss, titleCss } from '../styles/modernPrimitives';

const Container = styled.div`
  ${pageShellCss}
`;

const BackButton = styled.button`
  border: none;
  background: transparent;
  color: ${modernTheme.colors.brandStrong};
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.2rem;
`;

const Card = styled.section`
  ${glassPanelCss}
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Avatar = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 999px;
  background: ${modernTheme.gradients.brand};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
`;

const HostName = styled.h1`
  ${titleCss}
  margin: 0;
  font-size: 1.6rem;
`;

const Muted = styled.p`
  color: ${modernTheme.colors.muted};
  margin: 0.35rem 0 0;
`;

const Stats = styled.div`
  margin-top: 1.2rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 0.8rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 0.9rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${modernTheme.colors.ink};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${modernTheme.colors.muted};
`;

const SectionTitle = styled.h2`
  margin: 1.5rem 0 0.8rem;
  color: ${modernTheme.colors.ink};
`;

const VehicleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.8rem;
`;

const VehicleCard = styled.button`
  text-align: left;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  background: #fff;
  padding: 0.9rem;
  cursor: pointer;
`;

const VehicleTitle = styled.div`
  font-weight: 600;
  color: ${modernTheme.colors.ink};
  margin-bottom: 0.2rem;
`;

const VehicleMeta = styled.div`
  color: ${modernTheme.colors.muted};
  font-size: 0.9rem;
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ReviewItem = styled.div`
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 0.9rem;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Stars = styled.span`
  color: #ffa500;
`;

const Warning = styled.p`
  margin-top: 1rem;
  color: ${modernTheme.colors.muted};
`;

const toNumber = (value: unknown, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const getInitials = (firstName?: string, lastName?: string) =>
  `${(firstName || '').slice(0, 1)}${(lastName || '').slice(0, 1)}`.toUpperCase() || 'AN';

const HostPublicProfilePage: React.FC = () => {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hostVehicles, setHostVehicles] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);

  useEffect(() => {
    const loadHostProfile = async () => {
      if (!hostId) {
        setError('Anfitrião inválido.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const vehicles = await vehicleService.getAllVehicles();
        const hostCars = (Array.isArray(vehicles) ? vehicles : []).filter(
          (vehicle: any) => String(vehicle.ownerId || vehicle.owner?.id || '') === String(hostId)
        );

        setHostVehicles(hostCars);

        const reviewsPerVehicle = await Promise.all(
          hostCars.map(async (vehicle: any) => {
            try {
              const reviews = await reviewService.getVehicleReviews(String(vehicle.id));
              return Array.isArray(reviews)
                ? reviews.map((review: any) => ({ ...review, vehicleTitle: `${vehicle.make} ${vehicle.model}` }))
                : [];
            } catch {
              return [];
            }
          })
        );

        const mergedReviews = reviewsPerVehicle.flat().sort((a: any, b: any) => {
          const aTs = new Date(a.createdAt || 0).getTime();
          const bTs = new Date(b.createdAt || 0).getTime();
          return bTs - aTs;
        });

        setAllReviews(mergedReviews);
      } catch {
        setError('Não foi possível carregar o perfil público do anfitrião.');
      } finally {
        setLoading(false);
      }
    };

    loadHostProfile();
  }, [hostId]);

  const host = useMemo(() => hostVehicles[0]?.owner || null, [hostVehicles]);
  const availableCars = useMemo(
    () => hostVehicles.filter((vehicle: any) => vehicle.isActive !== false),
    [hostVehicles]
  );
  const totalRentals = useMemo(() => {
    if (host?.totalTrips !== undefined && host?.totalTrips !== null) {
      return toNumber(host.totalTrips, 0);
    }
    return hostVehicles.reduce((acc: number, vehicle: any) => acc + toNumber(vehicle.totalBookings, 0), 0);
  }, [host, hostVehicles]);
  const averageRating = useMemo(() => {
    if (host?.rating !== undefined && host?.rating !== null) {
      return toNumber(host.rating, 0);
    }
    if (!allReviews.length) return 0;
    const total = allReviews.reduce((acc: number, review: any) => acc + toNumber(review.rating, 0), 0);
    return total / allReviews.length;
  }, [host, allReviews]);

  if (loading) {
    return (
      <Container>
        <Card>Carregando perfil do anfitrião...</Card>
      </Container>
    );
  }

  if (error || !hostVehicles.length) {
    return (
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowBack fontSize="small" /> Voltar
        </BackButton>
        <Card>{error || 'Anfitrião não encontrado.'}</Card>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowBack fontSize="small" /> Voltar
      </BackButton>

      <Card>
        <Header>
          <Avatar>{getInitials(host?.firstName, host?.lastName)}</Avatar>
          <div>
            <HostName>{host?.firstName} {host?.lastName}</HostName>
            <Muted>Perfil público do anfitrião (contatos privados protegidos).</Muted>
          </div>
        </Header>

        <Stats>
          <StatItem>
            <StatValue>{averageRating.toFixed(1)} <Star size={14} /></StatValue>
            <StatLabel>Avaliação média</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{availableCars.length}</StatValue>
            <StatLabel>Carros disponíveis</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{totalRentals}</StatValue>
            <StatLabel>Locações realizadas</StatLabel>
          </StatItem>
        </Stats>

        <SectionTitle>Carros disponíveis</SectionTitle>
        <VehicleList>
          {availableCars.map((vehicle: any) => (
            <VehicleCard key={vehicle.id} onClick={() => navigate(`/vehicle/${vehicle.id}`)}>
              <VehicleTitle>{vehicle.make} {vehicle.model} {vehicle.year}</VehicleTitle>
              <VehicleMeta>
                <Car size={14} /> R$ {vehicle.dailyRate} por dia
              </VehicleMeta>
            </VehicleCard>
          ))}
        </VehicleList>

        <SectionTitle>Avaliações</SectionTitle>
        {allReviews.length ? (
          <ReviewsList>
            {allReviews.map((review: any) => (
              <ReviewItem key={review.id}>
                <ReviewHeader>
                  <strong>{review.user ? `${review.user.firstName} ${review.user.lastName}` : 'Usuário'}</strong>
                  <Stars>{'★'.repeat(toNumber(review.rating, 0))}</Stars>
                </ReviewHeader>
                {review.comment ? <Muted>{review.comment}</Muted> : null}
                <VehicleMeta>
                  {review.vehicleTitle} • {review.createdAt ? new Date(review.createdAt).toLocaleDateString('pt-BR') : 'Data indisponível'}
                </VehicleMeta>
              </ReviewItem>
            ))}
          </ReviewsList>
        ) : (
          <Warning>Este anfitrião ainda não possui avaliações públicas.</Warning>
        )}
      </Card>
    </Container>
  );
};

export default HostPublicProfilePage;
