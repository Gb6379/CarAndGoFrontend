// Utility functions for managing favorites in localStorage

export const getFavorites = (): string[] => {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = (vehicleId: string): void => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(vehicleId)) {
      favorites.push(vehicleId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

export const removeFavorite = (vehicleId: string): void => {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter((id: string) => id !== vehicleId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

export const isFavorite = (vehicleId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(vehicleId);
};

export const toggleFavorite = (vehicleId: string): boolean => {
  const isFav = isFavorite(vehicleId);
  if (isFav) {
    removeFavorite(vehicleId);
    return false;
  } else {
    addFavorite(vehicleId);
    return true;
  }
};

