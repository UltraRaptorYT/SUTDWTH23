import fetch from 'node-fetch'

export default class API{
    constructor(q){
        this.url = "https://api.edamam.com/api/recipes/v2?type=public&app_id=a146d978&app_key=aaee5d1b6d45b4271eb27f6e1cf87d57"

        let cuisineTypes = ["Indian","American","Italian","Asian","British","Caribbean","Chinese","Eastern Europe"]

        for(let i = 0; i < cuisineTypes.length; i++){
            this.url += `&cuisineType=${cuisineTypes[i]}`
        }

        this.url += `&q=${q}`
    }

    async getRecipes(){
        let response = await fetch(this.url)
        let data = await response.json()
        return data
    }
}
