import { combineReducers, configureStore } from '@reduxjs/toolkit'
import studentReducer from './slices/slice'
import loadingReducer from './slices/loaderSlice'


const rootReducer = combineReducers({ students: studentReducer, loading: loadingReducer })

export const store = configureStore({
    reducer: rootReducer
})