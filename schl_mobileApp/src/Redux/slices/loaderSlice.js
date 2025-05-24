import { createSlice } from "@reduxjs/toolkit";

const initialState={
    loader:false
}


export const loaderSlice=createSlice({
    name:'loader',
    initialState,
    reducers:{
        setLoading:(state,action)=>{
            state.loader=action.payload
        }
    }
});

export const { setLoading } = loaderSlice.actions;
export default loaderSlice.reducer;