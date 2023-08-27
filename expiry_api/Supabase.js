import dotenv from 'dotenv'
dotenv.config({path : '../.env'})

import { createClient } from '@supabase/supabase-js'

export default class Supabase {
    constructor(){
        this.key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZya25odGZ4Y3B3YnlkYXJjemxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI4MDAyNjUsImV4cCI6MjAwODM3NjI2NX0.a_BdTMR9eN7Cm0tOjLXYAVeNECYU7ZqbHLtIxZGqmso"
        this.client = createClient("https://vrknhtfxcpwbydarczll.supabase.co/", this.key)
        this.client.auth.persistSession = false
    }

    async getIngredients(userId) {
        this.client.auth.persistSession = false
        let { data, error } = await this.client.from('user_food')
                                               .select(`* , food(base_name)`)
                                               .eq('userId', userId)
                                               .order('expires_in', {ascending: false})

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