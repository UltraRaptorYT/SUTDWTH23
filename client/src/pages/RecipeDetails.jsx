import { useParams } from "react-router-dom";
import React, { useEffect } from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function RecipeDetails() {
  const { recipeID } = useParams();

  useEffect(() => {
    async function getRecipe() {
      var { data, error } = await supabase
        .from("recipe")
        .select("*")
        .order("created_at", { ascending: false });
    }
  });
  return <div className="w-full max-w-[400px] mx-auto grow">hi</div>;
}

export default RecipeDetails;
