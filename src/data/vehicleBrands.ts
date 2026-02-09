/**
 * Marcas e modelos de veículos (referência Brasil).
 * Marca → lista de modelos.
 */
export const vehicleBrandsModels: Record<string, string[]> = {
  Chevrolet: ['Onix', 'Onix Plus', 'Tracker', 'Trailblazer', 'S10', 'Spin', 'Prisma', 'Cruze', 'Camaro', 'Equinox', 'Montana'],
  Fiat: ['Uno', 'Argo', 'Cronos', 'Mobi', 'Toro', 'Strada', 'Pulse', 'Fastback', 'Doblo', 'Fiorino', 'Ducato'],
  Volkswagen: ['Gol', 'Polo', 'Virtus', 'T-Cross', 'Nivus', 'Taos', 'Tiguan', 'Amarok', 'Saveiro', 'Jetta', 'Up', 'Fox', 'Voyage'],
  Ford: ['Ka', 'Ka Sedan', 'EcoSport', 'Puma', 'Ranger', 'Maverick', 'Territory', 'Focus', 'Fusion'],
  Toyota: ['Corolla', 'Hilux', 'Yaris', 'Yaris Sedan', 'SW4', 'RAV4', 'Corolla Cross', 'Etios', 'Camry', 'Land Cruiser'],
  Honda: ['Civic', 'City', 'HR-V', 'WR-V', 'Fit', 'CR-V', 'Accord', 'HR-V'],
  Hyundai: ['HB20', 'HB20S', 'Creta', 'Tucson', 'Santa Fe', 'ix35', 'Azera', 'Elantra', 'Porter'],
  Nissan: ['Kicks', 'Versa', 'Sentra', 'March', 'Frontier', 'Leaf', 'GT-R', 'X-Trail'],
  Renault: ['Kwid', 'Sandero', 'Logan', 'Duster', 'Captur', 'Oroch', 'Megane', 'Clio', 'Fluence'],
  Jeep: ['Compass', 'Renegade', 'Commander', 'Grand Cherokee', 'Wrangler'],
  'Caoa Chery': ['Tiggo 3', 'Tiggo 5', 'Tiggo 7', 'Tiggo 8', 'Arrizo 5', 'Arrizo 6'],
  Peugeot: ['208', '2008', '308', '3008', '5008', 'Partner', 'Expert'],
  'Citroën': ['C3', 'C4 Cactus', 'Aircross', 'C4 Lounge', 'Berlingo', 'Jumpy'],
  Mitsubishi: ['L200', 'Outlander', 'Pajero Sport', 'ASX', 'Eclipse Cross'],
  Kia: ['Cerato', 'Sportage', 'Sorento', 'Seltos', 'Stonic', 'Picanto', 'Carnival'],
  BMW: ['Série 1', 'Série 3', 'Série 5', 'X1', 'X3', 'X5', 'X6', 'Z4'],
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'Q8'],
  'Mercedes-Benz': ['Classe A', 'Classe C', 'Classe E', 'GLA', 'GLC', 'GLE', 'GLS'],
  Volvo: ['XC40', 'XC60', 'XC90', 'S60', 'V60'],
  JAC: ['J3', 'J5', 'J6', 'T40', 'T50', 'T60'],
  BYD: ['Dolphin', 'Yuan', 'Song', 'Tang', 'Han', 'Seal'],
  GWM: ['Haval H6', 'Haval H6 GT', 'Poer', 'Pao'],
};

/** Lista ordenada de marcas (para o select). */
export const vehicleBrands = Object.keys(vehicleBrandsModels).sort();

/** Retorna os modelos de uma marca, ou array vazio. */
export function getModelsByBrand(brand: string): string[] {
  if (!brand) return [];
  return vehicleBrandsModels[brand] ?? [];
}
