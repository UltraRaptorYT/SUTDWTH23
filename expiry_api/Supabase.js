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

        //handle error
        if (error) {
            console.log(error)
            return
        }

        // await this.client.auth.signOut()
        console.log(data)
        //return data
        if(data.length == 0){
            return null
        }

        return data
    }
}

// trial = new Supabase()
// trial.getIngredients(2)