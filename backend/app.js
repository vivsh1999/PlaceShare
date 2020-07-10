const fs = require('fs');
const path =require('path');

const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./Routes/places-routes");
const userRoutes = require("./Routes/users-routes");

const HttpError = require("./models/http-error");

const mongoose = require("mongoose");

const app = express();

//parsing all json data in body of request
app.use(bodyParser.json());


//static file serving
app.use('/uploads/images/',express.static(path.join('uploads','images')));
app.use(express.static(path.join('public')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

//main routes
app.use("/api/places", placesRoutes);

app.use("/api/users", userRoutes);

//frontend routes handling
app.use((req,res,next)=>{
  res.sendFile(path.resolve(__dirname,'public','index.html'));
})

//unhandled errors
app.use((req, res, next) => {
  throw new HttpError("Cannot find specified route.", 404);
});


//image file deletion if found file in request that failed
app.use((error, req, res, next) => {
  if (req.file){
    fs.unlink(req.file.path,(err)=>{
      console.log('error occurred')
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An Error Occurred!" });
});

//mongoose defaults
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-elmjk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
