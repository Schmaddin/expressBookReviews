const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const extractToken = require('./router/auth_users.js').extractToken;
const app = express();
const JWT_SECRET = require('./router/auth_users.js').JWT_SECRET;

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const token = extractToken(req);
    if(!token ? false : jwt.verify(token, JWT_SECRET))
    {
        req.next();
    }
    res.end('failed');
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
