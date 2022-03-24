const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
// enabling CORS for all requests
app.use(cors());
// request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res, next) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'build') });
});

const PORT = process.env.REACT_APP_PORT || process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// error handler middleware
app.use(function (err, req, res, next) {
    console.log(err)
    if (err.status === 404)
        res.status(404).json({ message: "Not found" });
    else {
        if (err.name === "SequelizeUniqueConstraintError") {
            res.status(500).json({ status: false, errors: err.errors });
        } else if (err.name === "SequelizeValidationError") {
            res.status(500).json({ status: false, errors: err.errors });
        } else {
            res.status(500).json({ status: false, message: "Something went wrong!!!" });
        }
    }
});
