import {UserContext} from '../../App'
import axios from 'axios'
import React, { useEffect, useState,useContext } from 'react'

import {useParams} from 'react-router-dom'
export default function UserProfile() {
    const [showFollow,setShowFollow]=useState(true)
    const [post,setPosts] =useState([])
    const [user,setUser] =useState()
    
    const {state,dispatch}=useContext(UserContext)
    const {id} =useParams()

    console.log(id);
    useEffect(()=>{
       
        axios.get('/user/'+id,{
            headers:{
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        }).then(result=>{
            console.log('.....>',result);
             setPosts(result.data.posts)
             setUser(result.data.user)
             
           
        })
    },[])


    const followUser=()=>{
        //console.log(user,'----');
        axios.put('/follow/',{followId:id},{
            headers:{
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        }).then(result=>{
            console.log(result);
            dispatch({type:"UPDATE",payload:{following:result.data.following, followers:result.data.followers}})
            localStorage.setItem('user',JSON.stringify(result.data))
       
            setUser((prevState)=>{
                console.log('------------------------------------------------------');
                console.log('*************',prevState);
                return{
                    ...prevState,
                    user:{
                        ...prevState,
                        followers:[...prevState.followers,result.data._id]
                    }
                }
            })
            setShowFollow(false)

        })
    }

    const unfollowUser=()=>{
        console.log(user,'----');
        axios.put('/unfollow/',{unfollowId:id},{
            headers:{
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        }).then(result=>{
            console.log(result);
            dispatch({type:"UPDATE",payload:{following:result.data.following, followers:result.data.followers}})
            localStorage.setItem('user',JSON.stringify(result.data))
       
            setUser((prevState)=>{

                const newfollower=prevState.followers.filter(item=>item!=result.data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState,
                        followers:newfollower
                    }
                }
            })
            setShowFollow(true)
        })
    }
    return (
        
        <>
        {user?
        <div style={{maxWidth:"500px", margin:"0px auto"}}>
          
        <div style={{display:"flex",justifyContent:"space-between",margin:"20px 0px",borderBottom:"1px solid gray"}}>
            <div>

              <img style={{width:"180px", height:"180px", borderRadius:"100px"}} src={user.image}></img>

            </div>
            <div >
                  <h4>{user.name}</h4>
                  <span>{user.email}</span>
                  <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                      <h6>{post.length} posts </h6>
                      <h6>{user.followers.length} followers</h6>
                      <h6>{user.following.length} following</h6>
                  </div>
                  {
                      showFollow?
                      <button className="waves-effect waves-light btn" onClick={()=>followUser()}>Follow</button>
:
<button style={{margin:"5px"}} className="waves-effect waves-light btn" onClick={()=>unfollowUser()}>UnFollow</button>

                  }


            </div>

        </div>
      
        <div className="gallary">

        {
            post.map(item=>{
             return <img key={item._id} className="photos" src={item.photo} alt={item.title}></img>

            })
        }
                      </div>  
      </div>
      
    :
    
    <h1>Loading...</h1>
    }
        </>
    )
}
