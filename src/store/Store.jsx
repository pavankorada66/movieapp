import {configureStore} from "@reduxjs/toolkit"
import movieReducer from "./MovieSlice"

const Store=configureStore({
reducer:{
 movies:movieReducer
}
})
export default Store;