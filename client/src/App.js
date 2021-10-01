
import './App.css';
import NavBar from './componets/NavBar'
import {BrowserRouter,Switch,Route, useHistory} from 'react-router-dom'
import React, { useEffect, createContext, useReducer, useContext, useState} from 'react'
import Login from './componets/screens/Login'
import Profile from './componets/screens/Profile'
import Singup from './componets/screens/Singup';
import Home from './componets/screens/Home';
import CreatePost from './componets/screens/CreatePost'
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './componets/screens/UserProfile';
import FollowingUserPost from './componets/screens/FollowingUserPost';
export const UserContext= createContext()

const Routing=()=>{
  const history=useHistory()
  const {state,dispatch}=  useContext(UserContext)
  
  
  useEffect(()=>{
    console.log("use effect");
    const user= JSON.parse( localStorage.getItem('user'))
    
   
    if(user){
     dispatch({type:"USER",payload:user})
      console.log("yes logged in");
     // history.push('/home')
      
    }else{
      console.log('no login info');
      history.push('/login')
      
    }
  
    
  },[])
  return(
    <Switch>

      
<Route exact path="/profile/:id">
      <UserProfile/>
    </Route>

     
<Route exact path="/allfollowingpost">
      <FollowingUserPost/>
    </Route>

    
    
    <Route path="/login">
    <Login/>
    </Route>

    <Route path="/signup">
    <Singup/>
    </Route>

    <Route path="/profile">
    <Profile/>
    </Route>
    <Route path="/createpost">
      <CreatePost />
    </Route>

   <Route path="/home">
      <Home />
    </Route>

    



    </Switch>
  )
}

function App() {

  const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <div className="App">

<UserContext.Provider value={{state,dispatch}}>

      <BrowserRouter>
      <NavBar/>
      
      <Routing></Routing>
      </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
