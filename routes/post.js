const express= require('express')
const router=express.Router()
const requiredLogin=require('../middleware/requiredLogin')
const mongoose=require('mongoose')
const Post=mongoose.model('Post')

const User=mongoose.model('User')

router.get('/allpost', requiredLogin,(request,response)=>{
    Post.find().populate('postedBy',"_id name email")
    .populate('comments.postedBy',"_id name") .then(posts=>{
        response.json({successMessage:posts, posts:posts})
    }).catch(err=>{
        response.json({errMsg:err})
    })

})


router.get('/allfollowingpost', requiredLogin,(request,response)=>{
    Post.find({postedBy:{$in:request.user.following}}).populate('postedBy',"_id name email")
    .populate('comments.postedBy',"_id name") .then(posts=>{
        response.json({successMessage:posts, posts:posts})
    }).catch(err=>{
        response.json({errMsg:err})
    })

})

router.post('/createpost',requiredLogin,(request,response)=>{
    const{title,body,photo}= request.body
    console.log(request.body);
    if(!title){
        return response.status(422).json({errorMessage:"Please add title "})
    } 
    
    if(!body){
        return response.status(422).json({errorMessage:"Please add body "})
    }

    if(title && body){
        console.log(request.user);
       // response.send('post created')

      const post=new Post({
        title,
        body,
        photo,
        postedBy:request.user
       })

       post.save().then(result=>{
           response.json({sucessMessage:result})
       }).catch(err=>{
        response.json({errMessage:result})
       })
    }
})

router.get('/mypost',requiredLogin,(request,response)=>{
   //response.json(request.user._id)
   Post.find({postedBy:request.user._id}).populate("postedBy","_id name email").then(mypost=>{
    console.log(mypost);
    
    response.json(mypost)
   })
})

router.put('/like',requiredLogin,(request,response)=>{
    console.log( request.body.postId);
    Post.findByIdAndUpdate(request.body.postId,
        {
            $push:{likes:request.user._id}
        },
        {
            new:true
        }).exec((err,result)=>{
            if(err){
                return response.status(422).json({errorMessage:err})
            }else{
                response.json({successMessage:result})
            }
        })
})




router.put('/unlike',requiredLogin,(request,response)=>{
    console.log( request.body.postId);
    Post.findByIdAndUpdate(request.body.postId,
        {
            $pull:{likes:request.user._id}
        },
        {
            new:true
        }).exec((err,result)=>{
            if(err){
                return response.status(422).json({errorMessage:err})
            }else{
                response.json({successMessage:result})
            }
        })
})

router.put('/comment',requiredLogin,(request,response)=>{
    console.log( request.body.text);
    console.log( request.user._id);
    console.log(request.body.postId);

    const comment={
        text:request.body.text,
        postedBy:request.user._id
    }

    Post.findByIdAndUpdate(request.body.postId,
        {
            $push:{comments:comment}
        },
        {
            new:true
        }).populate("comments.postedBy","_id name")
        
        .exec((err,result)=>{
            if(err){
                return response.status(422).json({errorMessage:err})
            }else{
                response.json({successMessage:result})
            }
        })
})


router.delete('/deletepost/:postId',requiredLogin,(request,response)=>{

    console.log(request.params.postId);
    Post.findOne({_id:request.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return response.status(422).json({errorMessage:err})
        }
        else{
            if(post.postedBy._id.toString()===request.user._id.toString()){
                post.remove().then(result=>{
                    response.json(result)
                }).catch(err=>{
                    console.log(err);
                })
        }
        }
    })
})


module.exports=router