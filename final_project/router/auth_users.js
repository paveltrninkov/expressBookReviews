const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [{username: "test", password: "test"}];

const isValid = (username)=>{ 
    let valid = true;

    for (const prop in users) {
        if (users[prop].username === username) {
            valid = false;
        }
    }

    return valid;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 600 * 600 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let sessionusername = req.session.authorization.username
    let isbn = req.params.isbn
    let review = req.body.review
    
    if (!books[isbn].reviews.username) {
        books[isbn].reviews[new String(sessionusername)] = review;
    }
    

    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let sessionusername = req.session.authorization.username
    let isbn = req.params.isbn

    delete books[isbn].reviews[new String(sessionusername)];

    res.send("Successfully removed review")
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
