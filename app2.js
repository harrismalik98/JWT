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

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken: accessToken});

});

function authenticateToken(req,res,next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //0=Bearer 1=TOKEN

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        if(err) return res.sendStatus(403) // Mean have a token but token is no longer valid and has no access.
        req.user = user;
        next();
    })

};

app.listen(4000, () => {
    console.log("Server running at port 4000");
});