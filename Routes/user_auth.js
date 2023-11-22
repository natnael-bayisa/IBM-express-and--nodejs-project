const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("../Books");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const validUser = users.filter(
    (user) => user.username === username && user.password === password
  );

  if (validUser.length > 0) return true;
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn;
  const user = req.session.authorization.username;
  const review = req.query.review;

  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    book.reviews[user] = review;

    res
      .status(300)
      .send(
        `The review for the book with ISBN ${isbn} has been added/updated.`
      );
  } else {
    res.status(404).send(`The book with the ISBN ${isbn} was not found.`);
  }
});

//delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;

  if (books.hasOwnProperty(isbn)) {
    delete books[isbn].reviews[user];

    res
      .status(300)
      .send(
        `The review of the user ${user} for the book with ISBN ${isbn} has been deleted.`
      );
  }
  res.status(404).send(`The book with the ISBN ${isbn} was not found.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
