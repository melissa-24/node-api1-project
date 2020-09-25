const express = require('express');
const shortid = require('shortid');
const cors = require("cors");

const server = express();

server.use(express.json());

server.use(cors());


const PORT = 5000;

server.listen(PORT, () => {
    console.log(`listening on:${PORT}`);
});