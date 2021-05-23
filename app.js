let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let firebase = require('firebase');
let dotenv = require('dotenv').config();
const multer = require('multer');
var fs = require('fs')


let app = express();

let firebaseConfig = {
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

// const bucket = firebase.bucket()
var storage = firebase.storage()


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./')));

app.get('/', function(req,res){
    console.log('GET signin');
    res.sendFile(path.join(__dirname, './templates/signin.html'));
});

app.get("/signin", function(req,res){
    console.log("GET signin");
    res.sendFile(path.join(__dirname,'./templates/signin.html'))
});
app.get("/about", function(req,res){
    console.log("GET about");
    res.sendFile(path.join(__dirname,'./templates/about.html'))
});
app.get("/wearable", function(req,res){
    console.log("GET wearable");
    res.sendFile(path.join(__dirname,'./templates/wearable.html'))
});
app.get("/food", function(req,res){
    console.log("GET food");
    res.sendFile(path.join(__dirname,'./templates/food.html'))
});
app.get("/blogs", function(req,res){
    console.log("GET blogs");
    res.sendFile(path.join(__dirname,'./templates/blog.html'))
});
app.get("/upload", function(req,res){
    console.log("GET upload");
    res.sendFile(path.join(__dirname,'./templates/upload.html'))
});
app.get("/favourites", function(req,res){
    console.log("GET favourites");
    res.sendFile(path.join(__dirname,'./templates/fav.html'))
});
app.get('/signout', function(req,res){
    console.log('GET signout');
    res.sendFile(path.join(__dirname, './templates/signin.html'));
});
app.get("/signup", function(req,res){
    console.log("GET signup");
    res.sendFile(path.join(__dirname,'./templates/signup.html'))
});
app.post("/signup", function(req, res){
    console.log("POST signup");
    if(req.body.password != req.body.cpassword){
        res.send("password and confirm password do not match")
        // res.sendFile(path.join(__dirname,'../signup.html'))
    }
    else{
        firebase.database().ref(req.body.username).once('value')
            .then(function(snapshot) {
                console.log(snapshot.val());
                if(snapshot.val() == null){
                    let data = {name, username, email, password, cpassword} = req.body
                    firebase.database().ref(req.body.username).set({name, username, email, password, cpassword});
                    res.sendFile(path.join(__dirname,'./templates/signin.html'))}

                if(snapshot.val() != null){
                    res.send("Username unavailable")
                }
            })
    }
});

app.post("/signin", function(req,res){
    console.log("POST signin");
    firebase.database().ref(req.body.username).once('value')
        .then(function(snapshot){
            console.log(snapshot.val());
            if(snapshot.val()==null){
                res.send("check username/password")
            }
            else if(snapshot.val().password != req.body.password){
                res.send("check username/password")
            }
            else if((snapshot.val().password == req.body.password) && (snapshot.val().username == req.body.username)){
                res.sendFile((path.join(__dirname,'./templates/about.html')))
            }
        })
});

const uploads = multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
  });

app.post('/upload-blog', uploads.single("fancy-file"), async (req, res) => {
    console.log('Upload Image');
    console.log(req.body)
    let file = req.file;
    if (file) {
        uploadImageToStorage(file).then((success) => {
        res.status(200).send({
                status: 'success'
            });
            }).catch((error) => {
                console.error(error);
        });
    }
  });
  
app.listen(3000,()=>{
    console.log('server at http://localhost:3000');
});


/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */
 const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No image file');
      }
      let newFileName = `${file.originalname}_${Date.now()}`;
  
      let fileUpload = storage.file(newFileName);
  
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });
  
      blobStream.on('error', (error) => {
        reject('Something is wrong! Unable to upload at the moment.');
      });
  
      blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = format(`https://storage.googleapis.com/${storage.name}/${fileUpload.name}`);
        resolve(url);
      });
  
      blobStream.end(file.buffer);
    });
  }