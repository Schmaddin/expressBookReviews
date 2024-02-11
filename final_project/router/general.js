const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let registerData = req.body;
    console.log('User tries to register:', registerData.username);
    if(users[registerData.username]) {
        return res.status(400).json({message: "Username already registered"});
    } else {
        users[registerData.username] = registerData.password;
        return res.status(200).json({message: "Username registered"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    return books[req.params.isbn] ? res.status(200).json(books[req.params.isbn]) : res.status(404).json({message: "Not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorBooks = {}
    for(isbn in books) {
        if (books[isbn].author===req.params.author) {
            authorBooks[isbn] = books[isbn];
        }
    }
    return res.status(200).json(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let titleBooks = {}
    for(isbn in books) {
        if (books[isbn].title===req.params.title) {
            titleBooks[isbn] = books[isbn];
        }
    }
    return res.status(200).json(titleBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return books[req.params.isbn] ? res.status(200).json(books[req.params.isbn].reviews) : res.status(404).json({message: "Not found"});
});

module.exports.general = public_users;
