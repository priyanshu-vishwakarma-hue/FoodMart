import { createSlice } from "@reduxjs/toolkit";

const restSlice=createSlice({
    name:"restSlice",
    initialState:{
        restInfo: JSON.parse(localStorage.getItem("restraunt")) ||  {},
    },
    reducers:{
        restChange: (state, action) => {
            const { info, element, link } = action.payload;
            const data = { info, element, link };
            state.restInfo = data;
            try {
                localStorage.setItem("restraunt", JSON.stringify(data));
            } catch (e) {
                console.error("Failed to save to localStorage", e);
            }
        },
    }
})


export const {restChange} = restSlice.actions;
export default restSlice.reducer