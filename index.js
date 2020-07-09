const express = require('express');
const shortid = require('shortid');
const cors = require("cors");

const server = express();

server.use(express.json());

server.use(cors());

let users = [
    {
        id: "zDDngc7qo",
        name: "Jane",
        bio: "Not Tarzan's Wife, another Jane"
    }
];

// Test server
server.get('/', (req, res) => {
    res.json({ message: "testing server" });
});

// Create user
server.post('/api/users', (req, res) => {
    const newUser = req.body;
    if(!(newUser.name || newUser.bio)) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
    try {
        const notNew = users.find(user => user.name === req.body.name);
        if(!notNew) {
            newUser.id = shortid.generate();
            users.push(newUser);
            res.status(201).json(newUser);
        } else {
            res.status(400).json({ errorMessage: "This user exists!" });
        }
    }
    catch {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" });
    }
});

// Get User
server.get('/api/users', (req, res) => {
    try {
        res.status(200).json(users);
    }
    catch {
        res.status(500).json({ errorMessage: "The users information could not be retrieved" });
    }
});

// Get user by id
server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    try {
        const found = users.find(user => user.id === id);

        if(found) {
            res.status(200).json(found);
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
        }
    }   
    catch {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." });
    }

});

// Update user
server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    changes.id = id;

    if(!(changes.name || changes.bio)) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }

    try {        
        const index = users.findIndex(user => user.id === id);

        if(index !== -1) {            
            users[index] = changes;
            res.status(200).json(changes);
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
        }
    }   
    catch {
        res.status(500).json({ errorMessage: "The user information could not be modified." });
    }
});

// Delete
server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const found = users.find(user => user.id === id);

    try {
        if(found) {
            users = users.filter(user => user !== found);
            res.status(200).json(found);
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
        }
    }   
    catch {
        res.status(500).json({ errorMessage: "The user could not be removed" });
    }
});


const PORT = 5000;

server.listen(PORT, () => {
    console.log(`listening on:${PORT}`);
});