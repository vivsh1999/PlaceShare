const express =require('express');

const router=express.Router();

router.get('/',(req,res,next)=>{
    console.log('Main Page');
    res.json({message:'Route at home page!'});
});

module.exports = router;