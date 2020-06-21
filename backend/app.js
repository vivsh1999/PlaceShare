const express=require('express');
const bodyParser=require('body-parser');

const placesRoutes = require('./Routes/places-routes');
const userRoutes=require('./Routes/users-routes');

const HttpError=require('./models/http-error');

const mongoose=require('mongoose');

const app=express();

app.use(bodyParser.json());

app.use('/api/places',placesRoutes);

app.use('/api/users',userRoutes);

app.use((req,res,next)=>{
    throw new HttpError('Connot find specified route.',404);
});

app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message:error.message || "An Error Occured!"});

});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://vivek:K077oFTfuUydyGLJ@cluster0-elmjk.mongodb.net/place_share?retryWrites=true&w=majority").then(
    ()=>{
        app.listen(5000);
        console.log("connected");
    }
).catch((err)=>{
    console.log(err);
})

