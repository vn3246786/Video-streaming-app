import React from 'react'
import "./app.scss"
import Home from "./Pages/Home/Home"
import { BrowserRouter as Router , Route, Routes, Navigate } from 'react-router-dom'
import Login from "./Pages/Login/Login"
import Register from "./Pages/Register/Register"
import SearchPage from "./Pages/SearchPage/SearchPage"
import { useContext } from 'react'
import {UserContext} from "./Contexts/UserContext/UserContext"
import {AccessTokenContext} from "./Contexts/AccessTokenContext/AccessTokenContext"
import GenrePage from './Pages/GenrePage/GenrePage'
import Video from './Pages/Video/Video'
import WatchListPage from './Pages/WatchListPage/WatchListPage'
import Test from './Pages/Test'
import CheckoutForm from './Pages/CheckoutForm/CheckoutForm'
import ReturnPage from './Pages/ReturnPage/ReturnPage'
import UpdateSubscription from './Pages/UpdateSubscription/UpdateSubscription'
import Profile from './Pages/Profile/Profile'
import Subscription from './Pages/Subscription/Subscription'
import OtpPage from './Pages/OtpPage/OtpPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ChangePassword from './Pages/ChangePassword/ChangePassword'
import MovieDetails from './Pages/MovieDetails/MovieDetails'



const App = () => {
const {User} = useContext(UserContext)

  return (
    <div className='app'>
      <ToastContainer/>
      <Router>
      <Routes>
      <Route  path='/' element = {User ? <Home/> : <Navigate to={'/Login'}/>} />
      <Route path='/Login' element = {User ? <Navigate to={'/'}/> :<Login/>}/> 
      <Route path='/otp' element = {<OtpPage/>}/> 
       <Route path='/Register' element = {User? <Navigate to={'/subscription'}/>:<Register/>} /> 
      <Route path='/SearchPage' element = {<SearchPage/>}/>
      <Route path='/play' element = {<Video/>}/>
      <Route path='/Genre' element = {<GenrePage/>}/>
      <Route path='/watchlist' element = {<WatchListPage/>}/>
      <Route path='/test' element = {<Test/>}/>
      <Route path='/profile' element = {<Profile/>}/>
      <Route path='/Updatesubscription' element = {<UpdateSubscription/>}/>
      <Route path='/subscription' element = {<Subscription/>}/>
      <Route path="/checkout" element={<CheckoutForm />} />
      <Route path="/return" element={<ReturnPage />} />
      <Route path="/changepassword" element={<ChangePassword/>} />
      <Route path="/movieDetails" element={<MovieDetails/>} />
      </Routes>
      </Router>
    </div>
  )
}

export default App
