var express = require("express");
let app = express();
app.use(express.json())

app.get("/recipe", (req, res) => {
    cuisine = req.body
})