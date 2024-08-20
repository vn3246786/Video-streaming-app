import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import UserContextProvider from './Contexts/UserContext/UserContext.jsx'
import WatchListContextProvider from './Contexts/WatchListContext/WatchListContext.jsx'
import AccessTokenContextProvider from './Contexts/AccessTokenContext/AccessTokenContext.jsx'
import axios from 'axios'

axios.defaults.withCredentials=true

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <AccessTokenContextProvider>
        <WatchListContextProvider>
    <App />
      </WatchListContextProvider>
  </AccessTokenContextProvider>
      </UserContextProvider>



)
