const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if(!req.body.username && !req.body.password) {
    return res.status(400).json({message: "both username and password should be provided."});
  } else {
    if(isValid(req.body.username)) {
      users.push(req.body);
      return res.status(200).json({message: 'username registered successfully.'})
    } else {
      return res.status(400).json({message: "username is already exist."});
    }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let bookspromise=new Promise((resolve,reject)=> {
    resolve(books);
  });
  bookspromise
  .then((books)=> {
    res.send(JSON.stringify(books,null,4));
  })
  .catch((err) => {
    res.json({message: "error"});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let book; 
  let isbnPromise = new Promise((resolve, reject) => {
    for(const [key, value] of Object.entries(books)) {
      console.log(key);
      if(value.isbn === req.params.isbn) {
        resolve(value);
        break;
      }
    }
    reject("Book not found")
  });

  isbnPromise
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({message: err}))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let bookPromise = new Promise((resolve, reject) => {
    let book = []; 
    for(const [key, value] of Object.entries(books)) {
      console.log(key);
      if(value.author === req.params.author) {
        book.push(value);
      }
    }
    resolve(book);
  })
  bookPromise
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(404).json({message: err}))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let bookPromise = new Promise((resolve, reject) => {
    for(const [key, value] of Object.entries(books)) {
      console.log(key);
      if(value.title === req.params.title) {
        resolve(value);
        break;
      }
    }
    reject("book not found")
  })
  
  bookPromise
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({message: err}))
  });


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let book; 
  for(const [key, value] of Object.entries(books)) {
    console.log(key);
    if(value.isbn === req.params.isbn) {
      book = value;
      break;
    }
  }
  if(book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
