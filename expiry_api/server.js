import express from "express";
import cors from "cors";
import path from "path"
import Supabase from "./Supabase.js";
import API from "./Api.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let app = express();
app.use(express.json())
app.use(cors())
app.use(express.static(__dirname + "../frontend"))

const getExpiryScore = (reqIng , reciIng) => {
    let score = 0

    for(let i = 0; i < reciIng.length; i++){
        let ing = reciIng[i]
        let idx = reqIng.findIndex(element => element.includes(ing))
        score += idx + 1
    }

    return score
}

app.get("/", (req,res) => {
    res.status(200)
    res.sendFile(path.join(__dirname, '../frontend', 'example.html'))
})

app.get("/recipe", async (req, res) => {
    let userId = req.query.userId
    console.log("userid", userId)
    let supabase = new Supabase()
    let ingredients = await supabase.getIngredients(userId)

    if(ingredients == null){
        res.status(404)
        res.send("No ingredients found")
    }
    console.log(ingredients)
    let api = new API(`${ingredients[0]} ${ingredients[1]}`)
    let recipes = await api.getRecipes()
    recipes = recipes["hits"]

    let recipeObjects = []
    let scores = []

    for(let i = 0; i < recipes.length; i++){
        let recipe = recipes[i]["recipe"]
        let recipeIngredients = recipe["ingredients"].map((x) => x["food"])
        let score = getExpiryScore(ingredients, recipeIngredients)

        recipes[i]['score'] = score
        scores.push(score)
    }

    scores.sort().reverse()  
    let standard = (scores.length >= 4) ? scores[4] : scores[scores.length - 1]

    for(let i = 0; i < recipes.length; i ++){
        let recipe = recipes[i]
        let score = recipe["score"]
        recipe = recipe["recipe"]
        if(score >= standard){         
            let object = {}
            object["label"] = recipe["label"]
            object["image_object"] = recipe["images"]["SMALL"]
            object["Recipe_steps_url"] = recipe["url"]
            object["ingredientLines"] = recipe["ingredientLines"]
            object["calories"] = recipe["calories"]
            object["co2EmissionsClass"] = recipe["co2EmissionsClass"]
            object["totalCO2Emissions"] = recipe["totalCO2Emissions"]   
            // object["cuisineType"] = recipe["cuisineType"]
            object["healthLabels"] = recipe["healthLabels"]
            object["mealType"] = recipe["mealType"][0]
            object["dishType"] = recipe["dishType"][0]

            recipeObjects.push(object)
        }
    }  

    if(recipeObjects.length != 0){
        res.status(200)
        res.send(recipeObjects.slice(0,4))
    }else{
        res.status(404)
        res.send("No recipes with your ingredients")
    }
})

var server = app.listen(8081, function () {
    var host = "localhost"
    var port = server.address().port
    
    console.log("Api server listening at http://%s:%s", host, port)
 })