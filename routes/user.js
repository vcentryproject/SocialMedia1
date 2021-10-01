const express= require('express')
const router=express.Router()
const requiredLogin=require('../middleware/requiredLogin')
const mongoose=require('mongoose')
const Post=mongoose.model('Post')
const User=mongoose.model('User')

router.get('/user/:id',requiredLogin,(request,response)=>{
User.findOne({_id:request.params.id})
.select('-password')
.then(user=>{
    Post.find({postedBy:request.params.id})
    .populate("postedBy",'_id name')
    .exec((err,posts)=>{
        if(err){
            return response.status(422).json({errorMessage:err})
        }else{
        response.json({user,posts})
    }
    }).catch(err=>{
        return response.status(404).json({errorMessage:"User Not found"})
    })
})
})

router.put('/follow',requiredLogin,(request,response)=>{
    console.log(request.body.followId);
    User.findByIdAndUpdate(request.body.followId,{
        $push:{followers:request.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return response.status(422).json({errorMessage:err})
        }
        User.findByIdAndUpdate(request.user._id,{
            $push:{following:request.body.followId}
        },{
            new:true
        }).select("-password").then(result=>{
            response.json({result})
        }).catch(err=>{
            return response.status(422).json({errorMessage:err})
        })
    }
    
    )

})




router.put('/unfollow',requiredLogin,(request,response)=>{
    console.log("unfolow id -",request.body.unfollowId);
    User.findByIdAndUpdate(request.body.unfollowId,{
        $pull:{followers:request.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return response.status(422).json({errorMessage:err})
        }
        User.findByIdAndUpdate(request.user._id,{
            $pull:{following:request.body.unfollowId}
        },{
            new:true
        }).select('-password').then(result=>{
            response.json({result})
        }).catch(err=>{
            return response.status(422).json({errorMessage:err})
        })
    }
    
    )

})




router.put('/updatepic',requiredLogin,(request,response)=>{
    console.log(request.body.image);
    User.findByIdAndUpdate(request.user._id,{
        $set:{image:request.body.image}
    },{
        new:true
    }
    
    ).exec((err,result)=>{
        if(err){
            return response.status(422).json({errorMessage:err})
        }else{
            response.json({successMessage:result})
        }
    })
})


module.exports=router