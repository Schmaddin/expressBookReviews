const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const JWT_SECRET = 'aSecretSearchesUniqeness'
let users = [];

const isValid = (username)=>{
    return users[username] ? true : false;
}

const authenticatedUser = (username,password)=>{
    return users[username] && users[username] === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    if(authenticatedUser(req.body.username, req.body.password)) {
        return res.json({token: jwt.sign({user:req.body.username}, JWT_SECRET)});
    }
  //Write your code here
  return res.status(401).json({message: "Invalid auth"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = extractUser(extractToken(req));
    if(!books[req.params.isbn]) {
        return res.status(404).json({message: "Not found"});
    }
    books[req.params.isbn].reviews[username] = req.body;
    return res.status(201).json(books[req.params.isbn]);
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    if(!books[req.params.isbn]) {
        return res.status(404).json({message: "Not found"});
    }
    const username = extractUser(extractToken(req));
    if(!books[req.params.isbn].reviews[username]) {
        return res.status(200).json(books[req.params.isbn]);
    }
    delete books[req.params.isbn].reviews[username]
    return res.status(200).json(books[req.params.isbn]);
});


const extractToken = (request) => {
    const auth = request.header('Authorization');
    if (!auth || !auth.startsWith('Bearer ')) 
        return undefined;
    return auth.slice(7, auth.length).trimLeft(); 
}

const extractUser = (token) => {
    return jwt.decode(token).user;
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.extractToken = extractToken;
module.exports.JWT_SECRET = JWT_SECRET;
