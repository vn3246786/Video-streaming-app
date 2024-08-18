import Home from "./Pages/Home/Home"
import "./app.scss"
import { BrowserRouter as Router , Routes, Route } from "react-router-dom"
import Users from "./Pages/Users/Users"
import Products from "./Pages/Products/Products"
import Lists from "./Pages/Lists/Lists"
import AddLists from "./Pages/Addlists/AddLists"
import AddProducts from "./Pages/AddProducts/AddProducts"
import Login from "./Pages/Login/Login"
import Register from "./Pages/Register/Register"
import { AuthContext } from "./Contexts/AuthContext/AuthContext"
import { useContext } from "react"
import UpdateProducts from "./Pages/UpdateProducts/UpdateProducts"
import UpdateLists from "./Pages/UpdateLists/UpdateLists"
import Plans from "./Pages/Plans/Plans"
import AddPlans from "./Pages/AddPlans/AddPlans"
import UpdatePlans from "./Pages/UpdatePlans/UpdatePlans"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Profile from "./Pages/Profile/Profile"
import ChangePassword from "./Pages/ChangePassword/ChangePassword"
import OtpPage from "./Pages/OtpPage/OtpPage"


function App() {

const {User}=useContext(AuthContext)

  return (
  <div className="app">
    <ToastContainer/>
 <Router>
      <Routes>
      <Route  path='/' element = {User?<Home/>:<Login/>}  />
      <Route  path='/Login' element = {User?<Home/>:<Login/>}  />
      <Route  path='/Register' element = {<Register/>}  />
      <Route path='/Users' element = {<Users/>}/> 
      <Route path='/Products' element = {<Products/>}/> 
      <Route path='/Lists' element = {<Lists/>}/> 
      <Route path='/lists/add' element = {<AddLists/>}/> 
      <Route path='/Plans' element = {<Plans/>}/> 
      <Route path='/Plans/add' element = {<AddPlans/>}/> 
      <Route path='/Plans/update' element = {<UpdatePlans/>}/> 
      <Route path='/Products/add' element = {<AddProducts/>}/> 
      <Route path='/Products/update' element = {<UpdateProducts/>}/> 
      <Route path='/lists/update' element = {<UpdateLists/>}/> 
      <Route path='/profile' element = {<Profile/>}/> 
      <Route path='/changepassword' element = {<ChangePassword/>}/> 
      <Route path='/otp' element = {<OtpPage/>}/> 
      </Routes>
      </Router>
  </div>
  )
}


export default App
