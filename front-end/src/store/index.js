import {configureStore} from "@reduxjs/toolkit";
import {birdSlice} from "./birdSlice";
import authSlice from "./authSlice";


const index = configureStore({
    reducer: {
        birdSlice: birdSlice.reducer,
        authSlice: authSlice.reducer
    }
})

export default index;