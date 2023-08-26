import express from "express";
import cors from "cors";
import Supabase from "./Supabase.js";
import API from "./Api.js";

let app = express();
app.use(express.json())
app.use(cors())

const getExpiryScore = (reqIng , reciIng) => {
    let score = 0
    for(let ing in reciIng){
        let idx = reqIng.indexOf(ing)
        score += idx + 1
    }

    return score
}

app.get("/recipe", async (req, res) => {
    let userId = req.query.userId

    let supabase = new Supabase()
    let ingredients = await supabase.getIngredients(userId)

    if(ingredients == null){
        res.status(404)
        res.send("No ingredients found")
    }

    let api = new API()
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

    scores.sort()
    if(scores.length >= 4){
        let standard = scores[4]
    }else{
        let standard = scores[scores.length - 1]
    }
    

    for(let recipe of recipes){
        recipe = recipe["recipe"]

        if(recipe["score"] >= standard){            
            object = {}
            object["label"] = recipe["label"]
            object["image_object"] = recipe["images"]["SMALL"]
            object["Recipe_steps_url"] = recipe["url"]
            object["ingredientLines"] = recipe["ingredientLines"]
            object["calories"] = recipe["calories"]
            // object["cuisineType"] = recipe["cuisineType"]
            object["healthLabels"] = recipe["healthLabels"]
            object["mealType"] = recipe["mealType"][0]
            object["dishType"] = recipe["dishType"][0]

            recipeObjects.push(object)
        }
    }  

    if(recipeObjects.length != 0){
        res.status(200)
        res.send(recipeObjects)
    }else{
        res.status(404)
        res.send("No recipes with your ingredients")
    }
})

var server = app.listen(8081, function () {
    var host = "localhost"
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })