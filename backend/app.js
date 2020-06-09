const express=require('express');
const bodyParser=require('body-parser');

const placesRoutes = require('./Routes/places-routes');
const userRoutes=require('./Routes/users-routes');

const HttpError=require('./models/http-error');

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

app.listen(5000);