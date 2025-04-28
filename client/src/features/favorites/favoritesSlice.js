import { createSlice } from '@reduxjs/toolkit';

// Initialize favorites from localStorage
const loadFavorites = () => {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Failed to load favorites from localStorage', error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavorites = (favorites) => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to localStorage', error);
  }
};

const initialState = {
  favorites: loadFavorites(),
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.favorites.some(id => id === action.payload)) {
        state.favorites.push(action.payload);
        saveFavorites(state.favorites);
      }
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
      saveFavorites(state.favorites);
    },
    clearFavorites: (state) => {
      state.favorites = [];
      saveFavorites(state.favorites);
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.favorites;

export default favoritesSlice.reducer; 