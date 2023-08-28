import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

import { useNavigate } from "react-router-dom";

function RecipeDetails() {
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState();
  const [title, setTitle] = useState();
  const [ingredientsList, setIngredientsList] = useState([]);
  const [steps, setSteps] = useState([]);
  const [grade, setGrade] = useState([]);
  const { recipeID } = useParams();

  useEffect(() => {
    async function getRecipe() {
      var { data, error } = await supabase
        .from("recipe")
        .select("*")
        .eq("id", recipeID)
        .order("created_at", { ascending: false });
      console.log(data[0]);
      setImgUrl(data[0].data.image_object.url);
      setTitle(data[0].name);
      setIngredientsList(data[0].data.ingredientLines);
      setSteps(data[0].data.steps.split("\n"));
      setGrade(data[0].data.co2EmissionsClass);
    }
    getRecipe();
  }, []);

  async function makeFood(grade, food) {
    var { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", localStorage.getItem("userid"));
    if (error) {
      console.log(error);
      return;
    }
    let bucks = data[0].bucks;
    let plusPoints;
    switch (grade) {
      case "A":
        plusPoints = 50;
        break;
      case "B":
        plusPoints = 25;
        break;
      case "C":
        plusPoints = 10;
        break;
      case "D":
        plusPoints = 5;
        break;
      case "E":
        plusPoints = 1;
        break;
    }
    bucks += plusPoints;
    var { data, error } = await supabase
      .from("user")
      .update({ bucks: bucks })
      .eq("id", localStorage.getItem("userid"))
      .select();
    if (error) {
      console.log(error);
      return;
    }
    alert(`${food} Made. Grade: ${grade} +${plusPoints}`);
    navigate("/store");
  }

  return (
    <div className="w-full max-w-[400px] mx-auto grow flex flex-col gap-5 pb-[75px]">
      <img
        src={imgUrl}
        className="aspect-square w-1/2 object-contain mx-auto"
      />
      <div className="flex flex-col gap-2">
        <p className="text-center font-bold text-2xl">{title}</p>
        <p className="font-bold">Ingredients: </p>
        <p className="font-normal">{ingredientsList.join(", ")}</p>
        <p className="font-bold">Steps:</p>
        <p className="flex flex-col gap-2">
          {steps.map((e, i) => {
            return <p key={i}>{e}</p>;
          })}
        </p>
        <button
          onClick={() => {
            makeFood(grade, title);
          }}
          className="m-auto flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Make Food
        </button>
      </div>
    </div>
  );
}

export default RecipeDetails;
