const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password" : password});
      return res.status(200).send(JSON.stringify(users, null, 4));
    }
    else {return res.status(404).json({message: "User already exists."})}
  }

  return res.status(404).json({message: "Failed.."})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbnNum = req.params.isbn;
    const returnBook = books[isbnNum]
    
    res.send(JSON.stringify(returnBook, null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  let returnBook = [];

  for (const prop in books) {
    if (books[prop].author === author) {
      returnBook.push(books[prop])
    }
  }

  res.send(JSON.stringify(returnBook, null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  let returnBook = [];

  for (const prop in books) {
    if (books[prop].title.includes(title)) {
      returnBook.push(books[prop])
    }
  }

  res.send(JSON.stringify(returnBook, null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbnNum = req.params.isbn;
  const returnBook = books[isbnNum]
    
  res.send(JSON.stringify(returnBook.reviews, null, 4));
});

module.exports.general = public_users;
