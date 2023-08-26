import express from "express";
import cors from "cors";
import Supabase from "./Supabase.js";
import API from "./Api.js";

let app = express();
app.use(express.json())
app.use(cors())


app.get("/recipe", async (req, res) => {
    let cuisine = req.query.cuisine
    let userId = req.query.userId

    let supabase = new Supabase()
    let ingredients = await supabase.getIngredients(userId)

    if(ingredients == null){
        res.status(404)
        res.send("No ingredients found")
    }

    let api = new API(cuisine)
    let recipes = await api.getRecipes(cuisine)

    res.status(200)
    res.send(recipes)
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", "localhost", port)
 })