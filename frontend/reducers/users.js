import { createSlice } from '@reduxjs/toolkit';

const initialState = {isConnected : false,token : "",user : "" , settings : {}};

export const userSlice = createSlice({
 name: 'user',
  initialState,
 reducers: {
    login :(state,action) => {
    state.isConnected =! state.isConnected ;
    state.user = action.payload.user ;
    },
   setSettings: (state, action) => {
    
     state.settings = action.payload;
   },
 },
});

export const { login, setSettings } = userSlice.actions;
export default userSlice.reducer;