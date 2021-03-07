const express = require("express");
const bodyParser = require("body-parser");
const process = require("process");
const yonius = require("yonius");
const fetch = require("node-fetch");

const info = require("../package");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/entities", async (req, res, next) => {
    async function clojure() {
        const id = req.query.id;
        const type = req.query.type;
        yonius.verify(id && type, "Type and ID are mandatory", 400);

        const result = await fetch("https://www.base.gov.pt/Base4/pt/resultados/", {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: new URLSearchParams({ id: id, type: `detail_${type}s` }).toString()
        });
        const json = await result.json();
        yonius.verify(json.id, "Not found", 404);

        res.json({
            originalUrl: `https://www.base.gov.pt/Base4/pt/detalhe/?type=${type}s&id=${id}`,
            ...json
        });
    }
    clojure().catch(next);
});

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
