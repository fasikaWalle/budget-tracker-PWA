const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");


const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget";
const app = express();

const webpush=require('web-push');
app.use(require('body-parser').json());

const publicVapidKey='BIuAfUWTEuGR2EVFpq-ewJ4DZTve4VzPanG-annHUgdwMH3CAkb2X5H0ka96HbqaESJ2erYZegRTb8bQHZuC34I';
const privateVapidKey=process.env.PRIVATE_KEY ||'duevH6FWvoBSm1kZiLl9jZGTJ4jpmRXbBNuBz0XyrJw' ;
webpush.setVapidDetails('mailto:val@karpov.io', publicVapidKey, privateVapidKey);



app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
