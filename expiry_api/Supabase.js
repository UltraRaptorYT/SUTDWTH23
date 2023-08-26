import dotenv from 'dotenv'
dotenv.config({path : '../.env'})

import { createClient } from '@supabase/supabase-js'

export default class Supabase {
    constructor(){
        this.client = createClient(process.env.SUPABASE_LINK , process.env.SUPABASE_KEY)
        this.client.auth.persistSession = false
    }

    async getIngredients(userId) {
        this.client.auth.persistSession = false
        let { data, error } = await this.client.from('user_food')
                                               .select(`* , food(name)`)
                                               .eq('userId', userId)
                                               .order('expired_at', {ascending: false})

        //handle error
        if (error) {
            console.log(error)
            return
        }

        // await this.client.auth.signOut()
        // console.log(data)
        //return data
        if(data.length == 0){
            return null
        }

        let output = []
        for(let entry of data){
            output.push(entry["food"]["name"].toLowerCase())
        }

        return output
    }
}

// trial = new Supabase()
// trial.getIngredients(2)