import { createSlice } from "@reduxjs/toolkit";

const cartSlice=createSlice({
    name:"cartSlice",
    initialState:{
        cartItem:JSON.parse(localStorage.getItem("cartData")) || [],
        restInfo:JSON.parse(localStorage.getItem("restInfo")) || [],
    },
    reducers:{
        addToCart: (state,action) =>{
            // setCartData((prev)=>[...prev,{value}]);
            const {value,restInfo} =action.payload
            state.cartItem = [...state.cartItem , {value}]
            state.restInfo=restInfo.id;
            localStorage.setItem("cartData", JSON.stringify(state.cartItem));
            localStorage.setItem("restInfo", JSON.stringify(restInfo.id))
        },
        deletItem: (state,action)=>{
            state.cartItem = action.payload
            localStorage.setItem("cartData",JSON.stringify(state.cartItem))
            if(state.cartItem.length===0){localStorage.removeItem("restInfo");
            }
        },
        clearCart: (state)=>{
            state.cartItem=[]
            state.restInfo=[]
            localStorage.removeItem("cartData");
            localStorage.removeItem("restInfo")
        }
    }
})

export const {addToCart,deletItem,clearCart}=cartSlice.actions;
export default cartSlice.reducer;