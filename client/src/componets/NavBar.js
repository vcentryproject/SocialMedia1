
import React,{useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'

export default function NavBar() {

    const history=useHistory()

    const {state,dispatch}=  useContext(UserContext)

    const onSignout=()=>{
        localStorage.clear()
        dispatch({type:"CLEAR"})
        history.push('/login')
    }
    const renderList=()=>{
        if(state){
        return[
            <li><Link to="/createpost">Create Post</Link></li>,
            <li><Link to="/profile">Profile</Link></li>,
            <li><Link to="/allfollowingpost">Following User Post</Link></li>,
           <li ><Link onClick={()=>onSignout()}> Signout</Link></li>

        ]
    } else{
        return[
            <li><Link to="/login">Login</Link></li>,
            <li><Link to="/signup">Signup</Link></li>
        ]
    }
    }
    return (
      
            <nav>
                <div className="nav-wrapper">
                    <Link  to={ state ? "/home":"/login"} className="brand-logo">Vcentry technologies </Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                       
                       {renderList()}
                    </ul>
                </div>
            </nav>
     
    )
}
