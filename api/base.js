const express = require("express");
const bodyParser = require("body-parser");
const process = require("process");

const info = require("../package");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/info", (req, res, next) => {
    res.json({
        name: info.name,
        version: info.version,
        node: process.version
    });
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const code = err.code || 500;
    const result = { error: err.message, code: code };
    if (process.env.NODE_ENV !== "production") {
        result.stack = err.stack ? err.stack.split("\n") : [];
    }
    res.status(code);
    res.json(result);
});

module.exports = app;
