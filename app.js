let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let firebase = require('firebase');
let dotenv = require('dotenv').config();
const multer = require('multer');
var fs = require('fs');

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
app.get("/user_uploads", function(req,res){
    console.log("GET user uploads");
    res.sendFile(path.join(__dirname,'./templates/User-Uploads.html'))
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
        firebase.database().ref("users/"+req.body.username).once('value')
            .then(function(snapshot) {
                console.log(snapshot.val());
                if(snapshot.val() == null){
                    let data = {name, username, email, password, cpassword} = req.body
                    firebase.database().ref("users/"+req.body.username).set({name, username, email, password, cpassword});
                    res.sendFile(path.join(__dirname,'./templates/signin.html'))}

                if(snapshot.val() != null){
                    res.send("Username unavailable")
                }
            })
    }
});

app.post("/signin", function(req,res){
    console.log("POST signin");
    firebase.database().ref("users/"+req.body.username).once('value')
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


const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

  const uploads = multer({
    dest: "./uploads"
  });


  app.post(
    "/upload-img",
    uploads.single("img"),
    (req, res) => {
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "./uploads/"+req.file.originalname);
      var ext = path.extname(req.file.originalname).toLowerCase()
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);

          res
            .status(200)
            .contentType("text/plain")
            .end("File uploaded!");
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);

          res
            .status(403)
            .contentType("text/plain")
            .end("check file type!");
        });
      }
    }
  );
app.post('/upload-blog', function(req, res){
    var blog = JSON.parse(JSON.stringify(req.body));
    if(blog['file']==''){
        res.send("no img uploaded");
        return
    }
    firebase.database().ref("blogs/"+blog['text']).set(blog);
    res.sendFile(path.join(__dirname,'./templates/User-Uploads.html'));
    // console.log(blog);
});

app.get('/user-blogs', function(req, res){
    firebase.database().ref("blogs/").once('value')
        .then(function(snapshot){
            var blogs = snapshot.val();
            // res.sendFile(path.join(__dirname,'./templates/upload.html'))
            res.json(blogs);
            // console.log(blogs);
        })
});

app.listen(3000,()=>{
    console.log('server at http://localhost:3000');
});