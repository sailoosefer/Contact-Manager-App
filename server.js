const express=require('express');

const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const bodyParser=require('body-parser');
const res = require('express/lib/response');


var emailSignedIn=0;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
  }));
mongoose.connect("mongodb://localhost:27017/contactUserDB", {useNewUrlParser: true},{ useUnifiedTopology: true } );
app.set('view engine', 'ejs');

mongoose.set("useCreateIndex",true)

const contactSchema=new mongoose.Schema({
    name:String,
    phno:Number,
    email:String
})

const userSchema=new mongoose.Schema({
    email:String,
    password:String,
    secret:String,
    contactList:{
        type:[]
    }

})
const User= mongoose.model("User",userSchema);

const newContact=mongoose.model("ContactsList",contactSchema)
app.get('/', (req,res)=>{
   res.render('signin',{flag:0})
})

app.get('/signup', (req,res)=>{
    res.render('signup',{flag:0})
})
app.post('/saveContact', (req,res)=>{
   
    const newContactPerson= {


        name:req.body.Name,
        phno:req.body.phno,
        email:req.body.email
    }


    

    User.findOne({email:emailSignedIn},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
             if(foundUser){
                 let flag=1;
                 for(let i=0;i<foundUser.contactList.length;i++){
                     if(foundUser.contactList[i].name===newContactPerson.name){
                         flag=0;
                     }

                 }
                 if(flag){
                     
                 foundUser.contactList.push(newContactPerson);
                 foundUser.save();


                 }
                  
                 res.render("contacts",{contactLists:foundUser.contactList});
             }
        }
    })


})

app.post('/signup',(req,res)=>{

    const newUser = new User({
        email:req.body.email,
        password:req.body.password,
        secret:req.body.secret,
        contactList:[],

    })


    emailSignedIn=req.body.email;
    User.findOne({email:emailSignedIn},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else if(foundUser){
                console.log("user found")
                   res.render("signup",{flag:1});
             }
             else{
                 console.log("user not found")
                newUser.save((err)=>{
                    if(err){
                        console.log(arr);
                    }
                    else{
            
                        res.render("contacts",{contactLists:[]})
                    }
                })
        
            }
        
    })
    

    
  


})
app.get("/contacts", (req, res
    )=>{
        res.render("signup",{flag:0});
    })
app.post("/signin",(req,res)=>{
       

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email, password: password},(err, foundUser)=>{

        if(err){
            console.log(err);

        }
        else{
            if(foundUser){
                res.render("contacts",{contactLists:foundUser.contactList})
            }
            else{
                res.redirect("/");
            }
        }

    })
})



app.listen(3000,()=>{
    console.log('listening on port 3000');
})