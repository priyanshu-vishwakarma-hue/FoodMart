import { configureStore } from "@reduxjs/toolkit";
import toggleSlice from "./toggleSlice"
import cartSlice from "./cartSlice"
import diffRest from "./diffRest"
import filterSlice from "./filterSlice"
import authSlice from "./authSlice"
import restSlice from "./restSlice"

const store=configureStore({
    reducer:{
        toggleSlice : toggleSlice,
        cartSlice : cartSlice,
        diffRest : diffRest,
        filterSlice:filterSlice,
        authSlice :authSlice ,
        restSlice :restSlice,
    }
})

export default store;