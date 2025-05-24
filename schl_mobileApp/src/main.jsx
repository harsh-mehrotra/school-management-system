import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MainContainer from './components/containers/MainContainer.jsx'
import { store } from './Redux/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <MainContainer>
      <App />
    </MainContainer>
  </Provider>
  // </StrictMode>,
)
