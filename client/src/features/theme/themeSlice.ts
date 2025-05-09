import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaletteMode } from '@mui/material';
import { RootState } from '../store';

interface ThemeState {
  mode: PaletteMode;
}

const initialState: ThemeState = {
  mode: 'dark',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setMode } = themeSlice.actions;

export const selectMode = (state: RootState) => state.theme.mode;

export default themeSlice.reducer;