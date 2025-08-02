import { createSlice } from "@reduxjs/toolkit";

const diffRest=createSlice({
    name:"diffRest",
    initialState:{
        addCartDiffRest: false,
    },
    reducers:{
        toggleRest: (state,action)=>{
            state.addCartDiffRest= action.payload
        }
    }
})

export const {toggleRest} =diffRest.actions;
export default diffRest.reducer;