"use strict";

var express = require('express');

var path = require('path');

var bodyParser = require('body-parser');

var firebase = require('firebase');

var dotenv = require('dotenv').config();

var app = express();
var firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.measurementId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};
firebase.initializeApp(firebaseConfig);
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express["static"](path.join(__dirname, './')));
app.get('/', function (req, res) {
  console.log('GET signin');
  res.sendFile(path.join(__dirname, './templates/signin.html'));
});
app.get("/signin", function (req, res) {
  console.log("GET signin");
  res.sendFile(path.join(__dirname, './templates/signin.html'));
});
app.get("/about", function (req, res) {
  console.log("GET about");
  res.sendFile(path.join(__dirname, './templates/about.html'));
});
app.get("/wearable", function (req, res) {
  console.log("GET wearable");
  res.sendFile(path.join(__dirname, './templates/wearable.html'));
});
app.get("/food", function (req, res) {
  console.log("GET food");
  res.sendFile(path.join(__dirname, './templates/food.html'));
});
app.get("/blogs", function (req, res) {
  console.log("GET blogs");
  res.sendFile(path.join(__dirname, './templates/blog.html'));
});
app.get("/upload", function (req, res) {
  console.log("GET upload");
  res.sendFile(path.join(__dirname, './templates/upload.html'));
});
app.get("/favourites", function (req, res) {
  console.log("GET favourites");
  res.sendFile(path.join(__dirname, './templates/fav.html'));
});
app.get('/signout', function (req, res) {
  console.log('GET signout');
  res.sendFile(path.join(__dirname, './templates/signin.html'));
});
app.get("/signup", function (req, res) {
  console.log("GET signup");
  res.sendFile(path.join(__dirname, './templates/signup.html'));
});
app.post("/signup", function (req, res) {
  console.log("POST signup");

  if (req.body.password != req.body.cpassword) {
    res.send("password and confirm password do not match"); // res.sendFile(path.join(__dirname,'../signup.html'))
  } else {
    firebase.database().ref(req.body.username).once('value').then(function (snapshot) {
      console.log(snapshot.val());

      if (snapshot.val() == null) {
        var _req$body;

        var data = (_req$body = req.body, name = _req$body.name, username = _req$body.username, email = _req$body.email, password = _req$body.password, cpassword = _req$body.cpassword, _req$body);
        firebase.database().ref(req.body.username).set({
          name: name,
          username: username,
          email: email,
          password: password,
          cpassword: cpassword
        });
        res.sendFile(path.join(__dirname, './templates/signin.html'));
      }

      if (snapshot.val() != null) {
        res.send("Username unavailable");
      }
    });
  }
});
app.post("/signin", function (req, res) {
  console.log("POST signin");
  firebase.database().ref(req.body.username).once('value').then(function (snapshot) {
    console.log(snapshot.val());

    if (snapshot.val() == null) {
      res.send("check username/password");
    } else if (snapshot.val().password != req.body.password) {
      res.send("check username/password");
    } else if (snapshot.val().password == req.body.password && snapshot.val().username == req.body.username) {
      res.sendFile(path.join(__dirname, './templates/about.html'));
    }
  });
});
app.listen(3000, function () {
  console.log('server at http://localhost:3000');
});