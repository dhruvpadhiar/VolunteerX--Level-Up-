// redux/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showSmwaad: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowSmwaad: (state, action) => {
      state.showSmwaad = action.payload;
    },
  },
});

export const { setShowSmwaad } = uiSlice.actions;
export default uiSlice.reducer;
