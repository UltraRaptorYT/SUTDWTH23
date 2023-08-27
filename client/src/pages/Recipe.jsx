import React, { useState, useEffect, useRef, useCallback } from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

import { useNavigate } from "react-router-dom";

import axios from "axios";

const BASE_URL2 = "https://docker-test-shec.onrender.com";

function Recipe() {
  const navigate = useNavigate();
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
    <div className="w-full mx-auto flex flex-col max-w-[400px] gap-5 pb-[75px]">
      {recipeList.map((e, idx) => {
        console.log(e);
        return (
          <button
            onClick={() => {
              navigate(`/recipe/${e.id}`);
            }}
            className="flex gap-5"
            key={"recipe" + e.id}
          >
            <img
              src={e.data.image_object.url}
              className="aspect-square w-[75px] min-w-[75px]"
            />
            <div className="flex flex-col justify-start items-start w-full">
              <h1 className="font-bold text-lg">{e.name}</h1>
              <h2 className="text-base w-full text-start">
                Carbon:{" "}
                <span
                  className={
                    "font-bold " +
                    (e.data.co2EmissionsClass == "A"
                      ? "text-[hsl(122,91%,30%)]"
                      : e.data.co2EmissionsClass == "B"
                      ? "text-[hsl(82,78%,40%)]"
                      : e.data.co2EmissionsClass == "C"
                      ? "text-[hsl(63,72%,40%)]"
                      : e.data.co2EmissionsClass == "D"
                      ? "text-[#f7cf55]"
                      : e.data.co2EmissionsClass == "E"
                      ? "text-[#ffc361]"
                      : "text-[#ffa26d]")
                  }
                >
                  {e.data.co2EmissionsClass}, {e.data.totalCO2Emissions.toFixed(2)}
                </span>
              </h2>
              <h2 className="text-base w-full text-start">
                Calories:{" "}
                <span className="font-bold">{e.data.calories.toFixed(2)}</span>
              </h2>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default Recipe;
