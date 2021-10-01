import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'

export default function Profile() {
    const [image, setImage] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [url, setUrl]=useState([])
    useEffect(() => {

        axios.get('/mypost', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        }).then(result => {
            console.log(result.data);
            setImage(result.data)
            console.log('----', state);

        }).catch(err => {

        })
    }, [])

   const updatePhoto= async (e)=>{
    const data = new FormData()
    data.append('file',e.target.files[0])
    data.append('upload_preset', 'socialmedia')
    data.append('cloud_name', 'reactvcentry2')
    let resultdata = await axios.post('https://api.cloudinary.com/v1_1/reactvcentry2/image/upload', data)
    .then(result=>{
            console.log('----->result',result.data.url);
        setUrl(url.push(result.data.url))
        axios.put('/updatepic', {image: url[0] },
                
                {
                    headers:{
                        "Authorization": `Bearer ${localStorage.getItem('jwt')}`
                    }
                })
    }).then(result=>{
        console.log('then result ->',result);
    }).catch(err=>{
        console.log('catch error - > ',err);
    })
   }

    
    return (
        <div style={{ maxWidth: "500px", margin: "0px auto" }}>

            <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0px", borderBottom: "1px solid gray" }}>
                <div>

                    <img style={{ width: "180px", height: "180px", borderRadius: "100px" }} src={state?state.image:"loading..."}></img>
                
                    <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Photo</span>
                    <input name="image" type="file" onChange={updatePhoto} />
                </div>
                
                <br></br>
            </div>
                </div>
                <div >
                    <h4>{state.name}</h4>
                    <span>{state.email}</span>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <h6>{image.length} posts </h6>
                        <h6>10 followers</h6>
                        <h6>10 following</h6>
                    </div>
                   
                </div>
         
            </div>
             
            <div className="gallary">

                {
                    image.map(item => {
                        return <img className="photos" src={item.photo} alt={item.title}></img>

                    })
                }
            </div>
        </div>
    )
}
