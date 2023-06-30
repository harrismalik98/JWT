require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

app.post('/login', (req, res) => {

  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}



// Here we are adding Refresh Token
app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401) //401: Unauthorized
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403) // Mean have a token but token is no longer valid and has no access.
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({ name: user.name }) //We just take user.name not "user" object bcause "user" object have more values like issued at and so on.
      res.json({ accessToken: accessToken })
    })
});
  


// Deleting Refresh Token
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    // res.sendStatus(204) //Successfully deleted the token.
    res.status(200).send('Resource successfully deleted.');
});



app.listen(4000, ()=>{
    console.log("Server runnning at port 4000");
})