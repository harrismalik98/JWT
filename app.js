require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const posts = [
    {
        username:"Muhammad Harris",
        title:"Post 1"
    },
    {
        username:"Muhammad Ali",
        title:"Post 2"
    }
]

app.get("/posts", authenticateToken ,(req,res)=>{
    res.json(posts.filter(post => post.username === req.user.name));
});

app.post("/login", (req , res)=>{

    const username =  req.body.username;
    const user = { name:username };

    // jwt.sign() is a function used to generate a JSON Web Token (JWT) in Node.js.
    // The jwt.sign() function takes in a payload (which is the data you want to transmit), a secret key, and some optional settings, and generates a unique token that includes the payload and a digital signature that verifies that the token hasn't been tampered with.
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.json({accessToken: accessToken});

});

function authenticateToken(req,res,next){

    // To get token we need headers(Token come from headers). we need "authorization" header that has format "Bearer Token"
    const authHeader = req.headers["authorization"];

    // Spliting on space because "Bearer Token" ==> 0=Bearer 1=TOKEN
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null) return res.sendStatus(401); //401: Unauthorized

    // jwt.verify() is a function used to verify a JSON Web Token (JWT) in Node.js.
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err) return res.sendStatus(403)  // Froebidden: Mean have a token but token is no longer valid and has no access. You are not authorized to access this resource, even if you provide valid credentials.
        req.user = user;
        next();
    })

};

app.listen(3000, () => {
    console.log("Server running at port 3000");
});

// Youtube Video: https://www.youtube.com/watch?v=mbsmsi7l3r4