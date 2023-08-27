import React, { useState, useEffect, useRef, useCallback } from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

import axios from "axios";

const BASE_URL2 = "https://docker-test-shec.onrender.com";

function Recipe() {
  const [recipeList, setRecipeList] = useState([]);
  useEffect(() => {
    async function getRecipe() {
      var { data, error } = await supabase
        .from("recipe")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.log(error);
      }
      console.log(data);
      setRecipeList(data);
    }
    getRecipe();
    // axios
    //   .post("https://docker-test-shec.onrender.com/RecipeSteps")
    //   .then((res) => {
    //     console.log(res);
    //     axios({
    //       method: "post",
    //       url: `${BASE_URL2}/expire`,
    //       headers: {},
    //       data: { input: String(res.data) },
    //     })
    //       .then((res) => {
    //         console.log(res);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);
  return (
    <div className="w-full mx-auto flex flex-col max-w-[400px]">
      {recipeList.map((e, idx) => {
        console.log(e);
        return (
          <button
            onClick={() => {
            }}
          >
            {e.id}
          </button>
        );
      })}
    </div>
  );
}

export default Recipe;
