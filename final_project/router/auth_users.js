const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let user = users.filter((user) => user.username === username);
  if(user.length === 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let user = users.filter((user) => user.username === username && user.password === password);
  if(user.length !== 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  if(authenticatedUser(username, req.body.password)) {
    let token = jwt.sign({
      data: req.body.password
    }, "access", {expiresIn: 60*60});
    req.session.authorization = {
      token, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(400).json({message: "username or password is incorrect"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  Object.keys(books).forEach(function(key, index) {
    if(books[key].isbn === req.params.isbn) {
      books[key].reviews[username] = req.query.reviews;
      return res.status(200).json(books[key]);
    }
  });
  return res.status(404).json({message: "book not found"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  Object.keys(books).forEach(function(key, index) {
    if(books[key].isbn === req.params.isbn) {
      delete books[key].reviews[username];
      return res.status(200).json({message: "user review deleted"});
    }
  });
  return res.status(404).json({message: "book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
