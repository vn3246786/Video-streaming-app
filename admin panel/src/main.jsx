import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthContextProvider from './Contexts/AuthContext/AuthContext.jsx'
import MoviesContextProvider from './Contexts/MoviesContext/MoviesContext.jsx'
import ListsContextProvider from './Contexts/ListsContexts/ListsContext.jsx'
import UserContextProvider from './Contexts/UserContext/UserContext.jsx'
import AccessTokenContextProvider from './Contexts/AccessTokenContext/AccessTokenContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
<AccessTokenContextProvider>
<AuthContextProvider>
  <MoviesContextProvider>
    <ListsContextProvider>
      <UserContextProvider>

  <App />
      </UserContextProvider>
    </ListsContextProvider>
  </MoviesContextProvider>
</AuthContextProvider>
</AccessTokenContextProvider>
)
