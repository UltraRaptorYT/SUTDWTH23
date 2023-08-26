const axios = require("axios")

const BASE_URL = "http://localhost:8081/recipe?userId=2"
const BASE_URL2 = "http://127.0.0.1:8000"

function getRecipe(){
    axios.get(`${BASE_URL}/recipe?userId=2`)
    .then((res) => {
        axios({
            method : 'post',
            url : `${BASE_URL2}/RecipeSteps`,
            headers : {},
            data : res
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }).catch((err) => {
        console.log(err)
    })
}